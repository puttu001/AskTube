from fastapi import APIRouter, HTTPException

from src.api.schemas import ChatMessage, ChatRequest, ChatResponse
from src.core.chat_service import answer_question
from src.storage import sqlite_store as db

router = APIRouter(prefix="/videos/{video_id}/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def ask_question(video_id: str, request: ChatRequest):
    video = db.get_video(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    if video["status"] != "ready":
        raise HTTPException(
            status_code=409, detail=f"Video is not ready yet (status: {video['status']})"
        )
    answer = answer_question(video_id, request.question)
    return ChatResponse(answer=answer)


@router.get("", response_model=list[ChatMessage])
def get_chat_history(video_id: str):
    video = db.get_video(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return [
        ChatMessage(role=m["role"], content=m["content"]) for m in db.get_messages(video_id)
    ]
