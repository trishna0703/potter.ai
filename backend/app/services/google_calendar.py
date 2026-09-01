from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
import secrets
from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException, Request
from google_auth_oauthlib.flow import Flow
from sqlalchemy import select
from sqlalchemy.orm import Session
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from app.config import settings
from app.models.calendar_connection import GoogleCalendarConnection
from app.models.session import UserSession
import os

if settings.environment == "development":
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

GOOGLE_CALENDAR_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/calendar.events",
]


def get_google_account_identity(credentials: Credentials) -> dict:
    oauth2_service = build(
        "oauth2",
        "v2",
        credentials=credentials,
    )

    user_info = oauth2_service.userinfo().get().execute()

    google_account_id = user_info.get("id")

    if not google_account_id:
        raise HTTPException(
            status_code=400,
            detail="Unable to identify Google account.",
        )

    return {
        "google_account_id": google_account_id,
        "email": user_info.get("email"),
    }


def build_google_oauth_flow(
    *,
    state: str | None = None,
    code_verifier: str | None = None,
) -> Flow:
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=GOOGLE_CALENDAR_SCOPES,
        state=state,
        code_verifier=code_verifier,
    )

    flow.redirect_uri = settings.google_calendar_redirect_uri

    return flow


def generate_oauth_state() -> str:
    return secrets.token_urlsafe(32)


def generate_oauth_code_verifier() -> str:
    return secrets.token_urlsafe(64)


def save_oauth_state(
    session: UserSession,
    state: str,
    expires_at: datetime,
) -> None:
    session.oauth_state = state
    session.oauth_state_expires_at = expires_at


def validate_google_calendar_integration_state(
    session: UserSession,
    state: str,
) -> None:
    if session.oauth_state != state:
        raise HTTPException(
            status_code=400,
            detail="Invalid OAuth state",
        )

    if (
        session.oauth_state_expires_at is None
        or session.oauth_state_expires_at < datetime.now(timezone.utc)
    ):
        raise HTTPException(
            status_code=400,
            detail="OAuth state expired",
        )


def get_authorization_credentials(
    authorization_response: str,
    state: str,
    code_verifier: str,
):
    flow = build_google_oauth_flow(
        state=state,
        code_verifier=code_verifier,
    )

    flow.fetch_token(
        authorization_response=authorization_response,
    )

    return flow.credentials


def save_google_calendar_connection(
    *,
    db: Session,
    user_id: int,
    credentials: Any,
    google_account_id: str,
) -> GoogleCalendarConnection:

    stmt = select(GoogleCalendarConnection).where(
        GoogleCalendarConnection.user_id == user_id
    )

    calendar_connection = db.scalar(stmt)

    if calendar_connection is None:
        calendar_connection = GoogleCalendarConnection(
            user_id=user_id,
            google_account_id=google_account_id,
            access_token=credentials.token,
            refresh_token=credentials.refresh_token,
            token_expires_at=credentials.expiry,
        )

        db.add(calendar_connection)

    else:
        calendar_connection.access_token = credentials.token
        calendar_connection.token_expires_at = credentials.expiry

        if credentials.refresh_token:
            calendar_connection.refresh_token = credentials.refresh_token

    return calendar_connection


def clear_oauth_state(session: UserSession) -> None:
    session.oauth_state = None
    session.oauth_state_expires_at = None


def check_google_calendar_callback_error(
    request: Request,
) -> None:
    error = request.query_params.get("error")

    if error:
        raise HTTPException(
            status_code=400,
            detail=f"Google Calendar authorization failed: {error}",
        )


def get_google_callback_state(request: Request) -> str:
    state = request.query_params.get("state")

    if not state:
        raise HTTPException(
            status_code=400,
            detail="Missing OAuth state",
        )

    return state


def validate_oauth_redirect_uri(redirect_uri: str) -> str:
    if not redirect_uri.startswith("/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid redirect URI",
        )

    if redirect_uri.startswith("//"):
        raise HTTPException(
            status_code=400,
            detail="Invalid redirect URI",
        )

    return redirect_uri




def add_query_param(
    url: str,
    key: str,
    value: str,
) -> str:
    parts = urlsplit(url)

    query = dict(parse_qsl(parts.query))
    query[key] = value

    return urlunsplit(
        (
            parts.scheme,
            parts.netloc,
            parts.path,
            urlencode(query),
            parts.fragment,
        )
    )
