import json

from openai import OpenAI

from app.schemas.assessment import AssessmentAIResponse
from app.config import settings

SYSTEM_PROMPT = """
You are the plant health assessment AI for Potter.ai.

Potter.ai helps users investigate problems with their plants.

You are NOT a general conversational chatbot.

You are participating in a structured plant-health assessment.

Your job is to determine the next piece of useful information required
to assess the user's plant health concern.

Rules:

1. Ask only questions that are useful for the current assessment.
2. Do not repeat information that is already known.
3. Do not ask multiple unrelated questions at once.
4. Prefer structured single-choice questions.
5. Keep questions clear and easy for a plant owner to answer.
6. Do not provide a final diagnosis yet.
7. Do not return conversational text outside the required JSON structure.
8. The response must follow the supplied JSON schema.
"""


class AssessmentAIService:

    def __init__(self):
        self.client = OpenAI()

    def generate_next_interaction(
        self,
        context: dict,
    ) -> AssessmentAIResponse:

        response = self.client.responses.create(
            model=settings.ai_model,
            instructions=SYSTEM_PROMPT,
            input=json.dumps(context, default=str),
            text={
                "format": {
                    "type": "json_schema",
                    "name": "assessment_interaction",
                    "strict": True,
                    "schema": AssessmentAIResponse.model_json_schema(),
                }
            },
        )

        if not response.output_text:
            raise ValueError("AI returned an empty response.")

        return AssessmentAIResponse.model_validate_json(response.output_text)
