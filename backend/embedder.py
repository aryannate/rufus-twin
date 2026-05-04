from openai import AsyncOpenAI
from typing import List
from models import ProductData


def build_product_text(p: ProductData) -> str:
    parts = [f"TITLE: {p.title}"]
    if p.bullets:
        parts.append("KEY FEATURES:\n" + "\n".join(f"- {b}" for b in p.bullets))
    if p.description:
        parts.append(f"DESCRIPTION: {p.description}")
    if p.reviews:
        parts.append("CUSTOMER REVIEWS:\n" + "\n".join(p.reviews[:20]))
    if p.qa:
        parts.append("Q&A:\n" + "\n".join(p.qa))
    return "\n\n".join(parts)


def split_chunks(text: str, chunk_size=300, overlap=50) -> List[str]:
    words = text.split()
    chunks, start = [], 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunks.append(" ".join(words[start:end]))
        start += chunk_size - overlap
    return chunks


async def chunk_and_embed(product: ProductData, openai_key: str) -> List[dict]:
    text = build_product_text(product)
    if not text.strip():
        return []
    chunks = split_chunks(text)
    client = AsyncOpenAI(api_key=openai_key)
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=chunks,
    )
    return [{"text": c, "vector": item.embedding} for c, item in zip(chunks, response.data)]


async def embed_query(text: str, openai_key: str) -> List[float]:
    client = AsyncOpenAI(api_key=openai_key)
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=[text],
    )
    return response.data[0].embedding
