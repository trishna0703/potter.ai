from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.concern_evidence import ConcernEvidence
from app.models.evidence import Evidence


class ConcernEvidenceService(BaseModel):

    def attach_evidence_to_concern(
        self,
        db: Session,
        concern_id: int,
        evidence_id: int,
    ) -> ConcernEvidence:

        existing = db.scalar(
            select(ConcernEvidence).where(
                ConcernEvidence.concern_id == concern_id,
                ConcernEvidence.evidence_id == evidence_id,
            )
        )

        if existing is not None:
            return existing

        association = ConcernEvidence(
            concern_id=concern_id,
            evidence_id=evidence_id,
        )

        db.add(association)
        db.flush()

        return association

    def remove_evidence_from_concern(
        self,
        db: Session,
        concern_id: int,
        evidence_id: int,
    ) -> bool:

        association = db.scalar(
            select(ConcernEvidence).where(
                ConcernEvidence.concern_id == concern_id,
                ConcernEvidence.evidence_id == evidence_id,
            )
        )

        if association is None:
            return False

        db.delete(association)
        db.flush()

        return True

    def get_concern_evidences(
        self,
        db: Session,
        concern_id: int,
    ) -> list[Evidence]:

        stmt = (
            select(Evidence)
            .join(
                ConcernEvidence,
                ConcernEvidence.evidence_id == Evidence.id,
            )
            .where(ConcernEvidence.concern_id == concern_id)
        )

        return list(db.scalars(stmt).all())
