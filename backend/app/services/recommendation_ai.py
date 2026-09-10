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

        response = self.client.chat.completions.create(
            model=settings.ai_model,
            messages=[
                {
                    "role": "system",
                    "content": RECOMMENDATION_PROMPT,
                },
                {
                    "role": "user",
                    "content": json.dumps(context, default=str),
                },
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "recommendation_interaction",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "type": {
                                "type": "string",
                                "enum": ["recommendation_options"],
                            },
                            "options": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "type": {
                                            "type": "string",
                                            "enum": ["recommendation"],
                                        },
                                        "id": {"type": "string"},
                                        "title": {"type": "string"},
                                        "summary": {"type": "string"},
                                        "steps": {
                                            "type": "array",
                                            "items": {"type": "string"},
                                        },
                                        "expected_result": {"type": "string"},
                                        "recommendation_score": {
                                            "type": "integer",
                                            "minimum": 1,
                                            "maximum": 5,
                                        },
                                    },
                                    "required": [
                                        "type",
                                        "id",
                                        "title",
                                        "summary",
                                        "steps",
                                        "expected_result",
                                        "recommendation_score",
                                    ],
                                    "additionalProperties": False,
                                },
                            },
                        },
                        "required": ["type", "options"],
                        "additionalProperties": False,
                    },
                },
            },
        )

        output = response.choices[0].message.content
        print("========== AI RAW OUTPUT ==========")
        print(output)
        print("===================================")
        if not output:
            raise ValueError("AI returned an empty response.")

        return AIResponseAdapter.validate_json(output)
