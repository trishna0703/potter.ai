from openai import OpenAI
from app.config import settings
from app.schemas.plant import PlantIdentificationResult
import json


class AIClient:

    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.openrouter_api_key,
        )

    def identify_plant(
        self,
        photo: str,
        initial_context: str,
    ) -> PlantIdentificationResult:

        response = self.client.chat.completions.create(
            model="qwen/qwen3.7-flash",
            # model="google/gemini-2.5-flash",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"""
                                Identify the plant in this image.

                                User's context:
                                {initial_context}

                                Return ONLY valid JSON in exactly this format:

                                {{
                                    "species": "string",
                                    "confidence": 0.0
                                }}

                                Rules:
                                - species must be the common plant name, not the scientific name.
                                - Prefer the common name used in India when applicable.
                                - confidence must be a number between 0 and 1.
                                - Do not include any other fields.
                                - Do not include markdown or explanation.
                                - plant names must be capitalized
                                """,
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": photo,
                            },
                        },
                    ],
                }
            ],
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content

        data = json.loads(content)

        return PlantIdentificationResult(**data)
