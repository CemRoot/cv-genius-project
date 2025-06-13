"""
Background task processing for CV generation
"""
import asyncio
from typing import Dict, Any
import uuid
from datetime import datetime, timedelta
import json
import redis

# Simple in-memory task storage (Redis alternative for development)
class TaskManager:
    def __init__(self):
        self.tasks = {}
        self.results = {}
    
    def create_task(self, task_id: str, task_type: str, data: Dict[str, Any]) -> str:
        """Create a new background task"""
        self.tasks[task_id] = {
            "id": task_id,
            "type": task_type,
            "status": "pending",
            "created_at": datetime.now(),
            "data": data,
            "progress": 0
        }
        return task_id
    
    def update_task_progress(self, task_id: str, progress: int, status: str = None):
        """Update task progress"""
        if task_id in self.tasks:
            self.tasks[task_id]["progress"] = progress
            if status:
                self.tasks[task_id]["status"] = status
            self.tasks[task_id]["updated_at"] = datetime.now()
    
    def complete_task(self, task_id: str, result: Any):
        """Mark task as completed with result"""
        if task_id in self.tasks:
            self.tasks[task_id]["status"] = "completed"
            self.tasks[task_id]["progress"] = 100
            self.tasks[task_id]["completed_at"] = datetime.now()
            self.results[task_id] = result
    
    def fail_task(self, task_id: str, error: str):
        """Mark task as failed"""
        if task_id in self.tasks:
            self.tasks[task_id]["status"] = "failed"
            self.tasks[task_id]["error"] = error
            self.tasks[task_id]["failed_at"] = datetime.now()
    
    def get_task_status(self, task_id: str) -> Dict[str, Any]:
        """Get task status and progress"""
        if task_id not in self.tasks:
            return {"error": "Task not found"}
        
        task = self.tasks[task_id].copy()
        
        # Add result if completed
        if task["status"] == "completed" and task_id in self.results:
            task["result"] = self.results[task_id]
        
        return task
    
    def cleanup_old_tasks(self, hours: int = 24):
        """Cleanup tasks older than specified hours"""
        cutoff = datetime.now() - timedelta(hours=hours)
        to_remove = []
        
        for task_id, task in self.tasks.items():
            if task["created_at"] < cutoff:
                to_remove.append(task_id)
        
        for task_id in to_remove:
            self.tasks.pop(task_id, None)
            self.results.pop(task_id, None)

# Global task manager instance
task_manager = TaskManager()

async def process_cv_generation_background(task_id: str, cv_service, form_data, job_description: str = None):
    """Process CV generation in background"""
    try:
        # Update progress: Starting
        task_manager.update_task_progress(task_id, 10, "processing")
        
        # Step 1: Form processing (if provided)
        if form_data:
            task_manager.update_task_progress(task_id, 30, "generating_cv")
            result = await cv_service.generate_from_form(form_data)
        else:
            task_manager.update_task_progress(task_id, 30, "updating_cv")
            # This would be for file upload case
            pass
        
        # Step 2: PDF generation
        task_manager.update_task_progress(task_id, 70, "generating_pdf")
        
        # Step 3: Finalization
        task_manager.update_task_progress(task_id, 90, "finalizing")
        
        # Complete task
        task_manager.complete_task(task_id, result.model_dump())
        
    except Exception as e:
        task_manager.fail_task(task_id, str(e))

def start_background_task(task_type: str, cv_service, **kwargs) -> str:
    """Start a background task and return task ID"""
    task_id = str(uuid.uuid4())
    
    # Create task
    task_manager.create_task(task_id, task_type, kwargs)
    
    # Start background processing
    if task_type == "cv_generation":
        asyncio.create_task(
            process_cv_generation_background(
                task_id, 
                cv_service, 
                kwargs.get("form_data"),
                kwargs.get("job_description")
            )
        )
    
    return task_id