# AskTube

Chat with any YouTube video. Paste a URL, and ask questions about it instead of scrubbing
through the timeline looking for the part you need — answers are generated from the video's
actual transcript, not guesswork.

## Use case

Long videos are slow to search. If you want one fact, one explanation, or one summary buried
somewhere in a 40-minute video, you either watch the whole thing or scrub around guessing.

- **Students**: turn lecture recordings and tutorial videos into something you can query —
  "what's the formula they derived in the second half?", "summarize the part about X",
  "what are the key takeaways?" — instead of rewatching to find it.
- **Anyone else**: research videos, talks, podcasts, reviews — ask the video a question
  directly and get an answer grounded in what was actually said, with no rewatching required.

## How to use it

1. Paste a YouTube URL.
2. Wait for the transcript to be fetched and processed.
3. Ask anything about the video. A few general starter prompts (summarize it, main theme,
   key takeaways, etc.) are offered if you're not sure where to start — click one or just
   type your own question.

That's the entire interaction.

## Why this isn't deployed live

This started as a plan for a fully hosted product (FastAPI + React, deployed), but building and testing that surfaced a few problems that
becomes a unsolvable issue. The main obstacle from deploying it live was:

- **YouTube blocks transcript requests from datacenter IPs.** Confirmed directly — fetching
  transcripts from a cloud host (Render, AWS, GCP, etc.) gets throttled/blocked in a way it
  doesn't from a home connection. Reliable production use needs a residential/rotating proxy
  service, which costs money and adds a point of failure.


None of these are unsolvable, they just make "live for anyone" a separate project from "works
great for me." So for now, this runs locally, single-user, no auth, no deployment — which
sidesteps every problem above (your own IP isn't blocked, there's no shared quota since it's
just you, and there's no account system to secure).

## Local setup

**Prerequisites:** Python 3.12+, Node 18+, and an [OpenAI API key](https://platform.openai.com/api-keys).

### 1. Clone and configure

```bash
git clone https://github.com/puttu001/AskTube.git
cd AskTube
cp .env.example .env
```

Open `.env` and add your key:

```
OPENAI_API_KEY=sk-...
```

### 2. Start the backend

```bash
cd server
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```

### 3. Start the frontend

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** and paste a YouTube URL.

## Tech stack

| Layer | Choice |
|---|---|
| Backend API | FastAPI |
| Frontend | React + Vite |
| Relational storage | SQLite (video metadata, cached transcripts, chat history) |
| Vector database | Qdrant, local/embedded mode |
| Transcript extraction | yt-dlp |
| Embeddings + LLM | OpenAI API |

## Project structure

```
server/src/
  main.py              # FastAPI app + CORS + startup
  config/settings.py    # env-driven settings
  api/
    schemas.py           # request/response models
    routes/               # HTTP layer (videos, chat)
  core/
    ingestion_service.py  # fetch -> chunk -> embed -> store
    chat_service.py        # embed query -> retrieve -> generate
  clients/                 # OpenAI, yt-dlp wrappers
  processing/              # token-aware chunking
  storage/                 # SQLite + Qdrant

client/src/
  App.jsx
  api/         # HTTP calls to the backend
  hooks/       # state/business logic (ingestion, chat, history, theme)
  components/  # presentation only (Sidebar, VideoLoader, ChatView, HistoryList)
```

<img width="300" height="140" alt="image" src="https://github.com/user-attachments/assets/b1b82054-c97e-444a-a4c3-f5bb2d3624ca" />
<img width="300" height="140" alt="image" src="https://github.com/user-attachments/assets/f356209f-6d79-48b5-bd32-3d2a78245b9a" />
<img width="300" height="140" alt="image" src="https://github.com/user-attachments/assets/91ef83ab-0e20-49a6-ba19-c9b67fedd5cf" />
