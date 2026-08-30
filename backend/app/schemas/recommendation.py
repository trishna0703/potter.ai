from typing import Literal

from pydantic import BaseModel, Field


class RecommendationOption(BaseModel):
    type: Literal["recommendation"] = "recommendation"
    id: str
    title: str
    summary: str
    steps: list[str] = Field(min_length=1)
    frequency: str | None = None
    duration: str | None = None
    materials: list[str] = []
    caution: str | None = None
    expected_result: str
    recommendation_score: int = Field(ge=1, le=5)


class AIRecommendationResponse(BaseModel):
    type: Literal["recommendation_options"] = "recommendation_options"
    options: list[RecommendationOption] = Field(min_length=1)
