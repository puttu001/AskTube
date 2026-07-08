from src.clients.embeddings import embed_texts
from src.clients.youtube import extract_video_id, fetch_transcript
from src.config.settings import settings
from src.processing.chunking import chunk_segments
from src.storage import sqlite_store as db
from src.storage import vector_store


def ingest_video(video_id: str, url: str):
    try:
        db.update_video(video_id, status="ingesting")
        title, segments = fetch_transcript(url)
        chunks = chunk_segments(
            segments,
            settings.chunk_size_tokens,
            settings.chunk_overlap_tokens,
            settings.embedding_model,
        )
        embeddings = embed_texts([c["text"] for c in chunks])
        vector_store.upsert_chunks(video_id, chunks, embeddings)
        full_transcript = " ".join(s["text"] for s in segments)
        db.update_video(
            video_id, title=title, transcript=full_transcript, status="ready", error=None
        )
    except Exception as e:
        db.update_video(video_id, status="failed", error=str(e))


def start_ingestion(url: str) -> str:
    video_id = extract_video_id(url)
    existing = db.get_video(video_id)
    if existing and existing["status"] == "ready":
        return video_id
    db.create_video(video_id, url)
    return video_id
