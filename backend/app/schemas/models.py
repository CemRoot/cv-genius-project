"""
Pydantic models for request/response validation
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, field_validator, Field
from datetime import datetime


class PersonalDetails(BaseModel):
    """Personal information model"""
    full_name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    phone: str = Field(..., min_length=5, max_length=20)
    linkedin_url: Optional[str] = Field(None, pattern=r'^https?://.*linkedin\.com.*')
    location: Optional[str] = Field(None, max_length=100)


class WorkExperience(BaseModel):
    """Work experience model"""
    job_title: str = Field(..., min_length=2, max_length=100)
    company: str = Field(..., min_length=2, max_length=100)
    start_date: str = Field(..., min_length=4, max_length=20)
    end_date: Optional[str] = Field(None, max_length=20)
    is_current: bool = False
    description: str = Field(..., min_length=10, max_length=2000)
    location: Optional[str] = Field(None, max_length=100)


class Education(BaseModel):
    """Education model"""
    degree: str = Field(..., min_length=2, max_length=100)
    institution: str = Field(..., min_length=2, max_length=100)
    start_date: str = Field(..., min_length=4, max_length=20)
    end_date: Optional[str] = Field(None, max_length=20)
    grade: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=100)


class CVFormData(BaseModel):
    """Complete CV form data from the Creator flow"""
    personal_details: PersonalDetails
    work_experience: List[WorkExperience] = Field(..., min_items=1)
    education: List[Education] = Field(..., min_items=1)
    skills: str = Field(..., min_length=10, max_length=1000)
    job_description: Optional[str] = Field(None, max_length=5000)
    theme: Optional[str] = Field(default="classic", pattern=r'^(classic|modern|academic)$')
    
    @field_validator('job_description')
    @classmethod
    def validate_job_description(cls, v):
        if v and len(v.strip()) < 50:
            raise ValueError('Job description must be at least 50 characters if provided')
        return v


class CVUploadRequest(BaseModel):
    """Request model for CV upload (Updater flow)"""
    job_description: str = Field(..., min_length=50, max_length=5000)
    
    @field_validator('job_description')
    @classmethod
    def validate_job_description(cls, v):
        if len(v.strip()) < 50:
            raise ValueError('Job description must be at least 50 characters')
        return v


class GeneratedCVResponse(BaseModel):
    """Response model for generated CV content"""
    personal_details: Dict[str, Any]
    professional_summary: str
    work_experience: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    skills: Dict[str, List[str]]
    cover_letter_body: str
    generation_metadata: Dict[str, Any]


class PDFResponse(BaseModel):
    """Response model for PDF generation"""
    cv_pdf_base64: str
    cover_letter_pdf_base64: str
    filename_cv: str
    filename_cover_letter: str
    generation_timestamp: datetime
    cv_data: Optional[Dict[str, Any]] = None  # Include parsed CV data for editing


class ErrorResponse(BaseModel):
    """Standard error response model"""
    error: str
    detail: Optional[str] = None
    timestamp: datetime
    request_id: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response model"""
    status: str
    service: str
    version: str
    timestamp: datetime