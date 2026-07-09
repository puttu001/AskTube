from pydantic import BaseModel


class IngestRequest(BaseModel):
    url: str


class VideoResponse(BaseModel):
    video_id: str
    url: str
    title: str | None = None
    status: str
    error: str | None = None


class ChatRequest(BaseModel):
    question: str


class ChatMessage(BaseModel):
    role: str
    content: str
