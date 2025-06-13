"""
Health Monitoring
System health checks and status endpoints
"""

from fastapi import APIRouter
from datetime import datetime

from app.core.config import settings
from app.services.generator_service import cv_service

# Initialize router
router = APIRouter(tags=["System Health"])


@router.get("/health")
async def health_check():
    """
    Basic health check endpoint
    """
    return {
        "status": "healthy",
        "service": "cvgenius-api",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "environment": settings.DEBUG and "development" or "production"
    }


@router.get("/health/detailed")
async def detailed_health_check():
    """
    Detailed health check with service status
    """
    health_status = {
        "status": "healthy",
        "service": "cvgenius-api", 
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "environment": settings.DEBUG and "development" or "production",
        "components": {}
    }
    
    # Check Gemini API key
    try:
        if cv_service.gemini_api_key and cv_service.gemini_api_key != "your_gemini_api_key_here":
            health_status["components"]["gemini_api"] = "configured"
        else:
            health_status["components"]["gemini_api"] = "not_configured"
            health_status["status"] = "degraded"
    except Exception:
        health_status["components"]["gemini_api"] = "error"
        health_status["status"] = "degraded"
    
    # Check PDF generation
    try:
        from app.services.generator_service import HTML
        if HTML is not None:
            health_status["components"]["pdf_generation"] = "available"
        else:
            health_status["components"]["pdf_generation"] = "unavailable"
            health_status["status"] = "degraded"
    except Exception:
        health_status["components"]["pdf_generation"] = "error"
        health_status["status"] = "degraded"
    
    # Check file processing
    try:
        from app.services.generator_service import PdfReader, Document
        health_status["components"]["file_processing"] = {
            "pdf_support": PdfReader is not None,
            "docx_support": Document is not None
        }
    except Exception:
        health_status["components"]["file_processing"] = "error"
    
    return health_status


@router.get("/status")
async def get_system_status():
    """
    System status and configuration info
    """
    return {
        "api_version": "2.0.0",
        "model": settings.GEMINI_MODEL,
        "rate_limits": {
            "requests": settings.RATE_LIMIT_REQUESTS,
            "window": settings.RATE_LIMIT_WINDOW
        },
        "file_limits": {
            "max_size_mb": settings.MAX_FILE_SIZE // (1024 * 1024),
            "max_text_length": settings.MAX_TEXT_LENGTH
        },
        "features": [
            "AI-powered CV generation",
            "Dublin/Irish market optimization", 
            "ATS compatibility analysis",
            "Cover letter generation",
            "Multi-format file support",
            "Real-time validation"
        ]
    }