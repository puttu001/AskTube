import uuid

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams,
)

from src.config.settings import settings

EMBEDDING_DIM = 1536  # text-embedding-3-small

_client: QdrantClient | None = None


def get_client() -> QdrantClient:
    global _client
    if _client is None:
        _client = QdrantClient(path=str(settings.qdrant_path))
        if not _client.collection_exists(settings.qdrant_collection):
            _client.create_collection(
                collection_name=settings.qdrant_collection,
                vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
            )
    return _client


def _point_id(video_id: str, chunk_index: int) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f"{video_id}:{chunk_index}"))


def upsert_chunks(video_id: str, chunks: list[dict], embeddings: list[list[float]]):
    client = get_client()
    points = [
        PointStruct(
            id=_point_id(video_id, chunk["chunk_index"]),
            vector=embedding,
            payload={
                "video_id": video_id,
                "chunk_index": chunk["chunk_index"],
                "text": chunk["text"],
                "start_time": chunk.get("start_time"),
            },
        )
        for chunk, embedding in zip(chunks, embeddings)
    ]
    client.upsert(collection_name=settings.qdrant_collection, points=points)


def search(video_id: str, query_vector: list[float], top_k: int) -> list[dict]:
    client = get_client()
    results = client.query_points(
        collection_name=settings.qdrant_collection,
        query=query_vector,
        query_filter=Filter(
            must=[FieldCondition(key="video_id", match=MatchValue(value=video_id))]
        ),
        limit=top_k,
    ).points
    return [point.payload for point in results]
