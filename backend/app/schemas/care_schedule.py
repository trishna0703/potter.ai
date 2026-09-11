from datetime import date, datetime, time
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field, ConfigDict


class CareScheduleCreate(BaseModel):
    care_type: CareTypes
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
    care_type: CareTypes
    description: str | None
    frequency_type: str
    interval: int
    scheduled_time: time
    timezone: str
    starts_on: date
    ends_on: date | None
    is_active: bool
    auto_schedule: bool

    created_at: datetime
    updated_at: datetime


class CareScheduleUpdate(BaseModel):
    description: str | None = None
    frequency_type: str | None = None
    interval: int | None = None
    scheduled_time: time | None = None
    timezone: str | None = None
    is_active: bool | None = None
    auto_schedule: bool | None = None


class CareTypes(str, Enum):
    WATER = "WATER"
    FERTILIZER = "FERTILIZER"
    REPOT = "REPOT"
    COMPOST = "COMPOST"
    PRUNING = "PRUNING"
    SUNBATHING = "SUNBATHING"
    OTHER = "OTHER"


class CareEventStatus(str, Enum):
    DONE = "DONE"
    INCOMPLETE = "INCOMPLETE"


class CareEventSource(str, Enum):
    CARE_EVENT = "CARE_EVENT"
    CALENDAR_EVENT = "CALENDAR_EVENT"


class CareEventResponseModel(BaseModel):
    id: int
    source: CareEventSource
    plant_id: int
    plant_name: str
    care_type: CareTypes
    occurred_on: datetime


class CareEventUpdateRequest(BaseModel):
    source: CareEventSource
    was_action_taken: bool
