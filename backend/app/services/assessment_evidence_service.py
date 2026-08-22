from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.assessment_evidence import AssessmentEvidence
from app.models.evidence import Evidence


class AssessmentEvidenceService(BaseModel):

    def attach_evidence_to_assessment(
        self,
        db: Session,
        assessment_id: int,
        evidence_id: int,
    ) -> AssessmentEvidence:

        existing = db.scalar(
            select(AssessmentEvidence).where(
                AssessmentEvidence.assessment_id == assessment_id,
                AssessmentEvidence.evidence_id == evidence_id,
            )
        )

        if existing is not None:
            return existing

        association = AssessmentEvidence(
            assessment_id=assessment_id,
            evidence_id=evidence_id,
        )

        db.add(association)
        db.flush()

        return association

    def remove_evidence_from_assessment(
        self,
        db: Session,
        assessment_id: int,
        evidence_id: int,
    ) -> bool:

        association = db.scalar(
            select(AssessmentEvidence).where(
                AssessmentEvidence.assessment_id == assessment_id,
                AssessmentEvidence.evidence_id == evidence_id,
            )
        )

        if association is None:
            return False

        db.delete(association)
        db.flush()

        return True

    def get_assessment_evidences(
        self,
        db: Session,
        assessment_id: int,
    ) -> list[Evidence]:

        stmt = (
            select(Evidence)
            .join(
                AssessmentEvidence,
                AssessmentEvidence.evidence_id == Evidence.id,
            )
            .where(AssessmentEvidence.assessment_id == assessment_id)
        )

        return list(db.scalars(stmt).all())
