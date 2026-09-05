from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.care_schedule import (
    CareScheduleCreate,
    CareScheduleResponse,
    CareScheduleUpdate,
)
from app.database import get_db
from app.services.care_event_service import CareScheduleService
from app.routes.users import get_current_user
from fastapi import BackgroundTasks

from app.services.google_calendar import GoogleCalendarService

router = APIRouter()


@router.post(
    "/{plant_id}",
    response_model=CareScheduleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_care_schedule(
    plant_id: int,
    payload: CareScheduleCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:

        service = CareScheduleService(db)

        schedule = service.create_schedule(
            user_id=current_user.id,
            plant_id=plant_id,
            care_type=payload.care_type,
            description=payload.description,
            frequency_type=payload.frequency_type,
            interval=payload.interval,
            scheduled_time=payload.scheduled_time,
            timezone=payload.timezone,
            starts_on=payload.starts_on,
            ends_on=payload.ends_on,
            auto_schedule=payload.auto_schedule,
        )

        db.commit()
        db.refresh(schedule)

        if schedule.auto_schedule:
            background_tasks.add_task(
                GoogleCalendarService.schedule_first_calendar_event,
                schedule.id,
                current_user.id,
            )

        return schedule

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# Get all schedules for plant
@router.get(
    "/plant/{plant_id}",
    response_model=list[CareScheduleResponse],
)
def get_care_schedules(
    plant_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = CareScheduleService(db)

    return service.get_schedules_for_user(user_id=current_user.id, plant_id=plant_id)


# Get one schedule
@router.get(
    "/{schedule_id}",
    response_model=CareScheduleResponse,
)
def get_care_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = CareScheduleService(db)

    schedule = service.get_schedule_for_user(
        schedule_id=schedule_id,
        user_id=current_user.id,
    )

    if schedule is None:
        raise HTTPException(
            status_code=404,
            detail="Care schedule not found",
        )

    return schedule


@router.patch(
    "/{schedule_id}",
    response_model=CareScheduleResponse,
)
def update_care_schedule(
    schedule_id: int,
    payload: CareScheduleUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = CareScheduleService(db)

    schedule = service.update_schedule(
        schedule_id=schedule_id,
        user_id=current_user.id,
        **payload.model_dump(exclude_unset=True),
    )

    if schedule is None:
        raise HTTPException(
            status_code=404,
            detail="Care schedule not found",
        )

    db.commit()
    db.refresh(schedule)

    background_tasks.add_task(
        GoogleCalendarService.run_sync_updated_schedule,
        schedule.id,
        current_user.id,
    )

    return schedule
