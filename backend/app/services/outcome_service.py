from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.outcome import Outcome


class OutcomeService(BaseModel):

    def create_outcome(
        self,
        db: Session,
        concern_id: int,
        outcome_type: str,
        description: str | None = None,
        recorded_on=None,
    ) -> Outcome:

        outcome = Outcome(
            concern_id=concern_id,
            outcome_type=outcome_type,
            description=description,
            recorded_on=recorded_on,
        )

        db.add(outcome)
        db.flush()

        return outcome

    def get_outcome(
        self,
        db: Session,
        outcome_id: int,
    ) -> Outcome | None:
        return db.get(Outcome, outcome_id)

    def get_outcomes_for_concern(
        self,
        db: Session,
        concern_id: int,
    ) -> list[Outcome]:

        stmt = (
            select(Outcome)
            .where(Outcome.concern_id == concern_id)
            .order_by(Outcome.recorded_on.asc(), Outcome.id.asc())
        )

        return list(db.scalars(stmt).all())
