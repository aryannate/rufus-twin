from pydantic import BaseModel, field_validator
from typing import List, Optional


class ApiKeys(BaseModel):
    scraperapi_key: str
    openai_api_key: str
    anthropic_api_key: str

    @field_validator("scraperapi_key", "openai_api_key", "anthropic_api_key")
    @classmethod
    def key_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("API key must not be empty")
        return v.strip()


class AnalyzeRequest(BaseModel):
    api_keys: ApiKeys
    main_url: str
    competitor_urls: List[str] = []
    shopper_query: str
    main_text: Optional[str] = None

    @field_validator("shopper_query")
    @classmethod
    def query_not_empty(cls, v):
        if not v or len(v.strip()) < 5:
            raise ValueError("Shopper query must be at least 5 characters")
        return v.strip()

    @field_validator("competitor_urls")
    @classmethod
    def max_four_competitors(cls, v):
        if len(v) > 4:
            raise ValueError("Maximum 4 competitor URLs allowed")
        return v

    @field_validator("main_url")
    @classmethod
    def validate_amazon_url(cls, v):
        if v and "amazon" not in v.lower() and v != "":
            raise ValueError("main_url must be an Amazon product URL")
        return v


class ProductData(BaseModel):
    url: str
    title: str = ""
    bullets: List[str] = []
    description: str = ""
    reviews: List[str] = []
    qa: List[str] = []
    brand: str = ""
    price: str = ""
    scrape_failed: bool = False


class ScoreDimension(BaseModel):
    score: int
    label: str
    explanation: str
    status: str


class ScoreResult(BaseModel):
    total: int
    dimensions: dict


class Fix(BaseModel):
    element: str
    current_text: str
    reason: str
    suggested_copy: str


class AnalyzeResponse(BaseModel):
    simulation: dict
    score: ScoreResult
    fixes: List[Fix]
    competitor_scores: List[dict] = []
    scrape_warning: Optional[str] = None
