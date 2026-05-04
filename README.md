# Rufus Twin

Simulate how Amazon Rufus responds to shoppers asking about your product. Get a Rufus Readiness Score and 3 paste-ready listing fixes.

## Live Demo
[https://rufus-twin.vercel.app](https://rufus-twin.vercel.app)

## How It Works
1. Paste your Amazon product URL and up to 4 competitor URLs
2. Type the shopper query (e.g. "best magnesium for seniors")
3. The app scrapes all listings, embeds them into a vector store, and runs a RAG pipeline
4. Claude simulates a Rufus response and scores your listing on 5 dimensions
5. You get 3 exact copy fixes ready to paste into Seller Central

## APIs Used
- ScraperAPI — Amazon listing scraping with rotating proxies
- OpenAI text-embedding-3-small — Vector embeddings
- Anthropic Claude Sonnet — Rufus simulation, scoring, fix generation
- ChromaDB — In-memory vector store (no external service needed)

## Local Setup

### Backend
```bash
cd backend
cp .env.example .env
# Add your API keys to .env
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev
```

### Docker (both together)
```bash
cp backend/.env.example backend/.env
# Add your API keys to backend/.env
docker-compose up --build
```

## Deployment
- Backend: Railway (connect GitHub repo, set env vars, deploy /backend)
- Frontend: Vercel (connect GitHub repo, set root to /frontend, set VITE_API_URL)

## Built By
Aryan Natekar — Autonova AI LLP
