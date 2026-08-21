from pydantic import BaseModel
from uuid import UUID
from datetime import date
from app.schemas.plant import PlantResponse


class RequestModel(BaseModel):
    submission_id: UUID
    photo_id: int
    initial_context: str
    occurred_on: date
    evidence_id: int
    plant_id: int | None = None


class ResponseModel(BaseModel):
    concern_id: int
