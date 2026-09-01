from datetime import date, datetime, time
from typing import Literal

from pydantic import BaseModel, Field, ConfigDict


class CareScheduleCreate(BaseModel):
    care_type: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=2000)

    frequency_type: Literal["DAYS", "WEEKS"]
    interval: int = Field(gt=0)

    scheduled_time: time
    timezone: str = Field(min_length=1, max_length=100)

    starts_on: date
    ends_on: date | None = None
    auto_schedule: bool


class CareScheduleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    plant_id: int
    care_type: str
    description: str | None
    frequency_type: str
    interval: int
    scheduled_time: time
    timezone: str
    starts_on: date
    ends_on: date | None
    is_active: bool

    created_at: datetime
    updated_at: datetime
