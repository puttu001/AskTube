from collections.abc import Iterator

from src.clients.openai_client import get_client
from src.config.settings import settings


def stream_answer(system_prompt: str, user_prompt: str) -> Iterator[str]:
    client = get_client()
    stream = client.chat.completions.create(
        model=settings.chat_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        stream=True,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
