from collections.abc import Iterator

from src.clients.embeddings import embed_texts
from src.clients.llm import stream_answer
from src.config.settings import settings
from src.prompts.template import SYSTEM_PROMPT
from src.storage import sqlite_store as db
from src.storage import vector_store


def _format_timestamp(seconds: float | None) -> str:
    if seconds is None:
        return "??:??"
    seconds = int(seconds)
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)
    if h:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"


def stream_answer_question(video_id: str, question: str) -> Iterator[str]:
    query_embedding = embed_texts([question])[0]
    matches = vector_store.search(video_id, query_embedding, settings.retrieval_top_k)

    context = "\n\n".join(
        f"[{_format_timestamp(m['start_time'])}] {m['text']}" for m in matches
    )
    user_prompt = f"Transcript excerpts:\n{context}\n\nQuestion: {question}"

    db.add_message(video_id, "user", question)

    chunks = []
    for delta in stream_answer(SYSTEM_PROMPT, user_prompt):
        chunks.append(delta)
        yield delta

    db.add_message(video_id, "assistant", "".join(chunks))
