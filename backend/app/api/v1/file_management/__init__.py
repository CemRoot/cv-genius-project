"""
File Management Domain
Handles file uploads, downloads, and format support
"""

from .upload_handler import router as upload_router
from .format_support import router as format_router

__all__ = ['upload_router', 'format_router']