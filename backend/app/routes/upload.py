from fastapi import APIRouter, Depends

from pydantic import BaseModel, ConfigDict

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


class PlantPhotoResponse(BaseModel):
    id: int
    photo_url: str
    captured_on: date
    uploaded_on: date
    expires_on: date

    model_config = ConfigDict(from_attributes=True)


@router.post("/", response_model=PlantPhotoResponse)
def upload_plant_photo(
    photo: UploadRequestModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PlantPhotoResponse:
    new_photo = PlantPhoto(
        user_id=current_user.id,
        photo_url=photo.photo_url,
        captured_on=photo.captured_on,
        uploaded_on=date.today(),
        expires_on=date.today() + timedelta(days=7),
    )

    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)

    return new_photo
