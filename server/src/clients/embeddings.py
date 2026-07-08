from src.clients.openai_client import get_client
from src.config.settings import settings


def embed_texts(texts: list[str]) -> list[list[float]]:
    client = get_client()
    embeddings = []
    batch_size = 100
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        response = client.embeddings.create(model=settings.embedding_model, input=batch)
        embeddings.extend(item.embedding for item in response.data)
    return embeddings
