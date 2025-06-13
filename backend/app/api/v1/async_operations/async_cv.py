"""
Async CV generation endpoints
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.schemas.models import CVFormData, CVUploadRequest
from app.services.generator_service import cv_service
from app.services.background_tasks import task_manager, start_background_task

router = APIRouter(tags=["Async Operations"])

@router.post("/generate-from-form-async")
async def generate_cv_from_form_async(form_data: CVFormData):
    """
    Start CV generation from form data in background
    Returns task ID for polling status
    """
    try:
        # Start background task
        task_id = start_background_task(
            "cv_generation",
            cv_service,
            form_data=form_data
        )
        
        return {
            "task_id": task_id,
            "status": "processing",
            "message": "CV generation started. Use task_id to check progress.",
            "poll_url": f"/api/v1/async/task-status/{task_id}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start CV generation: {str(e)}")

@router.get("/task-status/{task_id}")
async def get_task_status(task_id: str):
    """
    Get task status and progress
    """
    try:
        status = task_manager.get_task_status(task_id)
        
        if "error" in status:
            raise HTTPException(status_code=404, detail=status["error"])
        
        # Return clean response
        response = {
            "task_id": task_id,
            "status": status["status"],
            "progress": status["progress"],
            "created_at": status["created_at"]
        }
        
        # Add result if completed
        if status["status"] == "completed" and "result" in status:
            response["result"] = status["result"]
        
        # Add error if failed
        if status["status"] == "failed" and "error" in status:
            response["error"] = status["error"]
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get task status: {str(e)}")

@router.delete("/task/{task_id}")
async def cancel_task(task_id: str):
    """
    Cancel a running task
    """
    try:
        status = task_manager.get_task_status(task_id)
        
        if "error" in status:
            raise HTTPException(status_code=404, detail="Task not found")
        
        if status["status"] in ["completed", "failed"]:
            raise HTTPException(status_code=400, detail="Task already finished")
        
        # Mark as cancelled
        task_manager.fail_task(task_id, "Cancelled by user")
        
        return {"message": "Task cancelled successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to cancel task: {str(e)}")

@router.get("/tasks")
async def list_tasks(limit: int = 10):
    """
    List recent tasks (for debugging)
    """
    try:
        # Get recent tasks
        tasks = list(task_manager.tasks.values())
        
        # Sort by creation time (newest first)
        tasks.sort(key=lambda x: x["created_at"], reverse=True)
        
        # Limit results
        tasks = tasks[:limit]
        
        # Clean up response (remove sensitive data)
        clean_tasks = []
        for task in tasks:
            clean_task = {
                "id": task["id"],
                "type": task["type"],
                "status": task["status"],
                "progress": task["progress"],
                "created_at": task["created_at"]
            }
            clean_tasks.append(clean_task)
        
        return {"tasks": clean_tasks}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list tasks: {str(e)}")