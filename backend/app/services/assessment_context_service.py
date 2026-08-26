from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.models.assessment import Assessment
from app.models.health_concern import HealthConcern
from app.services.health_concern_service import HealthConcernService
from app.services.s3_service import generate_download_url


class AssessmentContextService(BaseModel):

    def build_context(
        self,
        db: Session,
        concern_id: int,
        assessment: Assessment,
        user_id: int,
        previous_assessment: Assessment | None = None,
    ) -> dict:

        messages = sorted(
            assessment.messages,
            key=lambda message: message.sequence,
        )

        return {
            "concern": self._build_concern_context(db, concern_id),
            "assessment": self._build_assessment_context(
                assessment,
                previous_assessment,
            ),
            "plant": self._build_plant_context(db, concern_id),
            "identification": self._build_identification_context(db, concern_id),
            "evidence": self._build_evidence_context(db, user_id, assessment),
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
        db: Session,
        concern_id: int,
    ) -> dict:

        concern_service = HealthConcernService()

        concern = concern_service.get_health_concern(db, concern_id)

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
        previous_assessment: Assessment | None,
    ) -> dict:

        context = {
            "id": assessment.id,
            "status": assessment.status,
        }

        if previous_assessment is not None:
            recommendations = previous_assessment.recommendations

            context["previous_assessment"] = {
                "previous_assessment_id": previous_assessment.id,
                "previous_assessment_status": previous_assessment.status,
                "problem": previous_assessment.problem,
                "problem_cause": previous_assessment.problem_cause,
                "confidence": previous_assessment.confidence,
                "explanation": previous_assessment.explanation,
                "recommendations": [
                    {
                        "id": recommendation.id,
                        "option_id": recommendation.option_id,
                        "title": recommendation.title,
                        "summary": recommendation.summary,
                        "recommendation_score": recommendation.recommendation_score,
                        "performed_on": recommendation.performed_on,
                        "outcome": (
                            {
                                "type": recommendation.outcome.outcome_type,
                                "description": recommendation.outcome.description,
                                "recorded_on": recommendation.outcome.recorded_on,
                            }
                            if recommendation.outcome
                            else None
                        ),
                    }
                    for recommendation in recommendations
                ],
            }

        return context

    @staticmethod
    def _build_plant_context(
        db,
        concern_id: int,
    ) -> dict | None:
        concern_service = HealthConcernService()

        concern = concern_service.get_health_concern(db, concern_id)

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
        db,
        concern_id: int,
    ) -> dict | None:

        concern_service = HealthConcernService()

        concern = concern_service.get_health_concern(db, concern_id)

        if concern.identification is None:
            return None

        identification = concern.identification

        return {
            "species": identification.species,
            "confidence": identification.confidence,
        }

    @staticmethod
    def _build_evidence_context(
        db: Session,
        user_id: int,
        assessment: Assessment,
    ) -> list[dict]:
        evidence_context = []

        for evidence in assessment.evidences:
            for evidence_photo in evidence.photos:
                evidence_context.append(
                    {
                        "evidence_id": evidence.id,
                        "photo_id": evidence_photo.id,
                        "photo_url": generate_download_url(
                            photo_id=evidence_photo.id, user_id=user_id, db=db
                        ),
                    }
                )

        return evidence_context
