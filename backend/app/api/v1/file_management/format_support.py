"""
Format Support
Provides information about supported file formats and validation
"""

from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings
from app.schemas.models import CVFormData

# Initialize router and rate limiter
router = APIRouter(tags=["File Support"])
limiter = Limiter(key_func=get_remote_address)


@router.get("/supported-formats")
async def get_supported_formats():
    """
    Get supported file formats and size limits
    """
    return {
        "supported_formats": [
            {
                "extension": "pdf",
                "mime_type": "application/pdf",
                "description": "PDF documents"
            },
            {
                "extension": "docx", 
                "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "description": "Microsoft Word documents (2007+)"
            },
            {
                "extension": "doc",
                "mime_type": "application/msword", 
                "description": "Microsoft Word documents (legacy)"
            }
        ],
        "max_file_size": settings.MAX_FILE_SIZE,
        "max_file_size_mb": settings.MAX_FILE_SIZE // (1024 * 1024),
        "max_text_length": settings.MAX_TEXT_LENGTH
    }


@router.post("/validate-form")
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW}")
async def validate_form_data(
    request: Request,
    form_data: CVFormData
):
    """
    Validate CV form data before processing
    """
    try:
        validation_errors = []
        validation_warnings = []
        
        # Validate personal details
        personal = form_data.personal_details
        
        if not personal.full_name or len(personal.full_name.strip()) < 2:
            validation_errors.append("Full name is required and must be at least 2 characters")
        
        if not personal.email or '@' not in personal.email:
            validation_errors.append("Valid email address is required")
        
        if not personal.phone:
            validation_errors.append("Phone number is required")
        elif not personal.phone.startswith('+353'):
            validation_warnings.append("Consider using Irish phone format (+353) for Dublin market")
        
        # Validate work experience
        if not form_data.work_experience:
            validation_warnings.append("At least one work experience entry is recommended")
        else:
            for i, exp in enumerate(form_data.work_experience):
                if not exp.job_title:
                    validation_errors.append(f"Job title is required for experience entry {i+1}")
                if not exp.company:
                    validation_errors.append(f"Company name is required for experience entry {i+1}")
        
        # Validate education
        if not form_data.education:
            validation_warnings.append("At least one education entry is recommended")
        
        # Validate skills
        if not form_data.skills or len(form_data.skills) < 3:
            validation_warnings.append("At least 3 skills are recommended for better ATS optimization")
        
        return {
            "valid": len(validation_errors) == 0,
            "errors": validation_errors,
            "warnings": validation_warnings,
            "message": "Validation completed" if len(validation_errors) == 0 else "Please fix validation errors"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")