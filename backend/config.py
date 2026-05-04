import os
from dotenv import load_dotenv

load_dotenv()

SCRAPERAPI_KEY = os.getenv("SCRAPERAPI_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
PORT = int(os.getenv("PORT", 8000))

REQUIRED = {
    "SCRAPERAPI_KEY": SCRAPERAPI_KEY,
    "OPENAI_API_KEY": OPENAI_API_KEY,
    "ANTHROPIC_API_KEY": ANTHROPIC_API_KEY,
}
missing = [k for k, v in REQUIRED.items() if not v]
if missing:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing)}")
