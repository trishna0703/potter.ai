from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from app.database import get_db
from sqlalchemy import select
from app.models import UserSession
from datetime import datetime, timezone
from sqlalchemy.orm import Session

import hashlib

from app.services.auth import get_user_by_session

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
    session_id = request.cookies.get("session")

    if session_id is None:
        raise HTTPException(status_code=403, detail="Not authenticated")

    user = get_user_by_session(session_id, db)

    return user
