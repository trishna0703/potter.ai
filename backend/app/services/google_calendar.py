import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any
from urllib.parse import (
    parse_qsl,
    urlencode,
    urlsplit,
    urlunsplit,
)

from fastapi import HTTPException, Request as FastAPIRequest
from google.auth.exceptions import RefreshError
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import SessionLocal
from app.models.calendar_connection import GoogleCalendarConnection
from app.models.care_schedule import CareSchedule
from app.models.plant import Plant
from app.models.schedule_calendar_event import CareScheduleCalendarEvent
from app.models.session import UserSession
from app.services.care_event_service import CareScheduleService

if settings.environment == "development":
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"


GOOGLE_CALENDAR_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/calendar.events",
]


class GoogleCalendarService:

    def __init__(self, db: Session):
        self.db = db
        self.care_schedule_service = CareScheduleService(db)

    # ------------------------------------------------------------------
    # OAuth
    # ------------------------------------------------------------------

    def generate_oauth_state(self) -> str:
        return secrets.token_urlsafe(32)

    def generate_oauth_code_verifier(self) -> str:
        return secrets.token_urlsafe(64)

    def build_google_oauth_flow(
        self,
        *,
        state: str | None = None,
        code_verifier: str | None = None,
    ) -> Flow:
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                    "auth_uri": ("https://accounts.google.com/o/oauth2/auth"),
                    "token_uri": ("https://oauth2.googleapis.com/token"),
                }
            },
            scopes=GOOGLE_CALENDAR_SCOPES,
            state=state,
            code_verifier=code_verifier,
        )

        flow.redirect_uri = settings.google_calendar_redirect_uri

        return flow

    def save_oauth_state(
        self,
        session: UserSession,
        state: str,
        expires_at: datetime,
    ) -> None:
        session.oauth_state = state
        session.oauth_state_expires_at = expires_at

    def clear_oauth_state(
        self,
        session: UserSession,
    ) -> None:
        session.oauth_state = None
        session.oauth_state_expires_at = None
        session.oauth_code_verifier = None
        session.oauth_return_to = None

    def validate_google_calendar_integration_state(
        self,
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
        self,
        authorization_response: str,
        state: str,
        code_verifier: str,
    ) -> Credentials:
        flow = self.build_google_oauth_flow(
            state=state,
            code_verifier=code_verifier,
        )

        flow.fetch_token(
            authorization_response=authorization_response,
        )

        return flow.credentials

    # ------------------------------------------------------------------
    # Google account
    # ------------------------------------------------------------------

    def get_google_account_identity(
        self,
        *,
        credentials: Credentials,
    ) -> dict[str, Any]:
        oauth2_service = build(
            "oauth2",
            "v2",
            credentials=credentials,
            cache_discovery=False,
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

    def save_google_calendar_connection(
        self,
        *,
        user_id: int,
        credentials: Credentials,
        google_account_id: str,
    ) -> GoogleCalendarConnection:
        stmt = select(GoogleCalendarConnection).where(
            GoogleCalendarConnection.user_id == user_id
        )

        calendar_connection = self.db.scalar(stmt)

        if calendar_connection is None:
            calendar_connection = GoogleCalendarConnection(
                user_id=user_id,
                google_account_id=google_account_id,
                access_token=credentials.token,
                refresh_token=credentials.refresh_token,
                token_expires_at=credentials.expiry,
            )

            self.db.add(calendar_connection)

        else:
            calendar_connection.google_account_id = google_account_id
            calendar_connection.access_token = credentials.token
            calendar_connection.token_expires_at = credentials.expiry

            if credentials.refresh_token:
                calendar_connection.refresh_token = credentials.refresh_token

        return calendar_connection

    # ------------------------------------------------------------------
    # Callback helpers
    # ------------------------------------------------------------------

    def check_google_calendar_callback_error(
        self,
        request: FastAPIRequest,
    ) -> None:
        error = request.query_params.get("error")

        if error:
            raise HTTPException(
                status_code=400,
                detail=("Google Calendar authorization failed: " f"{error}"),
            )

    def get_google_callback_state(
        self,
        request: FastAPIRequest,
    ) -> str:
        state = request.query_params.get("state")

        if not state:
            raise HTTPException(
                status_code=400,
                detail="Missing OAuth state",
            )

        return state

    def validate_oauth_redirect_uri(
        self,
        redirect_uri: str,
    ) -> str:
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
        self,
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

    # ------------------------------------------------------------------
    # Connection / credentials
    # ------------------------------------------------------------------

    def get_google_calendar_credentials(
        self,
        connection: GoogleCalendarConnection,
    ) -> Credentials:
        return Credentials(
            token=connection.access_token,
            refresh_token=connection.refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=settings.google_client_id,
            client_secret=settings.google_client_secret,
            scopes=GOOGLE_CALENDAR_SCOPES,
        )

    def refresh_google_calendar_credentials(
        self,
        *,
        credentials: Credentials,
        connection: GoogleCalendarConnection,
    ) -> Credentials:
        if credentials.expired and credentials.refresh_token:
            credentials.refresh(GoogleRequest())

            connection.access_token = credentials.token
            connection.token_expires_at = credentials.expiry

        return credentials

    def get_valid_google_calendar_credentials(
        self,
        *,
        connection: GoogleCalendarConnection,
    ) -> Credentials:
        credentials = self.get_google_calendar_credentials(connection)

        return self.refresh_google_calendar_credentials(
            credentials=credentials,
            connection=connection,
        )

    def get_google_calendar_service(
        self,
        *,
        connection: GoogleCalendarConnection,
    ):
        credentials = self.get_valid_google_calendar_credentials(
            connection=connection,
        )

        return build(
            "calendar",
            "v3",
            credentials=credentials,
            cache_discovery=False,
        )

    def get_google_calendar_connection_for_user(
        self,
        user_id: int,
    ) -> GoogleCalendarConnection | None:
        stmt = select(GoogleCalendarConnection).where(
            GoogleCalendarConnection.user_id == user_id
        )

        return self.db.scalar(stmt)

    # ------------------------------------------------------------------
    # Connection status
    # ------------------------------------------------------------------

    def check_google_calendar_connection(
        self,
        *,
        connection: GoogleCalendarConnection,
    ) -> bool:
        credentials = self.get_google_calendar_credentials(connection)

        try:
            if credentials.expired and credentials.refresh_token:
                credentials.refresh(GoogleRequest())

                connection.access_token = credentials.token
                connection.token_expires_at = credentials.expiry

            service = build(
                "calendar",
                "v3",
                credentials=credentials,
                cache_discovery=False,
            )

            service.events().list(
                calendarId="primary",
                maxResults=1,
                singleEvents=True,
            ).execute()

            if credentials.token != connection.access_token:
                connection.access_token = credentials.token
                connection.token_expires_at = credentials.expiry

            self.db.commit()

            return True

        except RefreshError:
            return False

        except HttpError as exc:
            if exc.resp.status == 401:
                return False

            if exc.resp.status == 403:
                print(
                    "Google Calendar permission error:",
                    exc,
                )
                return False

            raise

    # ------------------------------------------------------------------
    # Calendar event creation
    # ------------------------------------------------------------------

    def create_calendar_event(
        self,
        *,
        schedule: CareSchedule,
        plant: Plant,
        connection: GoogleCalendarConnection,
        next_occurrence: datetime,
    ) -> dict[str, Any]:
        service = self.get_google_calendar_service(
            connection=connection,
        )

        title = f"{schedule.care_type.capitalize()} " f"{plant.name} ({plant.species})"

        event_end = next_occurrence + timedelta(minutes=5)

        event = {
            "summary": title,
            "description": schedule.description or "",
            "start": {
                "dateTime": next_occurrence.isoformat(),
                "timeZone": schedule.timezone,
            },
            "end": {
                "dateTime": event_end.isoformat(),
                "timeZone": schedule.timezone,
            },
            "reminders": {
                "useDefault": False,
                "overrides": [
                    {
                        "method": "popup",
                        "minutes": 0,
                    }
                ],
            },
        }

        return (
            service.events()
            .insert(
                calendarId="primary",
                body=event,
            )
            .execute()
        )

    # ------------------------------------------------------------------
    # Background scheduling
    # ------------------------------------------------------------------

    def get_schedule_for_background_task(
        self,
        schedule_id: int,
        user_id: int,
    ) -> CareSchedule | None:
        return self.care_schedule_service.get_schedule_for_user(
            schedule_id=schedule_id,
            user_id=user_id,
        )

    def should_schedule_calendar_event(
        self,
        schedule: CareSchedule,
    ) -> bool:
        return schedule.is_active and schedule.auto_schedule

    def calendar_event_already_exists(
        self,
        schedule_id: int,
    ) -> bool:
        stmt = select(CareScheduleCalendarEvent).where(
            CareScheduleCalendarEvent.care_schedule_id == schedule_id
        )

        return self.db.scalar(stmt) is not None

    def get_next_schedule_occurrence(
        self,
        schedule: CareSchedule,
    ) -> datetime | None:
        return self.care_schedule_service.get_next_occurrence(schedule)

    def create_schedule_calendar_event(
        self,
        *,
        schedule: CareSchedule,
        connection: GoogleCalendarConnection,
        next_occurrence: datetime,
    ) -> dict[str, Any]:
        return self.create_calendar_event(
            schedule=schedule,
            plant=schedule.plant,
            connection=connection,
            next_occurrence=next_occurrence,
        )

    def save_schedule_calendar_event(
        self,
        *,
        schedule: CareSchedule,
        google_event: dict[str, Any],
        next_occurrence: datetime,
    ) -> CareScheduleCalendarEvent:
        event_end = next_occurrence + timedelta(minutes=5)

        return self.care_schedule_service.save_calendar_event(
            schedule=schedule,
            google_event=google_event,
            event_start_at=next_occurrence,
            event_end_at=event_end,
        )

    def schedule_first_calendar_event(
        self,
        schedule_id: int,
        user_id: int,
    ) -> None:
        schedule = self.get_schedule_for_background_task(
            schedule_id=schedule_id,
            user_id=user_id,
        )

        if schedule is None:
            return

        if not self.should_schedule_calendar_event(schedule):
            return

        if self.calendar_event_already_exists(schedule.id):
            return

        connection = self.get_google_calendar_connection_for_user(user_id)

        if connection is None:
            return

        next_occurrence = self.get_next_schedule_occurrence(schedule)

        if next_occurrence is None:
            return

        google_event = self.create_schedule_calendar_event(
            schedule=schedule,
            connection=connection,
            next_occurrence=next_occurrence,
        )

        self.save_schedule_calendar_event(
            schedule=schedule,
            google_event=google_event,
            next_occurrence=next_occurrence,
        )

        self.db.commit()

    @classmethod
    def run_schedule_first_calendar_event(
        cls,
        schedule_id: int,
        user_id: int,
    ) -> None:
        db = SessionLocal()

        try:
            service = cls(db)

            service.schedule_first_calendar_event(
                schedule_id=schedule_id,
                user_id=user_id,
            )

            db.commit()

        except Exception as exc:
            db.rollback()

            print(
                "Failed to schedule first calendar event "
                f"for schedule {schedule_id}: {exc}"
            )

        finally:
            db.close()

    def get_schedule_calendar_event(
        self,
        *,
        schedule_id: int,
    ) -> CareScheduleCalendarEvent | None:
        stmt = select(CareScheduleCalendarEvent).where(
            CareScheduleCalendarEvent.care_schedule_id == schedule_id,
        )

        return self.db.scalar(stmt)

    def delete_google_calendar_event(
        self,
        *,
        connection: GoogleCalendarConnection,
        calendar_event: CareScheduleCalendarEvent,
    ) -> None:
        service = self.get_google_calendar_service(
            connection=connection,
        )

        try:
            service.events().delete(
                calendarId=calendar_event.calendar_id,
                eventId=calendar_event.google_event_id,
            ).execute()

        except HttpError as exc:
            if exc.resp.status != 404:
                raise

    def delete_schedule_calendar_event(
        self,
        *,
        calendar_event: CareScheduleCalendarEvent,
    ) -> None:
        self.db.delete(calendar_event)
        self.db.flush()

    def update_google_calendar_event(
        self,
        *,
        connection: GoogleCalendarConnection,
        schedule: CareSchedule,
        calendar_event: CareScheduleCalendarEvent,
        next_occurrence: datetime,
    ) -> None:
        service = self.get_google_calendar_service(
            connection=connection,
        )

        event_end = next_occurrence + timedelta(minutes=5)

        event = {
            "summary": (
                f"{schedule.care_type.capitalize()} "
                f"{schedule.plant.name} ({schedule.plant.species})"
            ),
            "description": schedule.description or "",
            "start": {
                "dateTime": next_occurrence.isoformat(),
                "timeZone": schedule.timezone,
            },
            "end": {
                "dateTime": event_end.isoformat(),
                "timeZone": schedule.timezone,
            },
            "reminders": {
                "useDefault": False,
                "overrides": [
                    {
                        "method": "popup",
                        "minutes": 0,
                    }
                ],
            },
        }

        service.events().update(
            calendarId=calendar_event.calendar_id,
            eventId=calendar_event.google_event_id,
            body=event,
        ).execute()

        calendar_event.event_start_at = next_occurrence
        calendar_event.event_end_at = event_end
        calendar_event.last_synced_at = datetime.now(timezone.utc)

        self.db.flush()

    def sync_updated_schedule(
        self,
        *,
        schedule_id: int,
        user_id: int,
    ) -> None:

        schedule = self.care_schedule_service.get_schedule_for_user(
            schedule_id=schedule_id,
            user_id=user_id,
        )

        if schedule is None:
            return

        calendar_event = self.get_schedule_calendar_event(
            schedule_id=schedule.id,
        )

        should_schedule = self.should_schedule_calendar_event(
            schedule,
        )

        connection = self.get_google_calendar_connection_for_user(
            user_id=user_id,
        )

        if not should_schedule:
            if calendar_event is None:
                return

            if connection is not None:
                self.delete_google_calendar_event(
                    connection=connection,
                    calendar_event=calendar_event,
                )

            self.delete_schedule_calendar_event(
                calendar_event=calendar_event,
            )

            return

        if connection is None:
            return

        next_occurrence = self.get_next_schedule_occurrence(
            schedule=schedule,
        )

        if next_occurrence is None:
            if calendar_event is not None:
                self.delete_google_calendar_event(
                    connection=connection,
                    calendar_event=calendar_event,
                )

                self.delete_schedule_calendar_event(
                    calendar_event=calendar_event,
                )

            return

        if calendar_event is None:
            google_event = self.create_schedule_calendar_event(
                schedule=schedule,
                connection=connection,
                next_occurrence=next_occurrence,
            )

            self.save_schedule_calendar_event(
                schedule=schedule,
                google_event=google_event,
                next_occurrence=next_occurrence,
            )

            return

        self.update_google_calendar_event(
            connection=connection,
            schedule=schedule,
            calendar_event=calendar_event,
            next_occurrence=next_occurrence,
        )

    @classmethod
    def run_sync_updated_schedule(
        cls,
        schedule_id: int,
        user_id: int,
    ) -> None:

        db = SessionLocal()

        try:
            service = cls(db)

            service.sync_updated_schedule(
                schedule_id=schedule_id,
                user_id=user_id,
            )

            db.commit()

        except Exception as exc:
            db.rollback()

            print(
                f"Failed to sync Google Calendar event "
                f"for schedule {schedule_id}: {exc}"
            )

        finally:
            db.close()
