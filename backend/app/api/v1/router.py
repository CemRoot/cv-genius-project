"""
Main API Router
Orchestrates all domain routers for v1 API
"""

from fastapi import APIRouter

# Import domain routers
from .cv_operations import basic_router
from .file_management import upload_router, format_router
from .async_operations import async_router
from .system import health_router

# Create main v1 router
router = APIRouter()

# Include domain routers with appropriate prefixes
router.include_router(basic_router, prefix="/cv", tags=["CV Generation"])
router.include_router(upload_router, prefix="/files", tags=["File Management"])
router.include_router(format_router, prefix="/files", tags=["File Support"])
router.include_router(async_router, prefix="/async", tags=["Async Operations"])
router.include_router(health_router, prefix="", tags=["System Health"])

# Legacy endpoint support (for backward compatibility)
router.include_router(basic_router, tags=["Legacy - CV Generation"])
router.include_router(upload_router, tags=["Legacy - File Management"])
router.include_router(format_router, tags=["Legacy - File Support"])