from fastapi import HTTPException, status, Request, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import os
from app.db.models.user import User
from app.api.users.schemas import UserResponse
from app.api.users.repository import UsersRepository
from app.services.file_service import FileService

class UserService:
    """User service."""
    
    def __init__(self, session: AsyncSession):
        """Initializes the service with a database session and a repository."""
        self.session = session
        self.repository = UsersRepository(session)
        self.files = FileService()
    
    def _construct_avatar_url(self, user_avatar: Optional[str], request: Request) -> Optional[str]:
        """
        A helper function to safely construct the full avatar URL.
        """
        if not user_avatar:
            # Fallback: let frontend render placeholder; return null
            return None
        
        # If already a full URL (we now store full URLs), return as-is
        if user_avatar.startswith("http://") or user_avatar.startswith("https://"):
            return user_avatar

        # If a relative path slipped in, attempt to construct a URL if file exists
        local_path = f"static/{user_avatar}"
        if not os.path.exists(local_path):
            return None
        return str(request.url_for("static", path=user_avatar))

    def _convert_to_user_response(self, user: User, request: Request) -> UserResponse:
        return {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "avatar": self._construct_avatar_url(user.avatar, request),
            "bio": user.bio,
            "createdAt": user.createdAt.isoformat()
        }
    
    async def update_me(
        self, 
        user_id: str, 
        model_data: dict, 
        avatar: Optional[UploadFile], 
        request: Request
    ) -> UserResponse:
        """Update user profile."""
        user = await self._get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        try:
            # Update name if provided
            if model_data.get("name") is not None:
                user.name = model_data["name"]
            
            # Update bio if provided
            if model_data.get("bio") is not None:
                user.bio = model_data["bio"]

            # Handle explicit avatar removal from form (avatar="")
            if model_data.get("avatar") == "":
                if user.avatar:
                    # Delete by filename regardless of stored format (URL or relative)
                    self.files.delete_avatar(user.avatar)
                user.avatar = None

            if avatar:
                # Delete old avatar if exists (works for full URL or relative path)
                if user.avatar:
                    self.files.delete_avatar(user.avatar)

                # Save new avatar (returns relative path like 'avatars/<filename>')
                saved_rel_path = await self.files.save_avatar(avatar, user.id)
                # Convert to full static URL and store in DB
                user.avatar = str(request.url_for("static", path=saved_rel_path))

            await self.session.commit()
            await self.session.refresh(user)
            
            return self._convert_to_user_response(user, request)
        except HTTPException as he:
            # Propagate known client errors (e.g., 400 invalid type, 413 too large)
            await self.session.rollback()
            raise he
        except Exception as e:
            await self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )

    async def _get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        from sqlalchemy import select
        result = await self.session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_me(self, user_id: str, request: Request) -> UserResponse:
        """Get user profile."""
        user = await self._get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return self._convert_to_user_response(user, request)