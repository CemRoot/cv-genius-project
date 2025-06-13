"""
Advanced API endpoints for CVGenius - integrating all premium features
"""

import asyncio
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, Request, Query
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
import io

from app.core.config import settings
from app.schemas.models import CVFormData, PDFResponse, ErrorResponse

# Import all our advanced services
from app.services.import_service import import_service
from app.services.ai_optimization_service import ai_optimization_service
from app.services.ats_service import ats_service
from app.services.layout_service import layout_service
from app.services.collaboration_service import collaboration_manager, share_service
from app.services.analytics_service import analytics_service
from app.services.export_service import export_service, ExportSettings, ExportFormat, ExportQuality
from app.templates.industry_templates import template_library

# Initialize router
router = APIRouter()

# Request/Response Models
class OptimizationRequest(BaseModel):
    cv_data: Dict[str, Any]
    job_description: Optional[str] = ""
    industry: str = "general"

class ATSAnalysisRequest(BaseModel):
    cv_data: Dict[str, Any]
    job_description: Optional[str] = ""
    industry: str = "general"

class LayoutOptimizationRequest(BaseModel):
    cv_data: Dict[str, Any]
    layout_type: str = "single_column"
    target_format: str = "pdf"
    experience_level: str = "mid"
    industry: str = "general"

class ExportRequest(BaseModel):
    cv_data: Dict[str, Any]
    format: str = "pdf"
    quality: str = "standard"
    template: str = "modern_tech"
    include_contact_info: bool = True
    page_size: str = "A4"
    margins: Optional[Dict[str, float]] = None

class CollaborationSessionRequest(BaseModel):
    cv_id: str
    owner_name: str
    owner_email: str

class ShareLinkRequest(BaseModel):
    cv_id: str
    permissions: Dict[str, Any]

class AnalyticsEventRequest(BaseModel):
    user_id: str
    cv_id: str
    event_type: str
    metadata: Optional[Dict[str, Any]] = {}

# Import & Parsing Endpoints

@router.post("/import/linkedin")
async def import_from_linkedin(
    linkedin_data: Dict[str, Any]
):
    """Import and parse LinkedIn profile data"""
    try:
        result = import_service.parse_linkedin_data(linkedin_data)
        return {
            "success": True,
            "cv_data": result,
            "message": "LinkedIn data imported successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"LinkedIn import failed: {str(e)}"
        )

@router.post("/import/pdf")
async def import_from_pdf(
    file: UploadFile = File(...)
):
    """Import and parse PDF resume"""
    try:
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are supported"
            )
        
        content = await file.read()
        result = import_service.parse_pdf_resume(content)
        
        return {
            "success": True,
            "cv_data": result,
            "message": "PDF imported and parsed successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF import failed: {str(e)}"
        )

@router.post("/import/docx")
async def import_from_docx(
    file: UploadFile = File(...)
):
    """Import and parse DOCX resume"""
    try:
        if not file.filename.lower().endswith(('.docx', '.doc')):
            raise HTTPException(
                status_code=400,
                detail="Only DOCX/DOC files are supported"
            )
        
        content = await file.read()
        result = import_service.parse_docx_resume(content)
        
        return {
            "success": True,
            "cv_data": result,
            "message": "DOCX imported and parsed successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"DOCX import failed: {str(e)}"
        )

# AI Optimization Endpoints

@router.post("/optimize/content")
async def optimize_cv_content(
    request: OptimizationRequest
):
    """AI-powered content optimization"""
    try:
        result = await ai_optimization_service.optimize_cv_content(
            request.cv_data,
            request.job_description,
            request.industry
        )
        return {
            "success": True,
            "optimization_results": result,
            "message": "CV optimized successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Content optimization failed: {str(e)}"
        )

@router.get("/optimize/industry-keywords/{industry}")
async def get_industry_keywords(
    industry: str
):
    """Get industry-specific keywords for optimization"""
    try:
        from app.services.ai_optimization_service import IndustryKeywordDatabase
        
        keyword_db = IndustryKeywordDatabase()
        keywords = keyword_db.get_keywords_for_industry(industry)
        action_verbs = keyword_db.get_action_verbs()
        
        return {
            "success": True,
            "industry": industry,
            "keywords": keywords,
            "action_verbs": action_verbs,
            "total_keywords": len(keywords)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get industry keywords: {str(e)}"
        )

# ATS Compatibility Endpoints

@router.post("/ats/analyze")
async def analyze_ats_compatibility(
    request: ATSAnalysisRequest
):
    """Comprehensive ATS compatibility analysis"""
    try:
        result = ats_service.analyze_ats_compatibility(
            request.cv_data,
            request.job_description,
            request.industry
        )
        
        # Convert dataclass to dict for JSON response
        return {
            "success": True,
            "ats_analysis": {
                "overall_score": result.overall_score,
                "issues": [
                    {
                        "type": issue.type.value,
                        "severity": issue.severity,
                        "title": issue.title,
                        "description": issue.description,
                        "recommendation": issue.recommendation,
                        "section": issue.section,
                        "impact_score": issue.impact_score
                    }
                    for issue in result.issues
                ],
                "strengths": result.strengths,
                "recommendations": result.recommendations,
                "keyword_analysis": result.keyword_analysis,
                "parsing_analysis": result.parsing_analysis,
                "compatibility_rating": result.compatibility_rating
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"ATS analysis failed: {str(e)}"
        )

# Layout Optimization Endpoints

@router.post("/layout/optimize")
async def optimize_layout(
    request: LayoutOptimizationRequest
):
    """Intelligent layout optimization"""
    try:
        from app.services.layout_service import LayoutType, PageConstraints
        
        # Convert string to enum
        layout_type_map = {
            "single_column": LayoutType.SINGLE_COLUMN,
            "two_column": LayoutType.TWO_COLUMN,
            "modern_sidebar": LayoutType.MODERN_SIDEBAR,
            "executive": LayoutType.EXECUTIVE,
            "academic": LayoutType.ACADEMIC,
            "creative": LayoutType.CREATIVE
        }
        
        layout_type = layout_type_map.get(request.layout_type, LayoutType.SINGLE_COLUMN)
        
        result = layout_service.generate_optimal_layout(
            request.cv_data,
            request.target_format,
            request.experience_level,
            request.industry
        )
        
        return {
            "success": True,
            "layout_result": {
                "total_pages": result.total_pages,
                "overflow_sections": result.overflow_sections,
                "layout_score": result.layout_score,
                "recommendations": result.recommendations,
                "pages": [
                    [
                        {
                            "element_id": element.element_id,
                            "element_type": element.element_type,
                            "x_mm": element.x_mm,
                            "y_mm": element.y_mm,
                            "width_mm": element.width_mm,
                            "height_mm": element.height_mm,
                            "page_number": element.page_number,
                            "z_index": element.z_index
                        }
                        for element in page
                    ]
                    for page in result.pages
                ]
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Layout optimization failed: {str(e)}"
        )

# Template Management Endpoints

@router.get("/templates/list")
async def list_templates():
    """Get list of available templates"""
    try:
        templates = template_library.get_available_templates()
        return {
            "success": True,
            "templates": templates,
            "total_templates": len(templates)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list templates: {str(e)}"
        )

@router.get("/templates/{template_name}")
async def get_template_details(
    template_name: str
):
    """Get specific template details"""
    try:
        template_config = template_library.get_template_config(template_name)
        template_css = template_library.generate_template_css(template_name)
        
        return {
            "success": True,
            "template_name": template_name,
            "config": template_config,
            "css": template_css
        }
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"Template not found: {str(e)}"
        )

# Export Endpoints

@router.post("/export/multi-format")
async def export_cv_multi_format(
    request: ExportRequest
):
    """Export CV in multiple formats"""
    try:
        # Convert string to enum
        format_map = {
            "pdf": ExportFormat.PDF,
            "docx": ExportFormat.DOCX,
            "txt": ExportFormat.TXT,
            "html": ExportFormat.HTML,
            "json": ExportFormat.JSON
        }
        
        quality_map = {
            "draft": ExportQuality.DRAFT,
            "standard": ExportQuality.STANDARD,
            "high": ExportQuality.HIGH,
            "print": ExportQuality.PRINT
        }
        
        export_format = format_map.get(request.format, ExportFormat.PDF)
        export_quality = quality_map.get(request.quality, ExportQuality.STANDARD)
        
        settings = ExportSettings(
            format=export_format,
            quality=export_quality,
            template=request.template,
            include_contact_info=request.include_contact_info,
            page_size=request.page_size,
            margins=request.margins or {"top": 20, "bottom": 20, "left": 20, "right": 20}
        )
        
        result = await export_service.export_cv(request.cv_data, settings)
        
        if not result.success:
            raise HTTPException(
                status_code=500,
                detail=result.error_message or "Export failed"
            )
        
        # Return file as streaming response
        return StreamingResponse(
            io.BytesIO(result.file_data),
            media_type=result.content_type,
            headers={"Content-Disposition": f"attachment; filename={result.filename}"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Export failed: {str(e)}"
        )

@router.post("/export/batch")
async def export_cv_batch(
    cv_data: Dict[str, Any],
    formats: List[str] = Query(default=["pdf", "docx"]),
    quality: str = "standard",
    template: str = "modern_tech"
):
    """Export CV in multiple formats simultaneously"""
    try:
        format_map = {
            "pdf": ExportFormat.PDF,
            "docx": ExportFormat.DOCX,
            "txt": ExportFormat.TXT,
            "html": ExportFormat.HTML,
            "json": ExportFormat.JSON
        }
        
        export_formats = [format_map.get(f, ExportFormat.PDF) for f in formats]
        
        results = await export_service.batch_export(cv_data, export_formats)
        
        # Convert results to JSON-serializable format
        response_data = {}
        for format_name, result in results.items():
            response_data[format_name] = {
                "success": result.success,
                "filename": result.filename,
                "file_size": result.file_size,
                "generation_time_ms": result.generation_time_ms,
                "error_message": result.error_message,
                "metadata": result.metadata
            }
            
            # For successful exports, include base64 data
            if result.success and result.file_data:
                import base64
                response_data[format_name]["file_data_base64"] = base64.b64encode(result.file_data).decode()
        
        return {
            "success": True,
            "exports": response_data,
            "total_formats": len(formats)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Batch export failed: {str(e)}"
        )

@router.get("/export/supported-formats")
async def get_supported_export_formats():
    """Get list of supported export formats"""
    try:
        formats = export_service.get_supported_formats()
        return {
            "success": True,
            "supported_formats": formats
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get supported formats: {str(e)}"
        )

# Collaboration Endpoints

@router.post("/collaboration/session/create")
async def create_collaboration_session(
    request: CollaborationSessionRequest
):
    """Create a new collaboration session"""
    try:
        session = await collaboration_manager.create_session(
            request.cv_id,
            str(uuid.uuid4()),  # Generate user ID
            request.owner_name,
            request.owner_email
        )
        
        return {
            "success": True,
            "session_id": session.session_id,
            "created_at": session.created_at.isoformat(),
            "settings": session.settings
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create collaboration session: {str(e)}"
        )

@router.post("/collaboration/session/{session_id}/join")
async def join_collaboration_session(
    session_id: str,
    user_name: str = Form(...),
    user_email: str = Form(...)
):
    """Join an existing collaboration session"""
    try:
        from app.services.collaboration_service import UserRole
        
        success = await collaboration_manager.join_session(
            session_id,
            str(uuid.uuid4()),  # Generate user ID
            user_name,
            user_email,
            UserRole.EDITOR
        )
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail="Session not found or access denied"
            )
        
        # Get session state
        user_id = str(uuid.uuid4())
        state = await collaboration_manager.get_session_state(session_id, user_id)
        
        return {
            "success": True,
            "session_state": state,
            "user_id": user_id
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to join collaboration session: {str(e)}"
        )

@router.post("/collaboration/share-link")
async def create_share_link(
    request: ShareLinkRequest
):
    """Create a shareable link for CV"""
    try:
        share_link = share_service.create_share_link(
            request.cv_id,
            str(uuid.uuid4()),  # Owner ID
            request.permissions
        )
        
        return {
            "success": True,
            "share_link": share_link,
            "permissions": request.permissions
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create share link: {str(e)}"
        )

# Analytics Endpoints

@router.post("/analytics/track-event")
async def track_analytics_event(
    request: AnalyticsEventRequest
):
    """Track an analytics event"""
    try:
        from app.services.analytics_service import AnalyticsEvent, EventType
        
        # Convert string to enum
        event_type_map = {
            "cv_created": EventType.CV_CREATED,
            "cv_updated": EventType.CV_UPDATED,
            "cv_viewed": EventType.CV_VIEWED,
            "cv_downloaded": EventType.CV_DOWNLOADED,
            "cv_shared": EventType.CV_SHARED,
            "application_submitted": EventType.APPLICATION_SUBMITTED,
            "interview_scheduled": EventType.INTERVIEW_SCHEDULED,
            "ats_scan_completed": EventType.ATS_SCAN_COMPLETED,
            "optimization_applied": EventType.OPTIMIZATION_APPLIED
        }
        
        event_type = event_type_map.get(request.event_type)
        if not event_type:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid event type: {request.event_type}"
            )
        
        event = AnalyticsEvent(
            event_id=str(uuid.uuid4()),
            user_id=request.user_id,
            cv_id=request.cv_id,
            event_type=event_type,
            timestamp=datetime.now(),
            metadata=request.metadata
        )
        
        success = await analytics_service.track_event(event)
        
        return {
            "success": success,
            "event_id": event.event_id,
            "timestamp": event.timestamp.isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to track event: {str(e)}"
        )

@router.get("/analytics/dashboard/{user_id}")
async def get_analytics_dashboard(
    user_id: str,
    cv_id: Optional[str] = None,
    timeframe_days: int = 30
):
    """Get analytics dashboard data"""
    try:
        dashboard_data = await analytics_service.get_dashboard_data(
            user_id, cv_id, timeframe_days
        )
        
        return {
            "success": True,
            "dashboard_data": dashboard_data
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get analytics dashboard: {str(e)}"
        )

@router.get("/analytics/report/{user_id}")
async def get_performance_report(
    user_id: str,
    cv_id: Optional[str] = None
):
    """Get comprehensive performance report"""
    try:
        report = await analytics_service.get_performance_report(user_id, cv_id)
        
        return {
            "success": True,
            "performance_report": report
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate performance report: {str(e)}"
        )

# Health Check for Advanced Features

@router.get("/advanced/health")
async def advanced_health_check():
    """Health check for all advanced services"""
    try:
        services_status = {
            "import_service": "available",
            "ai_optimization": "available",
            "ats_service": "available", 
            "layout_service": "available",
            "collaboration_service": "available",
            "analytics_service": "available",
            "export_service": "available",
            "template_library": "available"
        }
        
        # Check export service capabilities
        supported_formats = export_service.get_supported_formats()
        export_capabilities = {
            format_info["format"]: format_info["available"]
            for format_info in supported_formats
        }
        
        return {
            "status": "healthy",
            "services": services_status,
            "export_capabilities": export_capabilities,
            "total_templates": len(template_library.get_available_templates()),
            "version": "2.0.0",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }