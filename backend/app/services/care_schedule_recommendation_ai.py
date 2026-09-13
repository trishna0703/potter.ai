import json

from openai import OpenAI
from pydantic import TypeAdapter

from app.config import settings
from app.prompts.care_schedule_recommendation_prompt import CARE_SCHEDULE_SYSTEM_PROMPT
from app.schemas.care_recommendations import CareScheduleAIResponse



class CareScheduleAIService:

    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.openrouter_api_key,
        )

    def generate_schedule(
        self,
        plant_context: dict,
        care_type: str,
        species_knowledge: dict | None = None,
    ) -> CareScheduleAIResponse:

        context = {
            "care_type": care_type,
            "plant": plant_context,
            "existing_species_knowledge": species_knowledge,
        }

        adapter = TypeAdapter(CareScheduleAIResponse)

        response = self.client.responses.create(
            model=settings.ai_model,
            instructions=CARE_SCHEDULE_SYSTEM_PROMPT,
            input=json.dumps(context, default=str),
            text={
                "format": {
                    "type": "json_schema",
                    "name": "care_schedule_recommendation",
                    "strict": True,
                    "schema": adapter.json_schema(),
                }
            },
        )

        if not response.output_text:
            raise ValueError("AI returned an empty response.")

        return adapter.validate_json(response.output_text)
