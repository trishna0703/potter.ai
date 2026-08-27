import json

from openai import OpenAI
from pydantic import TypeAdapter

from app.config import settings
from app.models.assessment import Assessment
from app.schemas.recommendation import AIRecommendationResponse
from app.prompts.recommendation_prompt import RECOMMENDATION_PROMPT

AIResponseAdapter = TypeAdapter(AIRecommendationResponse)


class RecommendationAIService:

    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.openrouter_api_key,
        )

    def generate_recommendation(
        self,
        context: dict,
    ) -> AIRecommendationResponse:

        response = self.client.responses.create(
            model=settings.ai_model,
            instructions=RECOMMENDATION_PROMPT,
            input=json.dumps(context, default=str),
            text={
                "format": {
                    "type": "json_schema",
                    "name": "recommendation_interaction",
                    "strict": True,
                    "schema": AIResponseAdapter.json_schema(),
                }
            },
        )

        if not response.output_text:
            raise ValueError("AI returned an empty response.")

        return AIResponseAdapter.validate_json(response.output_text)
