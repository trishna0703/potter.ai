from typing import Annotated, Literal

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AssessmentRequest(BaseModel):
    concern_id: int
    status: str
    current_interaction_id: int | None = None
    created_on: datetime
    problem: str | None = None
    problem_cause: str | None = None
    confidence: str | None = None
    explanation: str | None = None


class AssessmentResponse(BaseModel):
    assessment_id: int


class QuestionOption(BaseModel):
    model_config = ConfigDict(extra="forbid")

    value: str
    label: str


class Question(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    prompt: str
    input_type: Literal["single_choice"]
    options: list[QuestionOption]
    required: bool


class QuestionAIResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["question"]
    question: Question


class AssessmentResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    problem: str
    problem_cause: str
    confidence: str
    explanation: str


class AssessmentAIResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["assessment"]
    assessment: AssessmentResult


AIResponse = Annotated[
    QuestionAIResponse | AssessmentAIResponse,
    Field(discriminator="type"),
]


class AssessmentMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    assessment_id: int
    sequence: int
    role: str
    message_type: str
    payload: dict
    created_at: datetime
