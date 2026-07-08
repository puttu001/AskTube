from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR.parent / ".env", extra="ignore")

    openai_api_key: str
    embedding_model: str = "text-embedding-3-small"
    chat_model: str = "gpt-4o-mini"

    sqlite_path: Path = DATA_DIR / "asktube.db"
    qdrant_path: Path = DATA_DIR / "qdrant"
    qdrant_collection: str = "transcript_chunks"

    chunk_size_tokens: int = 500
    chunk_overlap_tokens: int = 50
    retrieval_top_k: int = 5


settings = Settings()
