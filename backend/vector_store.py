import math
from typing import List


def _cosine_sim(a: List[float], b: List[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(x * x for x in b))
    return dot / (mag_a * mag_b + 1e-9)


class VectorStore:
    def __init__(self):
        self._data: dict = {}

    def add(self, product_id: int, chunks: List[dict]):
        if not chunks:
            return
        self._data[product_id] = chunks

    def query(self, product_id: int, query_vector: List[float], n_results: int = 8) -> List[str]:
        chunks = self._data.get(product_id)
        if not chunks:
            return []
        scored = [
            (_cosine_sim(query_vector, c["vector"]), c["text"])
            for c in chunks
        ]
        scored.sort(reverse=True)
        return [text for _, text in scored[:n_results]]
