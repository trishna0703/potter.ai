from fastapi import APIRouter, Depends, HTTPException, Request
from app.database import Session, get_db
from sqlalchemy import select
from app.models import User, UserSession
from datetime import datetime, timezone

import hashlib

router = APIRouter()


@router.get("/me")
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

    current_user = existing_session.user

    return current_user
