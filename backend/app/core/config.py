from pydantic import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "DIP-easy"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "dip_easy"
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    # JWT Settings
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    @property
    def get_database_url(self) -> str:
        if self.SQLALCHEMY_DATABASE_URI:
            return self.SQLALCHEMY_DATABASE_URI
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"

    class Config:
        case_sensitive = True

settings = Settings() 