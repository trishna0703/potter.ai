from dataclasses import Field
from datetime import datetime, time
import enum
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException
from openai import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing_extensions import Literal

from app.database import get_db
from app.models.care_event import CareEvent
from app.models.care_schedule import CareSchedule
from app.models.plant import Plant
from app.models.schedule_calendar_event import CareScheduleCalendarEvent
from app.models.user import User
from app.routes.users import get_current_user
from app.schemas.care_schedule import (
    CareEventResponseModel,
    CareEventSource,
    CareEventStatus,
    CareEventUpdateRequest,
)
from app.services.care_event_service import CareScheduleService
from app.services.plant_service import PlantService

router = APIRouter()


@router.get(
    "/",
    response_model=list[CareEventResponseModel],
)
def get_all_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[CareEventResponseModel]:

    care_event_stmt = (
        select(CareEvent)
        .join(Plant, Plant.id == CareEvent.plant_id)
        .where(
            Plant.user_id == current_user.id,
            CareEvent.status == CareEventStatus.INCOMPLETE,
        )
        .order_by(CareEvent.occurred_on.desc())
    )

    care_events = db.scalars(care_event_stmt).all()

    calendar_event_stmt = (
        select(CareScheduleCalendarEvent)
        .join(
            CareSchedule,
            CareSchedule.id == CareScheduleCalendarEvent.care_schedule_id,
        )
        .join(
            Plant,
            Plant.id == CareSchedule.plant_id,
        )
        .where(
            Plant.user_id == current_user.id,
            CareScheduleCalendarEvent.status == "ACTIVE",
        )
        .order_by(CareScheduleCalendarEvent.event_start_at.desc())
    )

    calendar_events = db.scalars(calendar_event_stmt).all()

    response = []

    # CareEvents created by cron
    for event in care_events:
        plant = event.plant

        response.append(
            CareEventResponseModel(
                id=event.id,
                source=CareEventSource.CARE_EVENT,
                plant_id=plant.id,
                plant_name=plant.name,
                care_type=event.care_type,
                occurred_on=event.occurred_on,
            )
        )

    # Calendar events whose scheduled time has passed
    for calendar_event in calendar_events:
        schedule = calendar_event.care_schedule
        plant = schedule.plant

        tz = ZoneInfo(schedule.timezone)
        now = datetime.now(tz)

        event_start = calendar_event.event_start_at.astimezone(tz)

        if event_start > now:
            continue

        response.append(
            CareEventResponseModel(
                id=calendar_event.id,
                source=CareEventSource.CALENDAR_EVENT,
                plant_id=plant.id,
                plant_name=plant.name,
                care_type=schedule.care_type,
                occurred_on=calendar_event.event_start_at,
            )
        )

    response.sort(
        key=lambda event: event.occurred_on,
        reverse=True,
    )

    return response


@router.patch("/{plant_id}/events/{event_id}")
def update_care_event(
    plant_id: int,
    event_id: int,
    payload: CareEventUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plant_service = PlantService()

    if not plant_service.does_plant_belong_to_user(
        plant_id=plant_id,
        user_id=current_user.id,
        db=db,
    ):
        raise HTTPException(
            detail="Plant does not belong to this user.",
            status_code=403,
        )

    if payload.source == CareEventSource.CARE_EVENT:
        care_event = db.scalar(
            select(CareEvent).where(
                CareEvent.id == event_id,
                CareEvent.plant_id == plant_id,
                CareEvent.status == CareEventStatus.INCOMPLETE,
            )
        )

        if not care_event:
            raise HTTPException(
                detail="Care event not found.",
                status_code=404,
            )

        care_event.status = CareEventStatus.DONE
        care_event.was_action_taken = payload.was_action_taken

    elif payload.source == CareEventSource.CALENDAR_EVENT:
        calendar_event = db.scalar(
            select(CareScheduleCalendarEvent)
            .join(
                CareSchedule,
                CareSchedule.id == CareScheduleCalendarEvent.care_schedule_id,
            )
            .where(
                CareScheduleCalendarEvent.id == event_id,
                CareSchedule.plant_id == plant_id,
                CareScheduleCalendarEvent.status == "ACTIVE",
            )
        )

        if not calendar_event:
            raise HTTPException(
                detail="Calendar event not found.",
                status_code=404,
            )

        calendar_event.status = "INACTIVE"

        care_schedule_service = CareScheduleService(db)

        care_schedule_service.create_care_event_history(
            plant_id=plant_id,
            care_schedule_id=calendar_event.care_schedule_id,
            care_type=calendar_event.care_schedule.care_type,
            source="POTTER",
            occurred_on=calendar_event.event_start_at,
            was_action_taken=payload.was_action_taken,
            status=CareEventStatus.DONE,
            description="",
        )

    else:
        raise HTTPException(
            detail="Invalid event source.",
            status_code=400,
        )

    db.commit()

    return {"message": "Care event updated successfully."}


@router.get("/{plant_id}/history")
def get_event_history_for_plant(
    plant_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plant_service = PlantService()

    if not plant_service.does_plant_belong_to_user(
        plant_id=plant_id, user_id=current_user.id, db=db
    ):
        raise HTTPException(
            detail="Plant does not belong to this user.",
            status_code=403,
        )

    stmt = select(CareEvent).where(CareEvent.plant_id == plant_id)

    return db.scalars(stmt).all()
