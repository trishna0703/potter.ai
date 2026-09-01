from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.calendar_connection import GoogleCalendarConnection
from app.services.auth import get_session
from app.services.google_calendar import (
    add_query_param,
    build_google_oauth_flow,
    check_google_calendar_callback_error,
    clear_oauth_state,
    generate_oauth_code_verifier,
    generate_oauth_state,
    get_authorization_credentials,
    get_google_account_identity,
    save_google_calendar_connection,
    save_oauth_state,
    validate_google_calendar_integration_state,
    get_google_callback_state,
    validate_oauth_redirect_uri,
)
from fastapi import Query

router = APIRouter(
    prefix="/integrations/google-calendar",
    tags=["Google Calendar"],
)


def get_current_user_from_session(
    request: Request,
    db: Session,
):
    session_id = request.cookies.get("session")

    if session_id is None:
        raise HTTPException(
            status_code=403,
            detail="Not authenticated",
        )

    current_session = get_session(session_id, db)

    if current_session is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid session",
        )

    if current_session.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=401,
            detail="Session expired. Login again.",
        )

    return current_session


@router.get("/connect")
def connect_google_calendar(
    request: Request,
    return_to: str,
    db: Session = Depends(get_db),
):
    redirect_uri = validate_oauth_redirect_uri(return_to)
    current_session = get_current_user_from_session(request, db)

    code_verifier = generate_oauth_code_verifier()

    state = generate_oauth_state()

    save_oauth_state(
        session=current_session,
        state=state,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
    )

    current_session.oauth_code_verifier = code_verifier
    current_session.oauth_return_to = redirect_uri

    db.commit()

    flow = build_google_oauth_flow(
        code_verifier=code_verifier,
    )

    authorization_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
        state=state,
    )

    return RedirectResponse(
        url=authorization_url,
        status_code=302,
    )


@router.get("/callback")
def google_calendar_callback(
    request: Request,
    db: Session = Depends(get_db),
):

    current_session = get_current_user_from_session(request, db)

    redirect_uri = current_session.oauth_return_to

    if not redirect_uri:
        raise HTTPException(
            status_code=400,
            detail="Missing OAuth return URI",
        )

    code_verifier = current_session.oauth_code_verifier

    if not code_verifier:
        raise HTTPException(
            status_code=400,
            detail="Missing OAuth code verifier",
        )

    check_google_calendar_callback_error(request)

    state = get_google_callback_state(request)

    validate_google_calendar_integration_state(
        session=current_session,
        state=state,
    )

    credentials = get_authorization_credentials(
        authorization_response=str(request.url),
        state=state,
        code_verifier=code_verifier,
    )
    google_account = get_google_account_identity(credentials)

    save_google_calendar_connection(
        db=db,
        user_id=current_session.user_id,
        credentials=credentials,
        google_account_id=google_account["google_account_id"],
    )

    clear_oauth_state(current_session)

    db.commit()

    redirect_uri = add_query_param(
        redirect_uri,
        "calendar",
        "connected",
    )

    return RedirectResponse(
        url=f"{settings.frontend_url}{redirect_uri}",
        status_code=302,
    )


class GoogleCalendarStatusResponse(BaseModel):
    connected: bool


@router.get(
    "/status",
    response_model=GoogleCalendarStatusResponse,
)
def get_google_calendar_status(
    request: Request,
    db: Session = Depends(get_db),
):
    current_session = get_current_user_from_session(request, db)

    stmt = select(GoogleCalendarConnection).where(
        GoogleCalendarConnection.user_id == current_session.user_id
    )

    connection = db.scalar(stmt)

    return GoogleCalendarStatusResponse(
        connected=connection is not None,
    )
