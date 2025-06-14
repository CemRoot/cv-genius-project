"""
Basic CV Generation Operations
Core CV creation functionality
"""

from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings
from app.schemas.models import CVFormData, PDFResponse
from app.services.generator_service import cv_service

# Initialize router and rate limiter
router = APIRouter(tags=["CV Generation"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/generate-from-form", response_model=PDFResponse)
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW}")
async def generate_cv_from_form(
    request: Request,
    form_data: CVFormData
) -> PDFResponse:
    """
    Generate CV from form data (Creator flow)
    
    Creates a professional CV and cover letter optimized for Dublin/Irish job market
    using AI-powered content generation with ATS optimization.
    """
    try:
        # Generate CV and cover letter
        result = await cv_service.generate_from_form(form_data)
        return result
        
    except Exception as e:
        # Log error for monitoring (without exposing sensitive data)
        error_msg = f"CV generation failed: {type(e).__name__}"
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-cv-pdf")
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW}")
async def generate_cv_pdf(
    request: Request,
    cv_data: dict
):
    """
    Generate CV PDF from structured data
    """
    try:
        # Generate only CV PDF
        cv_pdf, _ = await cv_service._generate_pdfs(cv_data)
        
        import base64
        from datetime import datetime
        
        return {
            "cv_pdf_base64": base64.b64encode(cv_pdf).decode(),
            "filename_cv": f"cv_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CV PDF generation failed: {str(e)}")


@router.post("/generate-cover-letter")
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW}")
async def generate_cover_letter_only(
    request: Request,
    data: dict
):
    """
    Generate cover letter content only (JSON response)
    """
    try:
        # Extract required data
        cv_data = data.get("cv_data", {})
        job_description = data.get("job_description", "")
        company_name = data.get("company_name", "")
        
        # Generate cover letter content
        result = await cv_service.generate_cover_letter_only(cv_data, job_description, company_name)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cover letter generation failed: {str(e)}")


@router.post("/generate-cover-letter-pdf")
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW}")
async def generate_cover_letter_pdf(
    request: Request,
    cover_letter_data: dict
):
    """
    Generate cover letter PDF from structured data
    """
    try:
        # Generate only cover letter PDF
        _, cover_letter_pdf = await cv_service._generate_pdfs(cover_letter_data)
        
        import base64
        from datetime import datetime
        
        return {
            "cover_letter_pdf_base64": base64.b64encode(cover_letter_pdf).decode(),
            "filename_cover_letter": f"cover_letter_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cover letter PDF generation failed: {str(e)}")