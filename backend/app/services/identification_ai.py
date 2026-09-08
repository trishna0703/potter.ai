from openai import OpenAI
from app.config import settings
from app.schemas.plant import PlantIdentificationResult
import json
from openai import (
    APIConnectionError,
    APIStatusError,
    AuthenticationError,
    BadRequestError,
    RateLimitError,
)

from app.exceptions import (
    IdentificationInvalidResponseError,
    IdentificationProviderError,
)


class IdentificationAI:

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

        try:
            response = self.client.chat.completions.create(
                model=settings.ai_model,
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

        except RateLimitError as e:
            raise IdentificationProviderError("AI provider rate limit exceeded") from e

        except APIConnectionError as e:
            raise IdentificationProviderError("Could not connect to AI provider") from e

        except AuthenticationError as e:
            raise IdentificationProviderError(
                "AI provider authentication failed"
            ) from e

        except BadRequestError as e:
            raise IdentificationInvalidResponseError(
                "Invalid request sent to AI provider"
            ) from e

        except APIStatusError as e:
            raise IdentificationProviderError("AI provider returned an error") from e
        content = response.choices[0].message.content

        data = json.loads(content)

        return PlantIdentificationResult(**data)
