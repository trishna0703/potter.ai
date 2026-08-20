from app.models import PlantIdentification, Plant
from sqlalchemy.orm import Session
from app.service.s3_service import generate_download_url
from datetime import datetime
from app.routes.ai_client import AIClient
from sqlalchemy import select


def save_identification(
    concern_id: int, evidence_id: int, db: Session
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


def identify_plant(
    concern_id: int,
    evidence_id: int,
    photo: str,
    initial_context: str,
    user_id: int,
    db: Session,
):
    try:
        # call save_identification
        saved_identity = save_identification(concern_id, evidence_id, db)

        # generate s3 url
        download_url = generate_download_url(photo)

        # AI identifies
        client = AIClient()
        result = client.identify_plant(
            photo=download_url, initial_context=initial_context
        )

        # Updates the identification row.
        saved_identity.species = result.species
        saved_identity.confidence = result.confidence
        saved_identity.status = "COMPLETED"

        db.commit()
        db.refresh(saved_identity)

    except Exception:
        db.rollback()
        raise

    found_plants = get_plant_list_for_species(
        species=result.species, user_id=user_id, db=db
    )

    return found_plants


def get_plant_list_for_species(species: str, user_id: int, db: Session) -> list[Plant]:
    stmt = select(Plant).where(Plant.species == species, Plant.user_id == user_id)

    found_plants = db.scalars(stmt).all()

    return found_plants
