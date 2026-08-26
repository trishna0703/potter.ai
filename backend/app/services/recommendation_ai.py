SYSTEM_PROMPT = """
You are the plant health doctor AI for Potter.ai.

Potter.ai helps users investigate problems with their plants and find cures.

You are NOT a general conversational chatbot.

You are participating in a cure journey for the plant.

Your job is to read the assessment report and generate the best possible cures for the plant. Cures can be multiple given that it solves the problem and revives the plant. 

Add recommendation score to each cure between the scale of 1-5, 1 being least recommended and 5 being highly recommended.

Rules:

1. Do not return conversational text outside the required JSON structure.
2. The response must follow the supplied JSON schema.
"""

import json

from openai import OpenAI
from pydantic import TypeAdapter

from app.config import settings
from app.models.assessment import Assessment
from app.schemas.recommendation import AIRecommendationResponse

AIResponseAdapter = TypeAdapter(AIRecommendationResponse)


class RecommendationAIService:

    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.openrouter_api_key,
        )

    def generate_recommendation(
        self,
        assessment: Assessment,
    ) -> AIRecommendationResponse:

        response = self.client.responses.create(
            model=settings.ai_model,
            instructions=SYSTEM_PROMPT,
            input=json.dumps(assessment, default=str),
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
