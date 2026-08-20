from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from app.models import (
    User,
    HealthConcern,
    PlantPhoto,
    Evidence,
    EvidencePhoto,
    ConcernEvidence,
    Plant,
    PlantIdentification,
)
from app.routes.users import get_current_user
from app.database import get_db
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.service.identification_service import identify_plant
from sqlalchemy import select
from uuid import UUID
from app.service.identification_service import get_plant_list_for_species

router = APIRouter()


class RequestModel(BaseModel):
    submission_id: UUID
    photo_url: str
    initial_context: str
    occurred_on: date


class PlantResponse(BaseModel):
    id: int
    name: str
    species: str

    model_config = ConfigDict(from_attributes=True)


class ResponseModel(BaseModel):
    concern_id: int
    evidence_id: int
    found_plants: list[PlantResponse]


@router.get("/")
def get_active_concerns(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):

    stmt = (
        select(HealthConcern, PlantIdentification.species)
        .outerjoin(
            PlantIdentification,
            PlantIdentification.concern_id == HealthConcern.id,
        )
        .where(
            HealthConcern.user_id == current_user.id,
            HealthConcern.status == "OPEN",
        )
    )

    concerns = db.execute(stmt).all()
    return [
        {
            "id": concern.id,
            "plant_id": concern.plant_id,
            "initial_context": concern.initial_context,
            "status": concern.status,
            "occurred_on": concern.occurred_on,
            "reported_on": concern.reported_on,
            "identified_species": species,
        }
        for concern, species in concerns
    ]


@router.post("/", response_model=ResponseModel)
def raise_concern(
    concern: RequestModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing_concern = db.scalar(
        select(HealthConcern).where(
            HealthConcern.user_id == current_user.id,
            HealthConcern.submission_id == str(concern.submission_id),
        )
    )

    if existing_concern:

        existing_evidence_id = db.scalar(
            select(ConcernEvidence.evidence_id).where(
                ConcernEvidence.concern_id == existing_concern.id
            )
        )

        identified_plant = db.scalar(
            select(PlantIdentification).where(
                PlantIdentification.concern_id == existing_concern.id
            )
        )

        if identify_plant.status != "COMPLETED" or not identified_plant.species:
            return {
                "concern_id": existing_concern.id,
                "evidence_id": existing_evidence_id,
                "found_plants": [],
            }

        found_plants = get_plant_list_for_species(
            species=identified_plant.species, user_id=current_user.id, db=db
        )

        return {
            "concern_id": existing_concern.id,
            "evidence_id": existing_evidence_id,
            "found_plants": found_plants,
        }

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

    found_plants = identify_plant(
        concern_id=new_concern.id,
        evidence_id=new_evidence.id,
        photo=new_photo.photo_url,
        initial_context=concern.initial_context,
        user_id=current_user.id,
        db=db,
    )

    return {
        "concern_id": new_concern.id,
        "evidence_id": new_evidence.id,
        "found_plants": found_plants,
    }


def create_health_concern(
    concern: RequestModel,
    user_id: int,
    db: Session,
) -> HealthConcern:
    new_concern = HealthConcern(
        user_id=user_id,
        initial_context=concern.initial_context,
        submission_id=str(concern.submission_id),
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
