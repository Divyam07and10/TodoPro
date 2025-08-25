from fastapi import APIRouter, Depends, Request, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.db.session import get_db
from app.db.models.user import User
from app.core.security import get_current_user
from app.core.api_key_guard import verify_api_key
from app.api.users.service import UserService
from app.api.users.schemas import UserResponse

router = APIRouter(prefix="/user", tags=["User"], dependencies=[Depends(verify_api_key)])

@router.get("/me", response_model=UserResponse)
async def get_profile(request: Request, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get user profile with fully constructed avatar URL."""
    user_service = UserService(db)
    return await user_service.get_me(current_user.id, request)

@router.patch("/me", response_model=UserResponse)
async def update_profile(
    request: Request,
    name: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    avatar: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_service = UserService(db)
    
    # Handle the avatar field from form data to detect if the user
    # wants to remove their avatar (by sending an empty string).
    form_data = await request.form()
    avatar_field = form_data.get("avatar")
    
    # Build a dictionary to hold the update values.
    model_data = {"name": name, "bio": bio}
    if avatar_field == "":
        model_data["avatar"] = ""  # Signal to the service to remove the avatar.
    
    # Call the service method to handle the business logic.
    return await user_service.update_me(current_user.id, model_data, avatar, request)