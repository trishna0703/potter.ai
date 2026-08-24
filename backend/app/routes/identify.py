from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.routes.upload import (
    UploadRequestModel,
    handle_photo_upload_and_links,
)
from app.routes.users import get_current_user
from app.services.plant_service import PlantService
from app.services.s3_service import generate_download_url
from app.services.identification_ai import IdentificationAI
from app.models import PlantIdentification, Plant
from datetime import datetime
from pydantic import BaseModel
from app.schemas.plant import PlantResponse, plant_to_response

router = APIRouter()


def save_identification(
    concern_id: int | None, evidence_id: int, db: Session
) -> PlantIdentification:

    identification = PlantIdentification(
        concern_id=concern_id,
        evidence_id=evidence_id,
        status="PENDING",
        created_at=datetime.today(),
    )

    db.add(identification)
    db.flush()

    return identification


class IdentificationResponse(BaseModel):
    species: str
    confidence: float | None
    found_plants: list[PlantResponse]
    photo_id: int
    evidence_id: int
    is_new_plant: bool


@router.post("/", response_model=IdentificationResponse)
def plant_idenfication_entry_point(
    photo: UploadRequestModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> IdentificationResponse:

    photo_evidence = handle_photo_upload_and_links(photo, current_user, db)
    # call identify_and_save
    identified_plant = identify_and_save(
        concern_id=None,
        evidence_id=photo_evidence["evidence_id"],
        photo_id=photo_evidence["photo_id"],
        initial_context="",
        current_user=current_user,
        db=db,
    )

    return identified_plant


def identify_and_save(
    concern_id: int | None,
    evidence_id: int,
    photo_id: int,
    initial_context: str,
    current_user: User,
    db: Session,
) -> IdentificationResponse:
    try:
        # call save_identification
        saved_identity = save_identification(concern_id, evidence_id, db)

        # generate s3 url
        result = identify_plant_from_photo(
            photo_id=photo_id,
            initial_context=initial_context,
            current_user=current_user,
            db=db,
        )

        # Updates the identification row.
        saved_identity.species = result["species"]
        saved_identity.confidence = result["confidence"]
        saved_identity.status = "COMPLETED"

        db.commit()
        db.refresh(saved_identity)

    except Exception:
        db.rollback()
        raise

    return {
        "confidence": result["confidence"],
        "species": result["species"],
        "found_plants": result["found_plants"],
        "photo_id": result["photo_id"],
        "evidence_id": evidence_id,
        "is_new_plant": not result["found_plants"],
    }


def identify_plant_from_photo(
    photo_id: int,
    initial_context: str | None,
    current_user: User,
    db: Session,
):
    download_url = generate_download_url(photo_id, user_id=current_user.id, db=db)

    # AI identifies
    client = IdentificationAI()
    result = client.identify_plant(photo=download_url, initial_context=initial_context)

    plant_service = PlantService()
    found_plants = plant_service.get_plant_list_for_species(
        species=result.species, user_id=current_user.id, db=db
    )

    return {
        "confidence": result.confidence,
        "species": result.species,
        "photo_id": photo_id,
        "found_plants": [plant_to_response(plant) for plant in found_plants],
    }
