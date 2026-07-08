import sqlite3
from contextlib import contextmanager

from src.config.settings import settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS videos (
    video_id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    transcript TEXT,
    error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id TEXT NOT NULL REFERENCES videos(video_id),
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""


@contextmanager
def get_connection():
    conn = sqlite3.connect(settings.sqlite_path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with get_connection() as conn:
        conn.executescript(SCHEMA)


def create_video(video_id: str, url: str):
    with get_connection() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO videos (video_id, url, status) VALUES (?, ?, 'pending')",
            (video_id, url),
        )


def update_video(video_id: str, **fields):
    if not fields:
        return
    columns = ", ".join(f"{key} = ?" for key in fields)
    values = list(fields.values()) + [video_id]
    with get_connection() as conn:
        conn.execute(f"UPDATE videos SET {columns} WHERE video_id = ?", values)


def get_video(video_id: str) -> sqlite3.Row | None:
    with get_connection() as conn:
        return conn.execute(
            "SELECT * FROM videos WHERE video_id = ?", (video_id,)
        ).fetchone()


def list_videos() -> list[sqlite3.Row]:
    with get_connection() as conn:
        return conn.execute(
            "SELECT video_id, url, title, status, created_at FROM videos ORDER BY created_at DESC"
        ).fetchall()


def add_message(video_id: str, role: str, content: str):
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO messages (video_id, role, content) VALUES (?, ?, ?)",
            (video_id, role, content),
        )


def get_messages(video_id: str) -> list[sqlite3.Row]:
    with get_connection() as conn:
        return conn.execute(
            "SELECT role, content, created_at FROM messages WHERE video_id = ? ORDER BY id ASC",
            (video_id,),
        ).fetchall()
