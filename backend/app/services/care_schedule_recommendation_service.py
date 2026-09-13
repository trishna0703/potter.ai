from sqlalchemy.orm import Session

from app.models.care_schedule import CareSchedule
from app.models.care_schedule_recommendation import CareScheduleRecommendation
from app.models.plant import Plant
from app.models.species_care_knowledge import SpeciesCareKnowledge
from app.services.care_schedule_recommendation_ai import CareScheduleAIService


class CareScheduleRecommendationError(Exception):
    """Base exception for care schedule recommendation errors."""


class PlantNotFoundError(CareScheduleRecommendationError):
    pass


class CareScheduleAlreadyExistsError(CareScheduleRecommendationError):
    pass


class RecommendationNotFoundError(CareScheduleRecommendationError):
    pass


class RecommendationAlreadyHandledError(CareScheduleRecommendationError):
    pass


class RecommendationMismatchError(CareScheduleRecommendationError):
    pass


class CareScheduleRecommendationService:

    def __init__(self, db: Session):
        self.db = db
        self.ai_service = CareScheduleAIService()

    def generate_recommendation(
        self,
        plant_id: int,
        care_type: str,
    ) -> CareScheduleRecommendation:

        plant = self.db.query(Plant).filter(Plant.id == plant_id).first()

        if not plant:
            raise PlantNotFoundError("Plant not found.")

        existing_schedule = (
            self.db.query(CareSchedule)
            .filter(
                CareSchedule.plant_id == plant_id,
                CareSchedule.care_type == care_type,
                CareSchedule.deleted_by_user.is_(False),
            )
            .first()
        )

        if existing_schedule:
            raise CareScheduleAlreadyExistsError(
                f"A {care_type} schedule already exists for this plant."
            )

        existing_recommendation = (
            self.db.query(CareScheduleRecommendation)
            .filter(
                CareScheduleRecommendation.plant_id == plant_id,
                CareScheduleRecommendation.care_type == care_type,
                CareScheduleRecommendation.status == "PENDING",
            )
            .first()
        )

        if existing_recommendation:
            return existing_recommendation

        species_knowledge = (
            self.db.query(SpeciesCareKnowledge)
            .filter(
                SpeciesCareKnowledge.species == plant.species,
                SpeciesCareKnowledge.care_type == care_type,
            )
            .first()
        )

        plant_context = {
            "species": plant.species,
            "pot_size": plant.pot_size,
            "height_cm": plant.height_cm,
            "location_type": plant.location_type,
        }

        ai_response = self.ai_service.generate_schedule(
            plant_context=plant_context,
            care_type=care_type,
            species_knowledge=(
                species_knowledge.knowledge if species_knowledge else None
            ),
        )

        if species_knowledge:
            species_knowledge.knowledge = ai_response.knowledge
        else:
            self.db.add(
                SpeciesCareKnowledge(
                    species=plant.species,
                    care_type=care_type,
                    knowledge=ai_response.knowledge.model_dump(),
                )
            )

        recommendation = CareScheduleRecommendation(
            plant_id=plant.id,
            care_type=ai_response.recommendation.care_type,
            frequency_type=ai_response.recommendation.frequency_type,
            interval=ai_response.recommendation.interval,
            reasoning=ai_response.recommendation.reasoning,
            status="PENDING",
            generation_context=plant_context,
        )

        self.db.add(recommendation)
        self.db.commit()
        self.db.refresh(recommendation)

        return recommendation

    def accept_recommendation(
        self,
        recommendation_id: int,
        plant_id: int,
        care_type: str,
    ) -> CareScheduleRecommendation:

        recommendation = (
            self.db.query(CareScheduleRecommendation)
            .filter(
                CareScheduleRecommendation.id == recommendation_id,
            )
            .first()
        )

        if not recommendation:
            raise RecommendationNotFoundError("Care schedule recommendation not found.")

        if recommendation.status != "PENDING":
            raise RecommendationAlreadyHandledError(
                "This recommendation has already been handled."
            )

        if recommendation.plant_id != plant_id:
            raise RecommendationMismatchError(
                "Recommendation does not belong to this plant."
            )

        if recommendation.care_type != care_type:
            raise RecommendationMismatchError(
                "Recommendation care type does not match the schedule."
            )

        recommendation.status = "ACCEPTED"

        return recommendation
