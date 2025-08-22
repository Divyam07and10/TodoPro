from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class UserResponse(BaseModel):
    """Schema for user profile response."""
    id: str
    email: str
    name: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    createdAt: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Name cannot be empty")
    bio: Optional[str] = Field(None, max_length=200, description="Bio cannot exceed 200 characters")
    avatar: Optional[str] = None