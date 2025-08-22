from typing import Optional, List
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.user import User

class AuthRepository:
    """Authentication repository for database operations."""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        result = await self.session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        result = await self.session.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_google_id(self, google_id: str) -> Optional[User]:
        """Get user by Google ID."""
        result = await self.session.execute(
            select(User).where(User.google_id == google_id)
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        result = await self.session.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def email_exists(self, email: str) -> bool:
        """Check if email already exists."""
        result = await self.session.execute(
            select(User.id).where(User.email == email)
        )
        return result.scalar_one_or_none() is not None
    
    async def username_exists(self, username: str) -> bool:
        """Check if username already exists."""
        result = await self.session.execute(
            select(User.id).where(User.username == username)
        )
        return result.scalar_one_or_none() is not None
    
    async def get_valid_refresh_token(self, token: str) -> Optional[RefreshToken]:
        """Get valid refresh token."""
        from datetime import datetime
        result = await self.session.execute(
            select(RefreshToken).where(
                and_(
                    RefreshToken.token == token,
                    RefreshToken.expires_at > datetime.utcnow(),
                    RefreshToken.is_revoked == "false"
                )
            )
        )
        return result.scalar_one_or_none()
    
    async def get_user_refresh_tokens(self, user_id: str) -> List[RefreshToken]:
        """Get all refresh tokens for a user."""
        result = await self.session.execute(
            select(RefreshToken).where(RefreshToken.user_id == user_id)
        )
        return result.scalars().all()
    
    async def revoke_refresh_token(self, token: str) -> bool:
        """Revoke a refresh token."""
        db_token = await self.get_valid_refresh_token(token)
        if db_token:
            db_token.is_revoked = "true"
            await self.session.commit()
            return True
        return False
    
    async def revoke_all_user_tokens(self, user_id: str) -> int:
        """Revoke all refresh tokens for a user."""
        tokens = await self.get_user_refresh_tokens(user_id)
        revoked_count = 0
        
        for token in tokens:
            token.is_revoked = "true"
            revoked_count += 1
        
        await self.session.commit()
        return revoked_count
    
    async def cleanup_expired_tokens(self) -> int:
        """Remove expired refresh tokens."""
        from datetime import datetime
        result = await self.session.execute(
            select(RefreshToken).where(RefreshToken.expires_at < datetime.utcnow())
        )
        expired_tokens = result.scalars().all()
        
        deleted_count = 0
        for token in expired_tokens:
            await self.session.delete(token)
            deleted_count += 1
        
        await self.session.commit()
        return deleted_count
