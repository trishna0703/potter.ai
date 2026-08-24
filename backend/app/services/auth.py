# app/auth/services.py

from datetime import datetime, timezone
import hashlib

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.session import UserSession
from app.models.user import User


def get_session(session_id: str, db: Session):
    token_hash = hashlib.sha256(session_id.encode()).hexdigest()

    stmt = select(UserSession).where(UserSession.token_hash == token_hash)

    return db.scalars(stmt).first()


def get_user_by_session(session_id: str, db: Session) -> User:

    current_session = get_session(session_id, db)
    if current_session is None:
        raise HTTPException(status_code=404, detail="Invalid session")

    if current_session.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired. Login again.")

    return current_session.user
