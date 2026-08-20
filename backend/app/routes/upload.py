from fastapi import APIRouter, Depends

from pydantic import BaseModel

from app.service.s3_service import generate_upload_url

from app.routes.users import get_current_user

from app.models import User


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
