"""
Configuration management using Pydantic settings
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from pydantic import Field, ConfigDict


class Settings(BaseSettings):
    """Application settings"""
    
    # Pydantic v2 config: read from .env and environment, ignore extra fields
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"  # Ignore extra environment variables to avoid validation errors
    )
    
    # Environment
    environment: str = "dev"
    app_name: str = "HR Cloud API"
    app_version: str = "1.0.0"
    
    # Database
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "hrdb"
    # Make credentials optional at instantiation so the settings object can be created
    # (useful when running tools or in reload subprocesses). Accessing database_url
    # will raise a clear error if credentials are missing.
    db_username: Optional[str] = Field(None)
    db_password: Optional[str] = Field(None)
    
    # API
    api_prefix: str = "/api/v1"
    
    # Logging
    log_level: str = "INFO"
    
    # CORS
    cors_origins: list[str] = ["*"]  # Restrict this in production
    
    # Security
    secret_key: Optional[str] = None
    
    @property
    def database_url(self) -> str:
        """Construct database URL"""
        if not self.db_username or not self.db_password:
            raise RuntimeError(
                "Database credentials are not set. Please set `db_username` and `db_password` in environment or .env before starting the app."
            )
        return f"postgresql+asyncpg://{self.db_username}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"
    
    @property
    def database_url_sync(self) -> str:
        """Construct synchronous database URL"""
        if not self.db_username or not self.db_password:
            raise RuntimeError(
                "Database credentials are not set. Please set `db_username` and `db_password` in environment or .env before starting the app."
            )
        return f"postgresql://{self.db_username}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"


# Global settings instance
settings = Settings()



