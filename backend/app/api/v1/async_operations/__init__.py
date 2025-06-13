"""
Async Operations Domain
Handles background tasks and asynchronous CV generation
"""

from .async_cv import router as async_router

__all__ = ['async_router']