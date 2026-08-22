from pydantic import BaseModel

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.recommendation import Recommendation


class RecommendationService(BaseModel):

    def create_recommendation(
        self,
        db: Session,
        concern_id: int,
        recommendation_type: str,
        description: str,
        performed_on=None,
    ) -> Recommendation:

        recommendation = Recommendation(
            concern_id=concern_id,
            recommendation_type=recommendation_type,
            description=description,
            performed_on=performed_on,
        )

        db.add(recommendation)
        db.flush()

        return recommendation

    def get_recommendation(
        self,
        db: Session,
        recommendation_id: int,
    ) -> Recommendation | None:
        return db.get(Recommendation, recommendation_id)

    def get_recommendations_for_concern(
        self,
        db: Session,
        concern_id: int,
    ) -> list[Recommendation]:
        stmt = (
            select(Recommendation)
            .where(Recommendation.concern_id == concern_id)
            .order_by(Recommendation.id.asc())
        )

        return list(db.scalars(stmt).all())

    def mark_recommendation_performed(
        self,
        db: Session,
        recommendation_id: int,
        performed_on,
    ) -> Recommendation | None:
        recommendation = db.get(
            Recommendation,
            recommendation_id,
        )

        if recommendation is None:
            return None

        recommendation.performed_on = performed_on
        db.flush()

        return recommendation
