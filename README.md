# Potter.ai

Potter.ai is a full-stack plant care application that helps users identify plants from photos, manage their plant collection, raise health concerns, and receive AI-powered care assessments and recommendations.

## Tech Stack

| Layer      | Technology                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| Frontend   | React 19, TypeScript, Vite, TanStack Query, Zustand, shadcn/ui (Base UI), Tailwind CSS v4 |
| Backend    | FastAPI, SQLAlchemy, Alembic, uv, Pydantic                                 |
| AI         | OpenRouter (plant identification, assessment, recommendations)    |
| Storage    | AWS S3 (photo uploads), PostgreSQL                                         |
| Infra      | Docker Compose, Nginx, Certbot (TLS)                                       |

## Project Structure

```
potter_ai/
├── backend/            # FastAPI + SQLAlchemy + Alembic backend
│   ├── app/
│   │   ├── models/     # SQLAlchemy models
│   │   ├── routes/     # API routes (auth, plants, concerns, identify, upload, websocket)
│   │   ├── schemas/    # Pydantic schemas
│   │   ├── services/   # Business logic + AI services
│   │   └── prompts/    # AI prompt templates
│   ├── migrations/     # Alembic migrations
│   ├── main.py         # FastAPI entry point
│   └── pyproject.toml
├── potter-frontend/    # React + Vite frontend
│   └── src/
│       ├── routes/     # Page-level views (Plants, Concerns, Assessment, ...)
│       ├── components/ # Reusable UI components
│       ├── store/      # Zustand stores
│       ├── hooks/      # Data hooks (TanStack Query)
│       └── lib/        # API endpoints, routes, utilities
├── nginx/              # Reverse proxy configuration
├── docker-compose.yml          # Production stack
└── docker-compose.dev.yml      # Development stack (hot reload)
```

## Features

- **Google OAuth login** — sign in with your Google account.
- **Plant identification** — upload/take a photo and identify the species via AI, with duplicate detection against existing plants.
- **Plant management** — add, edit, mark plants as dead, and toggle between active/inactive views.
- **Health concerns** — raise a concern for a plant with photo evidence.
- **AI-powered assessment** — a real-time WebSocket chat that walks users through a guided care assessment.
- **Care recommendations** — AI-generated recommendations based on assessment outcomes.
- **Photo storage** — direct-to-S3 uploads via presigned URLs.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [uv](https://docs.astral.sh/uv/) (for local backend development)
- [Node.js](https://nodejs.org/) 22+ and npm (for local frontend development)

## Environment Variables

Create a `backend/.env` file (see `docker-compose*.yml` for the variables consumed). Key variables:

```
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL=
GOOGLE_CLIENT_ID=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
OPENROUTER_API_KEY=
AI_MODEL=
FRONTEND_URL=
```

The frontend additionally reads `VITE_GOOGLE_CLIENT_ID` and `VITE_S3_URL` from its environment.

## Cloning

```bash
git clone <repository-url>
cd potter_ai
```

## Running the Project

### Option 1: Docker (recommended)

Development (with hot reload):

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

Production:

```bash
docker compose up -d --build
```

### Option 2: Run locally without Docker

Backend:

```bash
cd backend
uv sync
uv run alembic upgrade head
uv run python -m uvicorn main:app --reload
```

Frontend:

```bash
cd potter-frontend
npm install
npm run dev
```

### Database Migrations

```bash
cd backend
uv run alembic revision --autogenerate -m "describe change"  # create a migration
uv run alembic upgrade head                                    # apply migrations
uv run alembic current                                         # check current revision
```

See `backend/commands.md` for a full list of backend commands.

## API Overview

The backend exposes a JSON API under `/api`:

- `/api/auth` — Google OAuth login/logout
- `/api/users` — current user
- `/api/plants` — plant CRUD (`/api/plants/ACTIVE`, `/api/plants/INACTIVE`)
- `/api/concerns` — health concerns, assessments, recommendations
- `/api/concern/ws/{assessment_id}` — WebSocket assessment chat
- `/api/uploads` — presigned S3 upload URLs
- `/api/identify` — AI plant identification
