from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.models import (
    User,
    HealthConcern,
    PlantPhoto,
    Evidence,
    EvidencePhoto,
    ConcernEvidence,
)
from app.routes.users import get_current_user
from app.database import get_db
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.service.identification_service import identify_plant

router = APIRouter()


class RequestModel(BaseModel):
    photo_url: str
    initial_context: str
    occurred_on: date


class ResponseModel(BaseModel):
    concern_id: int
    photo_id: int


@router.post("/", response_model=ResponseModel)
def raise_concern(
    concern: RequestModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:

        new_concern = create_health_concern(concern, current_user.id, db)

        new_photo = upload_concern_photo(concern, current_user.id, db)

        new_evidence = create_new_evidence(
            concern.photo_url, concern.occurred_on, current_user.id, db
        )

        link_evidence_to_concern(new_concern.id, new_evidence.id, db)

        link_photo_to_evidence(new_evidence.id, new_photo.id, db)

        db.commit()

    except Exception:
        db.rollback()
        raise

    identification = identify_plant(
        concern_id=new_concern.id,
        evidence_id=new_evidence.id,
        photo=new_photo.photo_url,
        initial_context=concern.initial_context,
        db=db,
    )

    return {
        "concern_id": new_concern.id,
        "photo_id": new_photo.id,
        "evidence_id": new_evidence.id,
    }


def create_health_concern(
    concern: RequestModel,
    user_id: int,
    db: Session,
) -> HealthConcern:
    new_concern = HealthConcern(
        user_id=user_id,
        initial_context=concern.initial_context,
        occurred_on=concern.occurred_on,
        status="OPEN",
    )

    db.add(new_concern)
    db.flush()

    return new_concern


def upload_concern_photo(
    concern: RequestModel,
    user_id: int,
    db: Session,
) -> PlantPhoto:
    new_photo = PlantPhoto(
        user_id=user_id,
        photo_url=concern.photo_url,
        captured_on=concern.occurred_on,
        uploaded_on=date.today(),
        expires_on=date.today() + timedelta(days=7),
    )

    db.add(new_photo)
    db.flush()

    return new_photo


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
