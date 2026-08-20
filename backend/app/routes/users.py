from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from app.database import get_db
from sqlalchemy import select
from app.models import UserSession
from datetime import datetime, timezone
from sqlalchemy.orm import Session

import hashlib

router = APIRouter()


class UserResponse(BaseModel):
    id: int
    name: str | None
    email: str | None
    avatar: str | None
    joined_on: datetime | None
    planting_experience: str | None

    model_config = {"from_attributes": True}


@router.get("/me", response_model=UserResponse)
def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
):
    cookie = request.cookies.get("session")

    if cookie is None:
        raise HTTPException(status_code=403, detail="Not authenticated")

    token_hash = hashlib.sha256(cookie.encode()).hexdigest()

    stmt = select(UserSession).where(UserSession.token_hash == token_hash)

    existing_session = db.scalars(stmt).first()

    if existing_session is None:
        raise HTTPException(status_code=404, detail="Invalid session")

    if existing_session.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired. Login again.")

    return existing_session.user
