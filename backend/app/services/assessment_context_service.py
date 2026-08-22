from pydantic import BaseModel

from app.models.assessment import Assessment
from app.models.health_concern import HealthConcern


class AssessmentContextService(BaseModel):

    def build_context(
        self,
        concern: HealthConcern,
        assessment: Assessment,
    ) -> dict:

        messages = sorted(
            assessment.messages,
            key=lambda message: message.sequence,
        )

        return {
            "concern": {
                "id": concern.id,
                "initial_context": concern.initial_context,
                "occurred_on": concern.occurred_on,
                "status": concern.status,
            },
            "assessment": {
                "id": assessment.id,
                "status": assessment.status,
            },
            "plant": self._build_plant_context(concern),
            "previous_interactions": [
                {
                    "role": message.role,
                    "type": message.message_type,
                    "payload": message.payload,
                }
                for message in messages
            ],
        }

    @staticmethod
    def _build_plant_context(
        concern: HealthConcern,
    ) -> dict | None:

        if concern.plant is None:
            return None

        plant = concern.plant

        return {
            "id": plant.id,
            "name": plant.name,
            "species": plant.species,
            "plant_location": plant.location_type,
            "height_in_cm": plant.height_cm,
            "pot_size_in_inches": plant.pot_size,
        }
