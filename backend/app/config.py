from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    google_client_id: str
    aws_region: str
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_s3_bucket_name: str
    openai_api_key: str
    openrouter_api_key: str
    ai_model: str
    frontend_url:str

    class Config:
        env_file = ".env"


settings = Settings()
