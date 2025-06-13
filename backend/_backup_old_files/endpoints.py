"""
API endpoints for CVGenius
"""

import asyncio
from typing import Dict, Any
from datetime import datetime
import uuid

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, Request
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

from app.core.config import settings
from app.schemas.models import CVFormData, CVUploadRequest, PDFResponse, ErrorResponse
from app.services.generator_service import cv_service

# Initialize router and rate limiter
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post("/generate-from-form", response_model=PDFResponse)
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW}")
async def generate_cv_from_form(
    request: Request,
    form_data: CVFormData
) -> PDFResponse:
    """
    Generate CV and cover letter from form data (Creator flow)
    
    This endpoint processes structured form data and generates
    professional CV and cover letter documents.
    """
    try:
        # Validate input data
        if not form_data.personal_details.full_name.strip():
            raise HTTPException(
                status_code=400, 
                detail="Full name is required"
            )
        
        if not form_data.work_experience:
            raise HTTPException(
                status_code=400,
                detail="At least one work experience entry is required"
            )
        
        # Generate CV using AI service
        result = await cv_service.generate_from_form(form_data)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"CV generation failed: {str(e)}"
        )


@router.post("/generate-from-upload", response_model=PDFResponse)
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW}")
async def generate_cv_from_upload(
    request: Request,
    file: UploadFile = File(...),
    job_description: str = Form(...)
) -> PDFResponse:
    """
    Generate updated CV from uploaded file (Updater flow)
    
    This endpoint processes an uploaded CV file and job description
    to generate an optimized CV and cover letter.
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file uploaded"
            )
        
        # Check file size
        file_content = await file.read()
        if len(file_content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE / 1024 / 1024:.1f}MB"
            )
        
        # Validate job description
        if len(job_description.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Job description must be at least 50 characters"
            )
        
        if len(job_description) > settings.MAX_TEXT_LENGTH:
            raise HTTPException(
                status_code=400,
                detail=f"Job description too long. Maximum: {settings.MAX_TEXT_LENGTH} characters"
            )
        
        # Extract text from file
        file_extension = file.filename.lower().split('.')[-1]
        
        if file_extension == 'pdf':
            cv_content = cv_service.extract_text_from_pdf(file_content)
        elif file_extension in ['docx', 'doc']:
            cv_content = cv_service.extract_text_from_docx(file_content)
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format. Please upload PDF or DOCX files only."
            )
        
        # Validate extracted content
        if len(cv_content.strip()) < 100:
            raise HTTPException(
                status_code=400,
                detail="Could not extract sufficient content from the uploaded file"
            )
        
        # Generate updated CV using AI service
        result = await cv_service.generate_from_upload(cv_content, job_description)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"CV update failed: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "cvgenius-api",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


@router.post("/validate-form")
async def validate_form_data(form_data: CVFormData):
    """
    Validate form data without generating CV
    Useful for frontend validation
    """
    try:
        # If we reach here, Pydantic validation passed
        return {
            "valid": True,
            "message": "Form data is valid"
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Validation failed: {str(e)}"
        )


@router.get("/supported-formats")
async def get_supported_formats():
    """Get list of supported file formats for upload"""
    return {
        "supported_formats": [
            {
                "extension": "pdf",
                "mime_type": "application/pdf",
                "description": "Adobe PDF Document"
            },
            {
                "extension": "docx", 
                "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "description": "Microsoft Word Document"
            }
        ],
        "max_file_size": settings.MAX_FILE_SIZE,
        "max_file_size_mb": round(settings.MAX_FILE_SIZE / 1024 / 1024, 1)
    }


@router.post("/generate-cover-letter-pdf")
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW}")
async def generate_cover_letter_pdf(
    request: Request,
    cover_letter_data: Dict[str, Any]
):
    """
    Generate a new cover letter PDF from edited data
    """
    try:
        import base64
        from datetime import datetime
        from jinja2 import Environment, FileSystemLoader
        from weasyprint import HTML
        
        # Initialize Jinja2 environment for this endpoint
        jinja_env = Environment(
            loader=FileSystemLoader('app/templates'),
            autoescape=True
        )
        
        # Load cover letter template
        letter_template = jinja_env.get_template('letter_template.html')
        
        # Prepare template data with current date
        template_data = cover_letter_data.copy()
        template_data['generation_date'] = datetime.now().strftime("%B %d, %Y")
        
        # Render HTML
        letter_html = letter_template.render(**template_data)
        
        # Generate PDF
        cover_letter_pdf = HTML(string=letter_html).write_pdf()
        
        return {
            "cover_letter_pdf_base64": base64.b64encode(cover_letter_pdf).decode(),
            "filename_cover_letter": f"cover_letter_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Cover letter PDF generation failed: {str(e)}"
        )


@router.post("/regenerate-cover-letter")
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW}")
async def regenerate_cover_letter(
    request: Request,
    data: Dict[str, Any]
):
    """
    Regenerate cover letter content using AI
    """
    try:
        cv_data = data.get('cv_data', {})
        job_description = data.get('job_description', '')
        
        # Create AI prompt for cover letter regeneration
        if job_description:
            prompt = cv_service._create_update_prompt(
                cv_content=str(cv_data), 
                job_description=job_description
            )
        else:
            # Create a minimal prompt for regeneration without job description
            prompt = f"""Regenerate a professional cover letter for this candidate.
            
            Candidate Data: {cv_data}
            
            Create a fresh, compelling cover letter with:
            1. Strong opening paragraph
            2. Relevant experience highlights
            3. Professional closing
            
            Output the same JSON format with updated cover_letter_body."""
        
        # Get AI response
        ai_response = await cv_service._call_gemini(prompt)
        
        # Parse AI response
        updated_data = cv_service._parse_ai_response(ai_response)
        
        return updated_data
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Cover letter regeneration failed: {str(e)}"
        )


@router.post("/generate-cv-pdf")
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW}")
async def generate_cv_pdf(
    request: Request,
    cv_data: Dict[str, Any]
):
    """
    Generate a new CV PDF from edited data
    """
    try:
        import base64
        from datetime import datetime
        
        # Generate CV PDF using the service
        cv_pdf, _ = await cv_service._generate_pdfs(cv_data)
        
        return {
            "cv_pdf_base64": base64.b64encode(cv_pdf).decode(),
            "filename_cv": f"cv_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"CV PDF generation failed: {str(e)}"
        )