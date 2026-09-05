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
from app.services.google_calendar import GoogleCalendarService
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
    google_calendar_service = GoogleCalendarService(db=db)
    redirect_uri = google_calendar_service.validate_oauth_redirect_uri(
        redirect_uri=return_to
    )
    current_session = get_current_user_from_session(request, db)

    code_verifier = google_calendar_service.generate_oauth_code_verifier()

    state = google_calendar_service.generate_oauth_state()

    google_calendar_service.save_oauth_state(
        session=current_session,
        state=state,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
    )

    current_session.oauth_code_verifier = code_verifier
    current_session.oauth_return_to = redirect_uri

    db.commit()

    flow = google_calendar_service.build_google_oauth_flow(
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
    google_calendar_service = GoogleCalendarService(db=db)
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

    google_calendar_service.check_google_calendar_callback_error(request)

    state = google_calendar_service.get_google_callback_state(request)

    google_calendar_service.validate_google_calendar_integration_state(
        session=current_session,
        state=state,
    )

    credentials = google_calendar_service.get_authorization_credentials(
        authorization_response=str(request.url),
        state=state,
        code_verifier=code_verifier,
    )
    google_account = google_calendar_service.get_google_account_identity(credentials=credentials)

    google_calendar_service.save_google_calendar_connection(
        user_id=current_session.user_id,
        credentials=credentials,
        google_account_id=google_account["google_account_id"],
    )

    google_calendar_service.clear_oauth_state(session=current_session)

    db.commit()

    redirect_uri = google_calendar_service.add_query_param(
        url=redirect_uri,
        key="calendar",
        value="connected",
    )

    return RedirectResponse(
        url=f"{settings.frontend_url}{redirect_uri}",
        status_code=302,
    )


class GoogleCalendarStatusResponse(BaseModel):
    connected: bool


def get_google_calendar_connection(
    user_id: int,
    db: Session = Depends(get_db),
):

    stmt = select(GoogleCalendarConnection).where(
        GoogleCalendarConnection.user_id == user_id
    )

    return db.scalar(stmt)


@router.get(
    "/status",
    response_model=GoogleCalendarStatusResponse,
)
def get_google_calendar_status(
    request: Request,
    db: Session = Depends(get_db),
):
    google_calendar_service = GoogleCalendarService(db=db)
    current_session = get_current_user_from_session(request, db)

    connection = get_google_calendar_connection(
        db=db,
        user_id=current_session.user_id,
    )

    print("USER ID:", current_session.user_id)
    print("CALENDAR CONNECTION:", connection)

    if connection is None:
        return GoogleCalendarStatusResponse(connected=False)

    connected = google_calendar_service.check_google_calendar_connection(
        connection=connection,
    )

    print("CALENDAR CHECK RESULT:", connected)

    return GoogleCalendarStatusResponse(connected=connected)
