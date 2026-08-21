from datetime import date

from sqlalchemy.orm import Session

from app.models.concern_evidence import ConcernEvidence
from app.models.evidence import Evidence
from app.models.evidence_photo import EvidencePhoto


def create_new_evidence(
    photo_url: str,
    occurred_on: date,
    user_id: int,
    db: Session,
) -> Evidence:
    new_evidence = Evidence(
        evidence_type="photo",
        evidence_value=photo_url,
        value_type="image",
        recorded_on=occurred_on,
        user_id=user_id,
    )

    db.add(new_evidence)
    db.flush()

    return new_evidence


def link_evidence_to_concern(
    concern_id: int,
    evidence_id: int,
    db: Session,
) -> ConcernEvidence:
    new_concern_evidence = ConcernEvidence(
        concern_id=concern_id, evidence_id=evidence_id
    )

    db.add(new_concern_evidence)
    db.flush()

    return new_concern_evidence


def link_photo_to_evidence(
    evidence_id: int,
    photo_id: int,
    db: Session,
) -> EvidencePhoto:
    new_evidence_photo = EvidencePhoto(
        evidence_id=evidence_id,
        photo_id=photo_id,
    )

    db.add(new_evidence_photo)
    db.flush()

    return new_evidence_photo
