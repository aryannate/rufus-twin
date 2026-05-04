import asyncio
import logging
from collections import defaultdict
from time import time

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models import AnalyzeRequest, AnalyzeResponse, ProductData
from scraper import scrape_product
from embedder import chunk_and_embed, embed_query
from vector_store import VectorStore
from claude_client import simulate_rufus, score_listing, generate_fixes

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Rufus Twin API", version="1.0.0")

# In production, replace * with your Vercel frontend domain:
# allow_origins=["https://rufus-twin-32ql.vercel.app"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

_rate_store: dict = defaultdict(list)
RATE_LIMIT = 10
RATE_WINDOW = 3600


def check_rate_limit(ip: str):
    now = time()
    _rate_store[ip] = [t for t in _rate_store[ip] if now - t < RATE_WINDOW]
    if len(_rate_store[ip]) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Max 10 analyses per hour.")
    _rate_store[ip].append(now)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url}: {exc}", exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Internal server error. Check server logs."})


@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest, request: Request):
    check_rate_limit(request.client.host)

    keys = req.api_keys
    scrape_warning = None
    all_urls = [req.main_url] + req.competitor_urls

    scraped = await asyncio.gather(*[scrape_product(url, keys.scraperapi_key) for url in all_urls])

    main_product = scraped[0]
    if main_product.scrape_failed:
        if req.main_text:
            main_product = ProductData(url=req.main_url, title="Your Product", description=req.main_text)
            scraped = list(scraped)
            scraped[0] = main_product
            scrape_warning = "Scraping failed. Analysis is based on the text you provided."
        else:
            raise HTTPException(
                status_code=422,
                detail=(
                    "Failed to scrape your Amazon product URL. Amazon may be blocking the request. "
                    "Please paste your listing text in the 'Manual Text' field and try again."
                ),
            )

    products = [p for p in scraped if not p.scrape_failed]
    if len(products) < len(scraped):
        failed_count = len(scraped) - len(products)
        scrape_warning = scrape_warning or f"{failed_count} competitor URL(s) could not be scraped and were skipped."

    if not products:
        raise HTTPException(status_code=422, detail="No products could be processed.")

    embedded_all, query_vector = await asyncio.gather(
        asyncio.gather(*[chunk_and_embed(p, keys.openai_api_key) for p in products]),
        embed_query(req.shopper_query, keys.openai_api_key),
    )

    store = VectorStore()
    for i, chunks in enumerate(embedded_all):
        store.add(i, chunks)

    all_contexts = [store.query(i, query_vector) for i in range(len(products))]
    main_context = all_contexts[0]

    simulation_result, score_result, fixes_result = await asyncio.gather(
        simulate_rufus(all_contexts, req.shopper_query, products, keys.anthropic_api_key),
        score_listing(main_context, req.shopper_query, products[0], keys.anthropic_api_key),
        generate_fixes(products[0], req.shopper_query, keys.anthropic_api_key),
    )

    competitor_scores = []
    if len(products) > 1:
        comp_score_tasks = [
            score_listing(all_contexts[i], req.shopper_query, products[i], keys.anthropic_api_key)
            for i in range(1, len(products))
        ]
        comp_scores = await asyncio.gather(*comp_score_tasks)
        for i, cs in enumerate(comp_scores):
            competitor_scores.append({"title": products[i + 1].title, **cs})

    return AnalyzeResponse(
        simulation=simulation_result,
        score=score_result,
        fixes=fixes_result,
        competitor_scores=competitor_scores,
        scrape_warning=scrape_warning,
    )
