# Scalable RAG API for News Intelligence

Backend assessment implementation with Node/Express, ChromaDB, Postgres, Redis, BullMQ, Jina embeddings, and Gemini. Includes Docker Compose, rate limiting, Postman collection, and persistence of chat history.

## Stack choices
- ChromaDB for self-hosted vector search; lightweight and Docker-friendly.
- Jina embeddings (with deterministic offline fallback) for open-source embeddings.
- Gemini for generation (with offline fallback string for local/dev without keys).
- Postgres for structured interaction logs; Redis for chat short-term memory and queues; BullMQ for ingestion jobs.
- Express + Zod for routing/validation; Jest for tests; ESLint/Prettier for hygiene.

## Quickstart (local)
1) Copy env: `cp .env.example .env` and set `GEMINI_API_KEY` (optional for real LLM) and `JINA_API_KEY` (optional for real embeddings).
2) Start dependencies (locally or via Docker): Postgres, Redis, Chroma. Update `CHROMA_URL`, `POSTGRES_URL`, `REDIS_URL` in `.env` if needed.
3) Install deps: `npm install`
4) Run dev server: `npm run dev` (listens on `PORT`, default 3000).
5) Ingest sample/news feed data: `POST /ingest`.
6) Ask a question: `POST /chat` with `sessionId` and `query`.

## Quickstart (Docker Compose)
```
docker-compose up --build
```
Services: api (3000), postgres (5432), redis (6379), chroma (8000). Configure keys via env or `.env` loaded by Compose.

## API
- `GET /health`
- `POST /ingest` — queues ingestion (or runs inline if `DISABLE_QUEUE=true`).
- `POST /chat` — body `{ "sessionId": "demo", "query": "What's new in AI?" }`; rate-limited via `RATE_LIMIT_*`.
- `GET /history/:sessionId` — returns ordered interaction logs.
- `DELETE /history/:sessionId` — clears logs and cached context.

## Persistence & caching
- Postgres table `interactions` stores timestamp, session_id, user_query, llm_response, response_time_ms, source_documents.
- Redis stores rolling chat context per session and backs BullMQ ingestion queue.

## Ingestion pipeline
- RSS feeds (Reuters/NYT/WSJ) first; falls back to bundled sample corpus if feeds unavailable.
- Jina embeddings → Chroma upsert.

## Testing & linting
- `npm test` (Jest, with mocks for Redis/PG and queue disabled)
- `npm run lint` / `npm run format`

## Postman collection
Import `docs/postman-collection.json`. Set `base_url` variable (default `http://localhost:3000`).

## Deployment notes
- Dockerfile is multi-stage (build → slim runtime). Compose mounts volumes for Postgres/Chroma persistence.
- Environment defaults live in `.env.example`; adjust rate limits or disable queue via `DISABLE_QUEUE=true` (runs ingestion inline).
