# Potter.ai Backend — Everyday Commands

Quick reference for the FastAPI + SQLAlchemy + Alembic + uv backend.

## Start the development server

```powershell
uv run python -m uvicorn main:app --reload
```

## Dependencies

Sync the environment after changing `pyproject.toml`:

```powershell
uv sync
```

Add a backend package:

```powershell
uv add <package-name>
```

Remove a backend package:

```powershell
uv remove <package-name>
```

## Check SQLAlchemy Models

Verify that all models import and are registered:

```powershell
uv run python -c "from app import models; from app.database import Base; print(Base.metadata.tables.keys())"
```

## Alembic Migrations

### Create a migration after changing a model

```powershell
uv run alembic revision --autogenerate -m "describe change"
uv run python -m alembic revision --autogenerate -m "describe change"
```

Example:

```powershell
uv run alembic revision --autogenerate -m "make health concern plant optional"
```

**Inspect the generated migration before running it.**

### Run all pending migrations

```powershell
uv run alembic upgrade head
```

### Check current database revision

```powershell
uv run alembic current
```

### View migration history

```powershell
uv run alembic history
```

### Roll back the latest migration

```powershell
uv run alembic downgrade -1
```

### Create a manual/empty migration

```powershell
uv run alembic revision -m "describe change"
```

## Typical Backend Workflow

### Code-only change

```powershell
uv run python -m uvicorn main:app --reload
```

### Model/schema change

```powershell
# 1. Create migration
uv run alembic revision --autogenerate -m "describe change"

# 2. Inspect the generated migration

# 3. Apply it
uv run alembic upgrade head

# 4. Start/restart the server
uv run python -m uvicorn main:app --reload
```

## Important Alembic Rule

Once a migration has been applied, **don't edit that migration file** to make a new schema change.

Create a new migration instead:

```text
initial schema
      ↓
add sessions
      ↓
make health concern plant optional
```

### Most-used commands

```powershell
# Start backend
uv run python -m uvicorn main:app --reload

# Sync dependencies
uv sync

# Create migration
uv run alembic revision --autogenerate -m "describe change"

# Apply migrations
uv run alembic upgrade head

# Check migration state
uv run alembic current
```
