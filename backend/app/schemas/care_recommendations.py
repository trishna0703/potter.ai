from datetime import date, time

from pydantic import BaseModel, Field

from app.schemas.care_schedule import CareTypes

from pydantic import BaseModel, Field


class CareScheduleAIRecommendation(BaseModel):
    care_type: str
    frequency_type: str
    interval: int = Field(gt=0)
    reasoning: str


class SpeciesCareAIKnowledge(BaseModel):
    summary: str
    care_guidelines: list[str]


class CareScheduleAIResponse(BaseModel):
    recommendation: CareScheduleAIRecommendation
    knowledge: SpeciesCareAIKnowledge


class CareScheduleRecommendationCreate(BaseModel):
    care_type: str


class CareScheduleRecommendationRespons(BaseModel):
    id: int
    plant_id: int
    care_type: CareTypes
    frequency_type: str
    interval: int
    reasoning: str | None
