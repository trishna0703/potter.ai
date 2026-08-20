from app.models import User, PlantIdentification
from sqlalchemy.orm import Session
from app.service.s3_service import generate_download_url

from pydantic import BaseModel


class PlantIdentificationResult(BaseModel):
    species: str
    confidence: float


def save_identification(
    concern_id: int, evidence_id: int, db: Session
) -> PlantIdentification:

    identification = PlantIdentification(
        concern_id=concern_id,
        evidence_id=evidence_id,
        status="PENDING",
    )

    db.add(identification)
    db.flush()

    return identification


def identify_plant(
    concern_id: int,
    evidence_id: int,
    photo: str,
    initial_context: str,
    db: Session,
):
    # call save_identification
    saved_identity = save_identification(concern_id, evidence_id, db)

    # generate s3 url
    download_url = generate_download_url(photo)

    # AI identifies
    result = identify(photo=download_url, initial_context=initial_context)

    # Updates the identification row.

    return


def identify(self, photo: str, initial_context: str):
    return
