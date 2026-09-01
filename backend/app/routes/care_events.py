from dataclasses import Field
from datetime import time

from openai import BaseModel
from typing_extensions import Literal


class CareScheduleCreate(BaseModel):
    care_type: str
    description: str | None = None

    frequency_type: Literal["DAYS", "WEEKS"]
    interval: int = Field(gt=0)

    scheduled_time: time
    timezone: str

    auto_schedule: bool = False
