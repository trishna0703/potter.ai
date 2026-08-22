from datetime import datetime

from openai import BaseModel


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

from typing import Literal

from pydantic import BaseModel, Field


class QuestionOption(BaseModel):
    value: str
    label: str


class Question(BaseModel):
    id: str
    prompt: str
    input_type: Literal["single_choice"]
    options: list[QuestionOption]
    required: bool = True


class QuestionInteraction(BaseModel):
    type: Literal["question"]
    question: Question


class AssessmentAIResponse(BaseModel):
    interaction: QuestionInteraction
