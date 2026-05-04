import httpx
import logging
from bs4 import BeautifulSoup
from models import ProductData
import config

logger = logging.getLogger(__name__)


def sanitize_url(url: str) -> str:
    url = url.strip()
    if not url.startswith("https://"):
        raise ValueError(f"Invalid URL scheme: {url}")
    if "localhost" in url or "127.0.0.1" in url:
        raise ValueError("Local URLs are not allowed")
    return url


async def scrape_product(url: str) -> ProductData:
    try:
        clean_url = sanitize_url(url)
        # Only log the Amazon URL, never the ScraperAPI URL with key
        logger.info(f"Scraping: {clean_url}")
        api_url = (
            f"https://api.scraperapi.com"
            f"?api_key={config.SCRAPERAPI_KEY}"
            f"&url={clean_url}"
            f"&render=true"
            f"&country_code=us"
        )
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.get(api_url)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "lxml")

        title = _extract_title(soup)
        if not title:
            logger.warning(f"Empty title for {clean_url}. Amazon may have blocked request.")
            return ProductData(url=url, scrape_failed=True)

        return ProductData(
            url=url,
            title=title,
            bullets=_extract_bullets(soup),
            description=_extract_description(soup),
            reviews=_extract_reviews(soup),
            qa=_extract_qa(soup),
            brand=_extract_brand(soup),
            price=_extract_price(soup),
            scrape_failed=False,
        )
    except ValueError as e:
        logger.error(f"URL validation failed: {e}")
        return ProductData(url=url, scrape_failed=True)
    except Exception as e:
        logger.error(f"Scrape failed for {url}: {e}")
        return ProductData(url=url, scrape_failed=True)


def _extract_title(soup):
    tag = soup.find(id="productTitle")
    return tag.get_text(strip=True) if tag else ""


def _extract_bullets(soup):
    ul = soup.find(id="feature-bullets")
    if not ul:
        return []
    return [li.get_text(strip=True) for li in ul.find_all("li") if li.get_text(strip=True)][:7]


def _extract_description(soup):
    tag = soup.find(id="productDescription")
    return tag.get_text(strip=True)[:1500] if tag else ""


def _extract_reviews(soup):
    reviews = soup.find_all("span", {"data-hook": "review-body"})
    return [r.get_text(strip=True)[:300] for r in reviews[:20]]


def _extract_qa(soup):
    result = []
    for item in soup.find_all("div", class_="askTwisterSlotDiv")[:10]:
        q = item.find("span", class_="a-declarative")
        a = item.find("span", class_="askLongText") or item.find("span", class_="a-size-base")
        if q and a:
            result.append(f"Q: {q.get_text(strip=True)} A: {a.get_text(strip=True)}")
    return result


def _extract_brand(soup):
    tag = soup.find(id="bylineInfo")
    return tag.get_text(strip=True) if tag else ""


def _extract_price(soup):
    tag = soup.find("span", class_="a-price-whole")
    return tag.get_text(strip=True) if tag else ""
