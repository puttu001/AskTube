from src.clients.openai_client import get_client
from src.config.settings import settings


def generate_answer(system_prompt: str, user_prompt: str) -> str:
    client = get_client()
    response = client.chat.completions.create(
        model=settings.chat_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    return response.choices[0].message.content
