"""
Configuration settings for CVGenius backend
"""

import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from backend/.env only
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(env_path)


class Settings(BaseSettings):
    """Application settings"""
    
    # Basic app settings
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    
    # CORS settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",  # Local development
        "http://127.0.0.1:3000",  # Alternative localhost
        "https://cvgenius.vercel.app",  # Production frontend
        "https://cvgenius-nine.vercel.app",  # Your actual Vercel URL
        "https://cvgenius-8y064emqk-cemroots-projects.vercel.app",  # Previous deployment
        "https://cvgenius-n3793r72w-cemroots-projects.vercel.app",  # New deployment
        "https://www.cvgenius.com",  # Custom domain
    ]
    
    # Google Cloud settings
    GOOGLE_CLOUD_PROJECT: str = os.getenv("GOOGLE_CLOUD_PROJECT", "")
    GOOGLE_APPLICATION_CREDENTIALS: str = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")
    
    # AI Model settings
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    VERTEX_AI_LOCATION: str = os.getenv("VERTEX_AI_LOCATION", "us-central1")
    
    # Rate limiting
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", "15"))
    RATE_LIMIT_WINDOW: str = os.getenv("RATE_LIMIT_WINDOW", "1 hour")
    
    # File processing limits
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "5242880"))  # 5MB
    MAX_TEXT_LENGTH: int = int(os.getenv("MAX_TEXT_LENGTH", "50000"))  # 50k chars
    
    # PDF generation settings
    PDF_TIMEOUT: int = int(os.getenv("PDF_TIMEOUT", "30"))  # seconds

    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra environment variables


# Global settings instance
settings = Settings() 