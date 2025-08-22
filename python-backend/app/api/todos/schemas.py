from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class TodoCreate(BaseModel):
    """Schema for creating a new todo."""
    title: str = Field(min_length=1, max_length=255, description="Title is required")
    description: str = Field(min_length=1, description="Description is required")
    priority: str = Field(pattern="^(low|medium|high)$", description="Priority must be low, medium, or high")
    category: str = Field(pattern="^(work|personal|health|finance|education|other)$", description="Category must be work, personal, health, finance, education, or other")
    dueDate: date = Field(description="Due date is required")

class TodoUpdate(BaseModel):
    """Schema for updating a todo."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    dueDate: Optional[date] = None
    category: Optional[str] = None

class TodoResponse(BaseModel):
    """Schema for todo response."""
    id: str
    title: str
    description: str
    priority: str
    category: str
    dueDate: Optional[str] = None
    completed: bool
    createdAt: str
    updatedAt: str