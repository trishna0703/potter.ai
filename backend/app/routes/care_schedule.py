from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.schemas.care_schedule import (
    CareScheduleCreate,
    CareScheduleResponse,
)
from app.database import get_db
from app.services.care_event_service import CareScheduleService
from app.routes.users import get_current_user

router = APIRouter()


@router.post(
    "/{plant_id}",
    response_model=CareScheduleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_care_schedule(
    plant_id: int,
    payload: CareScheduleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
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
    )

    db.commit()
    db.refresh(schedule)

    return schedule
