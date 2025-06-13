"""
System Monitoring
Performance metrics and system monitoring endpoints
"""

from fastapi import APIRouter
from datetime import datetime
import psutil
import os

from app.core.config import settings

# Initialize router
router = APIRouter(tags=["System Monitoring"])


@router.get("/metrics")
async def get_system_metrics():
    """
    Get basic system performance metrics
    """
    try:
        # Get system metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return {
            "timestamp": datetime.now().isoformat(),
            "system": {
                "cpu_usage_percent": cpu_percent,
                "memory": {
                    "total_gb": round(memory.total / (1024**3), 2),
                    "available_gb": round(memory.available / (1024**3), 2),
                    "used_percent": memory.percent
                },
                "disk": {
                    "total_gb": round(disk.total / (1024**3), 2),
                    "free_gb": round(disk.free / (1024**3), 2),
                    "used_percent": round((disk.used / disk.total) * 100, 2)
                }
            },
            "process": {
                "pid": os.getpid(),
                "memory_mb": round(psutil.Process().memory_info().rss / (1024**2), 2)
            }
        }
    except Exception:
        # If psutil is not available, return basic info
        return {
            "timestamp": datetime.now().isoformat(),
            "system": "metrics_unavailable",
            "note": "Install psutil for detailed metrics"
        }


@router.get("/version")
async def get_version_info():
    """
    Get API version and build information
    """
    return {
        "api_version": "2.0.0",
        "build_date": "2025-01-13",
        "python_version": f"{os.sys.version_info.major}.{os.sys.version_info.minor}.{os.sys.version_info.micro}",
        "environment": "development" if settings.DEBUG else "production",
        "features": {
            "cv_generation": True,
            "cover_letter_generation": True,
            "file_upload": True,
            "async_processing": True,
            "dublin_optimization": True,
            "ats_compliance": True
        }
    }