from datetime import datetime
from typing import List, Optional
from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.todo import Todo

class TodosRepository:
    """Todo repository for database operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, values: dict) -> Todo:
        todo = Todo(**values)
        self.session.add(todo)
        await self.session.commit()
        await self.session.refresh(todo)
        return todo

    async def find_all(self, user_id: str, filters: dict) -> List[Todo]:
        stmt = select(Todo).where(Todo.user_id == user_id)
        if (v := filters.get("is_completed")) is not None:
            stmt = stmt.where(Todo.is_completed == v)
        if (v := filters.get("priority")):
            stmt = stmt.where(Todo.priority == v)
        if (v := filters.get("category")):
            stmt = stmt.where(Todo.category == v)
        if (v := filters.get("search")):
            like = f"%{v}%"
            stmt = stmt.where(or_(Todo.title.ilike(like), Todo.description.ilike(like)))
        result = await self.session.execute(stmt.order_by(Todo.created_at.desc()))
        return result.scalars().all()

    async def find_one(self, user_id: str, todo_id: str) -> Optional[Todo]:
        result = await self.session.execute(
            select(Todo).where(and_(Todo.id == todo_id, Todo.user_id == user_id))
        )
        return result.scalar_one_or_none()

    async def update(self, user_id: str, todo_id: str, values: dict) -> Optional[Todo]:
        todo = await self.find_one(user_id, todo_id)
        if not todo:
            return None
        for k, v in values.items():
            setattr(todo, k, v)
        await self.session.commit()
        await self.session.refresh(todo)
        return todo

    async def delete(self, user_id: str, todo_id: str) -> bool:
        todo = await self.find_one(user_id, todo_id)
        if not todo:
            return False
        await self.session.delete(todo)
        await self.session.commit()
        return True