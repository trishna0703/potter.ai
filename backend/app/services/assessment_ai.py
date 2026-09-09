import json

from openai import OpenAI
from pydantic import TypeAdapter

from app.schemas.assessment import AIResponse, AssessmentAIResponse, QuestionAIResponse
from app.config import settings
from app.prompts.assessment_promt import (
    FORCE_ASSESSMENT_SYSTEM_PROMPT,
    SYSTEM_PROMPT,
)

class AssessmentAIService:

    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.openrouter_api_key,
        )

    def generate_next_interaction(
        self, context: dict, force_assessment: bool
    ) -> AIResponse:
        if force_assessment:
            adapter = TypeAdapter(AssessmentAIResponse)
            instructions = FORCE_ASSESSMENT_SYSTEM_PROMPT
            schema_name = "assessment_only"
        else:
            adapter = TypeAdapter(QuestionAIResponse)
            instructions = SYSTEM_PROMPT
            schema_name = "assessment_interaction"

        response = self.client.responses.create(
            model=settings.ai_model,
            instructions=instructions,
            input=json.dumps(context, default=str),
            text={
                "format": {
                    "type": "json_schema",
                    "name": schema_name,
                    "strict": True,
                    "schema": adapter.json_schema(),
                }
            },
        )

        if not response.output_text:
            raise ValueError("AI returned an empty response.")

        return adapter.validate_json(response.output_text)
