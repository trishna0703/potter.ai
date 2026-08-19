from fastapi import Depends, HTTPException, APIRouter, Response
from app.database import settings, get_db

from app.models import User, UserSession
from google.oauth2 import id_token
from google.auth.transport import requests
from sqlalchemy import select
from sqlalchemy.orm import Session
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

router = APIRouter()


class GoogleTokenRequest(BaseModel):
    token: str


@router.post("/google")
def login_with_google(
    data: GoogleTokenRequest,
    response: Response,
    db: Session = Depends(get_db),
):

    try:
        user = id_token.verify_oauth2_token(
            data.token, requests.Request(), settings.google_client_id
        )

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google ID token")

    google_sub = user["sub"]
    name = user.get("name")
    email = user.get("email")
    avatar = user.get("picture")

    stmt = select(User).where(User.google_sub == google_sub)

    existing_user = db.scalars(stmt).first()

    session_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(session_token.encode()).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(days=30)

    try:

        if existing_user is None:
            existing_user = User(
                google_sub=google_sub, name=name, email=email, avatar=avatar
            )

            db.add(existing_user)
            db.flush()

        new_session = UserSession(
            token_hash=token_hash, user_id=existing_user.id, expires_at=expires_at
        )

        db.add(new_session)
        db.commit()

    except Exception:
        db.rollback()
        raise

    response.set_cookie(
        key="session",
        value=session_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 30,
    )

    return {
        "name": existing_user.name,
        "email": existing_user.email,
        "avatar": existing_user.avatar,
    }
