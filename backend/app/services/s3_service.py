import boto3
from botocore.config import Config
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from app.config import settings
from app.database import get_db
from sqlalchemy import select
from app.models.plant_photo import PlantPhoto
from app.models.user import User
from app.routes.users import get_current_user

s3_client = boto3.client(
    "s3",
    region_name=settings.aws_region,
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
    config=Config(
        signature_version="s3v4",
        s3={"addressing_style": "virtual"},
    ),
)


def generate_upload_url(
    object_key: str,
    content_type: str,
    expires_in: int = 300,
) -> str:

    return s3_client.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": settings.aws_s3_bucket_name,
            "Key": object_key,
            "ContentType": content_type,
        },
        ExpiresIn=expires_in,
        HttpMethod="PUT",
    )


def generate_download_url(
    photo_id: int,
    user_id: int,
    db: Session,
    expires_in: int = 300,
) -> str:
    stmt = select(PlantPhoto).where(
        PlantPhoto.id == photo_id, PlantPhoto.user_id == user_id
    )

    plant_obj = db.scalar(stmt)

    if not plant_obj:
        raise HTTPException(
            status_code=404,
            detail="Plant photo not found",
        )

    return s3_client.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": settings.aws_s3_bucket_name,
            "Key": plant_obj.photo_url,
        },
        ExpiresIn=expires_in,
        HttpMethod="GET",
    )
