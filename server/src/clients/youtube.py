import re
import tempfile
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import yt_dlp

TIMESTAMP_RE = re.compile(r"(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})")
TAG_RE = re.compile(r"<[^>]+>")


class TranscriptUnavailable(Exception):
    pass


def extract_video_id(url: str) -> str:
    parsed = urlparse(url)
    if parsed.hostname == "youtu.be":
        return parsed.path.lstrip("/")
    if parsed.hostname and "youtube.com" in parsed.hostname:
        if parsed.path == "/watch":
            qs = parse_qs(parsed.query)
            if "v" in qs:
                return qs["v"][0]
        for prefix in ("/shorts/", "/embed/", "/live/"):
            if parsed.path.startswith(prefix):
                return parsed.path[len(prefix):].split("/")[0]
    raise ValueError(f"Could not extract video ID from URL: {url}")


def _timestamp_to_seconds(ts: str) -> float:
    h, m, s = ts.split(":")
    return int(h) * 3600 + int(m) * 60 + float(s)


def parse_vtt(vtt_text: str) -> list[dict]:
    segments = []
    lines = vtt_text.splitlines()
    last_text = None
    i = 0
    while i < len(lines):
        match = TIMESTAMP_RE.match(lines[i].strip())
        if match:
            start = _timestamp_to_seconds(match.group(1))
            i += 1
            text_lines = []
            while i < len(lines) and lines[i].strip():
                text_lines.append(TAG_RE.sub("", lines[i]).strip())
                i += 1
            text = " ".join(t for t in text_lines if t).strip()
            if text and text != last_text:
                segments.append({"start": start, "text": text})
                last_text = text
        else:
            i += 1
    return segments


def fetch_transcript(url: str) -> tuple[str, list[dict]]:
    video_id = extract_video_id(url)
    with tempfile.TemporaryDirectory() as tmp_dir:
        ydl_opts = {
            "skip_download": True,
            "writesubtitles": True,
            "writeautomaticsub": True,
            "subtitleslangs": ["en"],
            "subtitlesformat": "vtt",
            "outtmpl": str(Path(tmp_dir) / "%(id)s.%(ext)s"),
            "quiet": True,
            "no_warnings": True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)

        title = info.get("title", video_id) if info else video_id
        vtt_files = list(Path(tmp_dir).glob(f"{video_id}*.vtt"))
        if not vtt_files:
            raise TranscriptUnavailable(f"No English transcript available for {url}")
        vtt_text = vtt_files[0].read_text(encoding="utf-8")

    segments = parse_vtt(vtt_text)
    if not segments:
        raise TranscriptUnavailable(f"Transcript was empty for {url}")
    return title, segments
