from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.user import User

class UsersRepository:
    """User repository for database operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, user_id: str) -> Optional[User]:
        result = await self.session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def update_user(self, user_id: str, update_values: dict) -> Optional[User]:
        user = await self.get_by_id(user_id)
        if not user:
            return None
        for k, v in update_values.items():
            setattr(user, k, v)
        await self.session.commit()
        await self.session.refresh(user)
        return user