from typing import Annotated, Literal

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


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

    value: str = Field(
        description=(
            "The machine-readable value returned back to the system when the "
            "user selects this option."
        ),
    )
    label: str = Field(
        description="The human-readable text shown to the user for this option.",
    )


class Question(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    prompt: str
    input_type: Literal["single_choice", "multi_choice", "text", "number", "boolean"]
    options: list[QuestionOption] = Field(
        default_factory=list,
        description=(
            "Required (non-empty) for single_choice and multi_choice. "
            "Must be empty for text, number, and boolean."
        ),
    )
    required: bool
    ...

    @model_validator(mode="after")
    def _validate_options(self):
        is_choice = self.input_type in ("single_choice", "multi_choice")
        if is_choice and not self.options:
            raise ValueError("options required for choice-type questions")
        if not is_choice and self.options:
            raise ValueError("options must be empty for non-choice input types")
        return self


class QuestionAIResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["question"]
    question: Question


class AssessmentResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    problem: str
    problem_cause: str
    confidence: Literal["high", "medium", "low"]
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
