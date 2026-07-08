from src.clients.embeddings import embed_texts
from src.clients.llm import generate_answer
from src.config.settings import settings
from src.storage import sqlite_store as db
from src.storage import vector_store

SYSTEM_PROMPT = (
    "You are a study assistant answering questions about a YouTube video's transcript. "
    "Use only the provided transcript excerpts to answer. If the excerpts don't contain "
    "the answer, say you don't know based on the video."
)


def _format_timestamp(seconds: float | None) -> str:
    if seconds is None:
        return "??:??"
    seconds = int(seconds)
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)
    if h:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"


def answer_question(video_id: str, question: str) -> str:
    query_embedding = embed_texts([question])[0]
    matches = vector_store.search(video_id, query_embedding, settings.retrieval_top_k)

    context = "\n\n".join(
        f"[{_format_timestamp(m['start_time'])}] {m['text']}" for m in matches
    )
    user_prompt = f"Transcript excerpts:\n{context}\n\nQuestion: {question}"

    answer = generate_answer(SYSTEM_PROMPT, user_prompt)

    db.add_message(video_id, "user", question)
    db.add_message(video_id, "assistant", answer)
    return answer
