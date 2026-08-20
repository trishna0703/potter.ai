import boto3
from botocore.config import Config

from app.config import settings

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
    object_key: str,
    expires_in: int = 300,
) -> str:
    return s3_client.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": settings.aws_s3_bucket_name,
            "Key": object_key,
        },
        ExpiresIn=expires_in,
        HttpMethod="GET",
    )
