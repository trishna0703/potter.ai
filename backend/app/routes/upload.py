from fastapi import APIRouter, Depends

from pydantic import BaseModel, ConfigDict

from app.services.helper_services import create_new_evidence, link_photo_to_evidence
from app.services.s3_service import generate_upload_url

from app.routes.users import get_current_user

from app.models import User

from sqlalchemy.orm import Session

from app.models.plant_photo import PlantPhoto

from datetime import date, timedelta

from app.database import get_db

from app.routes.users import get_current_user


class PresignedUploadRequest(BaseModel):
    file_name: str
    content_type: str


router = APIRouter()


@router.post("/presign")
def create_presigned_upload_url(
    request: PresignedUploadRequest, current_user: User = Depends(get_current_user)
):
    object_key = f"plant_photo/{current_user.id}/{request.file_name}"

    url = generate_upload_url(
        object_key=object_key,
        content_type=request.content_type,
    )

    return {
        "upload_url": url,
        "object_key": object_key,
    }


class UploadRequestModel(BaseModel):
    photo_url: str
    captured_on: date
    plant_id: int | None = None


class PlantPhotoResponse(BaseModel):
    photo_id: int
    evidence_id: int


def upload_plant_photo(
    photo: UploadRequestModel, current_user: User, db: Session
) -> PlantPhoto:
    new_photo = PlantPhoto(
        user_id=current_user.id,
        photo_url=photo.photo_url,
        captured_on=photo.captured_on,
        uploaded_on=date.today(),
        plant_id=photo.plant_id,
        expires_on=date.today() + timedelta(days=7),
    )

    db.add(new_photo)
    db.flush()

    return new_photo


@router.post("/", response_model=PlantPhotoResponse)
def handle_photo_upload_and_links(
    photo: UploadRequestModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PlantPhotoResponse:
    # upload to plantphoto
    plant_photo = upload_plant_photo(photo, current_user, db)

    # upload to evidence
    evidence = create_new_evidence(
        photo_url=plant_photo.photo_url,
        occurred_on=plant_photo.captured_on,
        user_id=current_user.id,
        db=db,
    )

    #  upload to evidence photo
    link_photo_to_evidence(evidence_id=evidence.id, photo_id=plant_photo.id, db=db)

    db.commit()

    return {"photo_id": plant_photo.id, "evidence_id": evidence.id}
