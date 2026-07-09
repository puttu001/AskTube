from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from src.api.schemas import ChatMessage, ChatRequest
from src.core.chat_service import stream_answer_question
from src.storage import sqlite_store as db

router = APIRouter(prefix="/videos/{video_id}/chat", tags=["chat"])


@router.post("")
def ask_question(video_id: str, request: ChatRequest):
    video = db.get_video(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    if video["status"] != "ready":
        raise HTTPException(
            status_code=409, detail=f"Video is not ready yet (status: {video['status']})"
        )
    return StreamingResponse(
        stream_answer_question(video_id, request.question), media_type="text/plain"
    )


@router.get("", response_model=list[ChatMessage])
def get_chat_history(video_id: str):
    video = db.get_video(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return [
        ChatMessage(role=m["role"], content=m["content"]) for m in db.get_messages(video_id)
    ]
