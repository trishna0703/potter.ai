from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.assessment import Assessment
from app.models.assessment_message import AssessmentMessage
from app.models.health_concern import HealthConcern


class InteractionService(BaseModel):

    def create_assessment_message(
        self,
        db: Session,
        assessment_id: int,
        role: str,
        message_type: str,
        payload: dict,
    ) -> AssessmentMessage:

        sequence_stmt = (
            select(AssessmentMessage.sequence)
            .where(AssessmentMessage.assessment_id == assessment_id)
            .order_by(AssessmentMessage.sequence.desc())
            .limit(1)
        )

        last_sequence = db.scalar(sequence_stmt)

        next_sequence = (last_sequence or 0) + 1

        message = AssessmentMessage(
            assessment_id=assessment_id,
            sequence=next_sequence,
            role=role,
            message_type=message_type,
            payload=payload,
        )

        db.add(message)
        db.flush()

        return message

    def get_assessment_message(
        self,
        db: Session,
        message_id: int,
    ) -> AssessmentMessage | None:
        return db.get(AssessmentMessage, message_id)

    def get_assessment_messages(
        self,
        db: Session,
        assessment_id: int,
        user_id: int,
    ) -> list[AssessmentMessage]:

        stmt = (
            select(AssessmentMessage)
            .join(
                Assessment,
                AssessmentMessage.assessment_id == Assessment.id,
            )
            .join(
                HealthConcern,
                Assessment.concern_id == HealthConcern.id,
            )
            .where(
                AssessmentMessage.assessment_id == assessment_id,
                HealthConcern.user_id == user_id,
            )
            .order_by(AssessmentMessage.sequence.asc())
        )

        return list(db.scalars(stmt).all())

    def get_latest_assessment_message(
        self,
        db: Session,
        assessment_id: int,
    ) -> AssessmentMessage | None:
        stmt = (
            select(AssessmentMessage)
            .where(AssessmentMessage.assessment_id == assessment_id)
            .order_by(AssessmentMessage.sequence.desc())
            .limit(1)
        )

        return db.scalar(stmt)

    def get_current_interaction(
        self,
        db: Session,
        assessment_id: int,
        interaction_id: int,
    ) -> AssessmentMessage | None:
        stmt = select(AssessmentMessage).where(
            AssessmentMessage.id == interaction_id,
            AssessmentMessage.assessment_id == assessment_id,
        )

        return db.scalar(stmt)

    def count_messages(
        self,
        db: Session,
        assessment_id: int,
    ) -> int:
        stmt = select(AssessmentMessage).where(
            AssessmentMessage.assessment_id == assessment_id
        )

        return len(db.scalars(stmt).all())
