from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.health_concern import HealthConcern


class HealthConcernService(BaseModel):
    def get_health_concern(
        self,
        db: Session,
        concern_id: int,
    ) -> HealthConcern | None:
        return db.get(HealthConcern, concern_id)

    def get_health_concern_for_user(
        self,
        db: Session,
        concern_id: int,
        user_id: int,
    ) -> HealthConcern | None:
        stmt = select(HealthConcern).where(
            HealthConcern.id == concern_id,
            HealthConcern.user_id == user_id,
        )

        return db.scalar(stmt)

    def get_health_concern_by_submission_id(
        self,
        db: Session,
        submission_id: str,
        user_id: int,
    ) -> HealthConcern | None:
        stmt = select(HealthConcern).where(
            HealthConcern.submission_id == submission_id,
            HealthConcern.user_id == user_id,
        )

        return db.scalar(stmt)

    def update_health_concern_status(
        self,
        db: Session,
        concern_id: int,
        status: str,
    ) -> HealthConcern | None:
        concern = db.get(HealthConcern, concern_id)

        if concern is None:
            return None

        concern.status = status
        db.flush()

        return concern

    def attach_plant_to_concern(
        self,
        db: Session,
        concern_id: int,
        plant_id: int,
    ) -> HealthConcern | None:
        concern = db.get(HealthConcern, concern_id)

        if concern is None:
            return None

        concern.plant_id = plant_id
        db.flush()

        return concern
