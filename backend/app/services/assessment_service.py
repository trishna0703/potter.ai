from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.assessment import Assessment
from app.models.assessment_message import AssessmentMessage


class AssessmentService(BaseModel):
    def create_assessment(
        self,
        db: Session,
        concern_id: int,
        status: str,
    ) -> Assessment:
        assessment = Assessment(
            concern_id=concern_id,
            status=status,
        )

        db.add(assessment)
        db.flush()

        return assessment

    def get_assessment(
        self,
        db: Session,
        assessment_id: int,
    ) -> Assessment | None:
        return db.get(Assessment, assessment_id)

    def get_assessment_for_concern(
        self,
        db: Session,
        concern_id: int,
    ) -> Assessment | None:
        stmt = (
            select(Assessment)
            .where(Assessment.concern_id == concern_id)
            .order_by(Assessment.id.desc())
            .limit(1)
        )

        return db.scalar(stmt)

    def get_assessments_for_concern(
        self,
        db: Session,
        concern_id: int,
    ) -> list[Assessment]:
        stmt = (
            select(Assessment)
            .where(Assessment.concern_id == concern_id)
            .order_by(Assessment.created_on.desc(), Assessment.id.desc())
        )

        return list(db.scalars(stmt).all())

    def update_assessment_status(
        self,
        db: Session,
        assessment_id: int,
        status: str,
    ) -> Assessment | None:
        assessment = db.get(Assessment, assessment_id)

        if assessment is None:
            return None

        assessment.status = status
        db.flush()

        return assessment

    def set_current_interaction(
        self,
        db: Session,
        assessment_id: int,
        interaction_id: int | None,
    ) -> Assessment | None:
        assessment = db.get(Assessment, assessment_id)

        if assessment is None:
            return None

        assessment.current_interaction_id = interaction_id
        db.flush()

        return assessment

    def update_assessment_result(
        self,
        db: Session,
        assessment_id: int,
        problem: str,
        problem_cause: str,
        confidence: str,
        explanation: str,
    ) -> Assessment | None:
        assessment = db.get(Assessment, assessment_id)

        if assessment is None:
            return None

        assessment.problem = problem
        assessment.problem_cause = problem_cause
        assessment.confidence = confidence
        assessment.explanation = explanation

        db.flush()

        return assessment

    def get_assessment_for_update(
        self,
        db: Session,
        assessment_id: int,
    ) -> Assessment | None:
        """
        Lock the assessment row for the current transaction.

        Useful when handling concurrent WebSocket submissions.
        """
        stmt = (
            select(Assessment).where(Assessment.id == assessment_id).with_for_update()
        )

        return db.scalar(stmt)

    def get_or_create_assessment(
        self,
        db: Session,
        concern_id: int,
        initial_status: str,
    ) -> Assessment:

        assessment = self.get_assessment_for_concern(
            db,
            concern_id=concern_id,
        )

        if assessment is not None:
            return assessment

        return self.create_assessment(
            db,
            concern_id=concern_id,
            status=initial_status,
        )

    def get_evidence_for_reassessment(
        self,
        db: Session,
        previous_assessment_id: int,
    ) -> list[int]:
        previous_assessment = self.get_assessment(
            db,
            assessment_id=previous_assessment_id,
        )

        if previous_assessment is None:
            return []

        return list(previous_assessment.evidences)

    def get_previous_assessment(
        self,
        db: Session,
        *,
        concern_id: int,
        current_assessment_id: int,
    ) -> Assessment | None:
        stmt = (
            select(Assessment)
            .where(
                Assessment.concern_id == concern_id,
                Assessment.id != current_assessment_id,
            )
            .order_by(Assessment.id.desc())
            .limit(1)
        )

        return db.scalar(stmt)

    def get_latest_completed_assessment(
        self,
        db: Session,
        *,
        concern_id: int,
    ) -> Assessment | None:
        stmt = (
            select(Assessment)
            .where(
                Assessment.concern_id == concern_id,
                Assessment.status == "COMPLETED",
            )
            .order_by(Assessment.id.desc())
            .limit(1)
        )

        return db.scalar(stmt)

    def count_questions_asked(self, db: Session, *, assessment_id: int) -> int:
        stmt = select(func.count(AssessmentMessage.id)).where(
            AssessmentMessage.assessment_id == assessment_id,
            AssessmentMessage.message_type == "question",
        )
        return db.execute(stmt).scalar_one()
