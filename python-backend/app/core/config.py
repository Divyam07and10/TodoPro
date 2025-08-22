from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings."""
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str  # Async URL for APIs
    DATABASE_SYNC_URL: str  # Sync URL for Alembic
    
    # Security
    ACCESS_TOKEN_SECRET: str
    REFRESH_TOKEN_SECRET: str
    API_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE: str = "30m"
    REFRESH_TOKEN_EXPIRE: str = "7d"
    
    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: Optional[str] = None
    
    # File Upload
    MAX_FILE_SIZE: int = 2 * 1024 * 1024 # 2MB
    UPLOAD_DIR: str = "static/avatars"
    ALLOWED_EXTENSIONS: str = "jpg,jpeg,png,gif,svg"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()