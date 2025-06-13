"""
File Upload Handler
Manages CV file uploads and processing
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings
from app.schemas.models import PDFResponse
from app.services.generator_service import cv_service

# Initialize router and rate limiter
router = APIRouter(tags=["File Management"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/generate-from-upload", response_model=PDFResponse)
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW}")
async def generate_cv_from_upload(
    request: Request,
    file: UploadFile = File(...),
    job_description: str = Form(...),
    theme: str = Form(default="classic")
) -> PDFResponse:
    """
    Generate CV from uploaded file (Updater flow)
    
    Accepts PDF or DOCX CV files, extracts content, and generates
    an optimized version based on the provided job description.
    """
    try:
        # Validate file type
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        file_ext = file.filename.lower().split('.')[-1]
        if file_ext not in ['pdf', 'docx', 'doc']:
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file format. Please upload PDF or DOCX files only."
            )
        
        # Validate file size (5MB limit)
        content = await file.read()
        if len(content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Extract text from file
        if file_ext == 'pdf':
            cv_text = cv_service.extract_text_from_pdf(content)
        elif file_ext in ['docx', 'doc']:
            cv_text = cv_service.extract_text_from_docx(content)
        
        # Validate extracted text
        if not cv_text or len(cv_text.strip()) < 100:
            raise HTTPException(
                status_code=400,
                detail="Could not extract sufficient text from the uploaded file. Please ensure the file contains readable text."
            )
        
        # Generate updated CV
        result = await cv_service.generate_from_upload(cv_text, job_description, theme)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"File processing failed: {type(e).__name__}"
        raise HTTPException(status_code=500, detail=str(e))