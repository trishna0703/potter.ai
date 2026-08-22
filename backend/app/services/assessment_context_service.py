from pydantic import BaseModel

from app.models.assessment import Assessment
from app.models.health_concern import HealthConcern
from app.services.s3_service import generate_download_url


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
            "concern": self._build_concern_context(concern),
            "assessment": self._build_assessment_context(assessment),
            "plant": self._build_plant_context(concern),
            "identification": self._build_identification_context(concern),
            "evidence": self._build_evidence_context(assessment),
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
    def _build_concern_context(
        concern: HealthConcern,
    ) -> dict:
        return {
            "id": concern.id,
            "initial_context": concern.initial_context,
            "occurred_on": concern.occurred_on,
            "reported_on": concern.reported_on,
            "status": concern.status,
        }

    @staticmethod
    def _build_assessment_context(
        assessment: Assessment,
    ) -> dict:
        return {
            "id": assessment.id,
            "status": assessment.status,
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

    @staticmethod
    def _build_identification_context(
        concern: HealthConcern,
    ) -> dict | None:

        if concern.identification is None:
            return None

        identification = concern.identification

        return {
            "species": identification.species,
            "confidence": identification.confidence,
        }

    @staticmethod
    def _build_evidence_context(
        assessment: Assessment,
    ) -> list[dict]:
        evidence_context = []

        for evidence in assessment.evidences:
            for evidence_photo in evidence.photos:
                evidence_context.append(
                    {
                        "evidence_id": evidence.id,
                        "photo_id": evidence_photo.photo_id,
                        "photo_url": generate_download_url(evidence_photo.photo_id),
                    }
                )

        return evidence_context
