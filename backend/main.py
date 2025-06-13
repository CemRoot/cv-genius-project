"""
CVGenius Backend - FastAPI Application Entry Point
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uvicorn

# Load environment variables from .env file
load_dotenv()

from app.api.v1.router import router as api_v1_router
from app.core.config import settings

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Create FastAPI app
app = FastAPI(
    title="CVGenius API",
    description="Complete AI-powered CV generation platform with advanced features",
    version="2.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development için tüm origin'lere izin ver
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_v1_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "CVGenius API is running",
        "version": "2.0.0",
        "features": [
            "AI-powered CV generation",
            "ATS compatibility analysis",
            "Real-time collaboration",
            "Multi-format export",
            "Performance analytics",
            "Mobile-responsive interface"
        ]
    }


@app.get("/health")
async def health_check():
    """Detailed health check for monitoring"""
    return {
        "status": "healthy",
        "service": "cvgenius-api",
        "version": "2.0.0",
        "endpoints": {
            "basic": "/api/v1",
            "advanced": "/api/v1/advanced"
        }
    }


# Vercel handler
def handler(request):
    """Vercel serverless function handler"""
    return app(request.scope, request.receive, request.send)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=settings.DEBUG,
        log_level="info"
    )