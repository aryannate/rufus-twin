import chromadb
from chromadb.config import Settings
from typing import List


class VectorStore:
    def __init__(self):
        self._client = chromadb.Client(Settings(is_persistent=False, anonymized_telemetry=False))
        self._cols = {}

    def add(self, product_id: int, chunks: List[dict]):
        if not chunks:
            return
        col = self._client.create_collection(f"p_{id(self)}_{product_id}")
        self._cols[product_id] = col
        col.add(
            ids=[f"{product_id}_{i}" for i in range(len(chunks))],
            embeddings=[c["vector"] for c in chunks],
            documents=[c["text"] for c in chunks],
        )

    def query(self, product_id: int, query_text: str, n_results=8) -> List[str]:
        col = self._cols.get(product_id)
        if not col:
            return []
        try:
            res = col.query(query_texts=[query_text], n_results=min(n_results, col.count()))
            return res["documents"][0] if res["documents"] else []
        except Exception:
            return []
