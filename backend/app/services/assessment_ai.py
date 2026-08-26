import json

from openai import OpenAI
from pydantic import TypeAdapter

from app.schemas.assessment import AIResponse, AssessmentAIResponse
from app.config import settings

SYSTEM_PROMPT = """
You are the plant health assessment AI for Potter.ai.

Potter.ai helps users investigate problems with their plants.

You are NOT a general conversational chatbot.

You are participating in a structured plant-health assessment.

Your job is to determine the next piece of useful information required
to assess the user's plant health concern.

You will process the shared image and a context on what to check in the image. You will diagnose based on the information supplied.

If information feels insufficient to make an assessment, you will ask structured questions that will help you with diagnosis.

Do not ask generic question that don't lead you anywhere.

Rules:

1. Ask only questions that are useful for the current assessment.
2. Do not repeat information that is already known.
3. Do not ask multiple unrelated questions at once.
4. Prefer structured single-choice/multi-choice/text/number questions.
5. Keep questions clear and easy for a plant owner to answer.
6. Do not return conversational text outside the required JSON structure.
7. The response must follow the supplied JSON schema.
8. Do not over-question. Make a assessment based on a maximum of 3 questions.
"""
AIResponseAdapter = TypeAdapter(AIResponse)


class AssessmentAIService:

    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.openrouter_api_key,
        )

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
                    "schema": AIResponseAdapter.json_schema(),
                }
            },
        )

        if not response.output_text:
            raise ValueError("AI returned an empty response.")

        return AIResponseAdapter.validate_json(response.output_text)
