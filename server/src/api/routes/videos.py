from fastapi import APIRouter, BackgroundTasks, HTTPException

from src.api.schemas import IngestRequest, VideoResponse
from src.core.ingestion_service import ingest_video, start_ingestion
from src.storage import sqlite_store as db

router = APIRouter(prefix="/videos", tags=["videos"])


@router.post("", response_model=VideoResponse)
def create_video(request: IngestRequest, background_tasks: BackgroundTasks):
    video_id = start_ingestion(request.url)
    video = db.get_video(video_id)
    if video["status"] != "ready":
        background_tasks.add_task(ingest_video, video_id, request.url)
    return VideoResponse(**dict(video))


@router.get("", response_model=list[VideoResponse])
def list_videos():
    return [VideoResponse(**dict(v)) for v in db.list_videos()]


@router.get("/{video_id}", response_model=VideoResponse)
def get_video(video_id: str):
    video = db.get_video(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return VideoResponse(**dict(video))
