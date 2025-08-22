from datetime import datetime, date, time
import uuid
from typing import Optional, Dict, Any, List
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, or_
from sqlalchemy.exc import IntegrityError
from app.db.models.todo import Todo

class TodoService:
    """Todo service."""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create(self, user_id: str, model_data: dict) -> dict:
        """Create a new todo."""
        # Parse dueDate if provided
        due_date = None
        if model_data.get("dueDate"):
            try:
                # Handle different date formats
                date_value = model_data["dueDate"]
                if isinstance(date_value, str):
                    if "T" in date_value or "Z" in date_value:
                        due_date = datetime.fromisoformat(date_value.replace("Z", "+00:00"))
                    else:
                        # Handle date-only strings like "2024-08-20"
                        # Parse as date and set to start of day WITHOUT timezone
                        parsed_date = date.fromisoformat(date_value)
                        due_date = datetime.combine(parsed_date, time.min)
                        # Store as naive datetime to avoid timezone issues
                elif hasattr(date_value, 'isoformat'):
                    # Handle date objects
                    due_date = datetime.combine(date_value, time.min)
                else:
                    due_date = datetime.fromisoformat(str(date_value))
                
                # Validate due date is not before today (day-level comparison)
                if due_date.date() < date.today():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Due date must be today or a future date"
                    )
            except (ValueError, TypeError) as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid date format"
                )
        
        todo = Todo(
            id=str(uuid.uuid4()),
            userId=user_id,
            title=model_data["title"],
            description=model_data.get("description", ""),
            priority=model_data.get("priority", "medium"),
            category=model_data.get("category", "personal"),
            dueDate=due_date,
            completed=False
        )
        
        self.session.add(todo)
        try:
            await self.session.commit()
        except IntegrityError as e:
            await self.session.rollback()
            # Check if the error is due to a unique constraint violation
            if "unique_title_per_user" in str(e.orig).lower():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A todo with this title already exists."
                )
            # Re-raise for other integrity errors
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred."
            )
        await self.session.refresh(todo)
        
        return {
            "id": todo.id,
            "title": todo.title,
            "description": todo.description,
            "priority": todo.priority,
            "category": todo.category,
            "dueDate": todo.dueDate.isoformat() if todo.dueDate else None,
            "completed": todo.completed,
            "createdAt": todo.createdAt.isoformat(),
            "updatedAt": todo.updatedAt.isoformat()
        }
    
    async def find_all(self, user_id: str, filters: Dict[str, Any]) -> List[dict]:
        """Find all todos for a user with optional filters."""
        query = select(Todo).where(Todo.userId == user_id)
        
        # Apply filters
        status_value = filters.get("status")
        if status_value in ("completed", "pending", "overdue"):
            if status_value == "completed":
                query = query.where(Todo.completed == True)
            elif status_value == "pending":
                # dueDate >= today and not completed
                today_midnight = datetime.combine(date.today(), time.min)
                query = query.where((Todo.completed == False) & ((Todo.dueDate == None) | (Todo.dueDate >= today_midnight)))
            elif status_value == "overdue":
                # dueDate < today and not completed
                today_midnight = datetime.combine(date.today(), time.min)
                query = query.where((Todo.completed == False) & (Todo.dueDate != None) & (Todo.dueDate < today_midnight))

        if filters.get("priority") and filters["priority"] != "all":
            query = query.where(Todo.priority == filters["priority"])
        
        if filters.get("category") and filters["category"] != "all":
            query = query.where(Todo.category == filters["category"])
        
        if filters.get("search"):
            search_term = f"%{filters['search']}%"
            query = query.where(
                or_(
                    Todo.title.ilike(search_term),
                    Todo.description.ilike(search_term)
                )
            )
        
        # Order by
        order_by = filters.get("orderBy")
        if order_by == "date-oldest":
            query = query.order_by(Todo.createdAt.asc())
        else:
            query = query.order_by(Todo.createdAt.desc())
        
        result = await self.session.execute(query)
        todos = result.scalars().all()
        
        return [
            {
                "id": todo.id,
                "title": todo.title,
                "description": todo.description,
                "priority": todo.priority,
                "category": todo.category,
                "dueDate": todo.dueDate.isoformat() if todo.dueDate else None,
                "completed": todo.completed,
                "createdAt": todo.createdAt.isoformat(),
                "updatedAt": todo.updatedAt.isoformat()
            }
            for todo in todos
        ]
    
    async def find_one(self, user_id: str, todo_id: str) -> Optional[dict]:
        """Find a specific todo by ID."""
        stmt = select(Todo).where(
            and_(Todo.id == todo_id, Todo.userId == user_id)
        )
        result = await self.session.execute(stmt)
        todo = result.scalar_one_or_none()
        
        if not todo:
            return None
            
        return {
            "id": todo.id,
            "title": todo.title,
            "description": todo.description,
            "priority": todo.priority,
            "category": todo.category,
            "dueDate": todo.dueDate.isoformat() if todo.dueDate else None,
            "completed": todo.completed,
            "createdAt": todo.createdAt.isoformat(),
            "updatedAt": todo.updatedAt.isoformat()
        }
    
    async def update(self, user_id: str, todo_id: str, model_data: dict) -> Optional[dict]:
        """Update a todo."""
        stmt = select(Todo).where(
            and_(Todo.id == todo_id, Todo.userId == user_id)
        )
        result = await self.session.execute(stmt)
        todo = result.scalar_one_or_none()
        
        if not todo:
            return None
        
        # Update fields
        if "title" in model_data:
            todo.title = model_data["title"]
        if "description" in model_data:
            todo.description = model_data["description"]
        if "priority" in model_data:
            todo.priority = model_data["priority"]
        if "category" in model_data:
            todo.category = model_data["category"]
        if "completed" in model_data:
            todo.completed = model_data["completed"]
        if "dueDate" in model_data:
            if model_data["dueDate"]:
                try:
                    value = model_data["dueDate"]
                    if isinstance(value, date) and not isinstance(value, datetime):
                        new_due_date = datetime.combine(value, time.min)
                    elif isinstance(value, str):
                        if "T" in value or "Z" in value:
                            new_due_date = datetime.fromisoformat(value.replace("Z", "+00:00"))
                        else:
                            # Handle date-only strings like "2024-08-20"
                            # Parse as date and set to start of day WITHOUT timezone
                            parsed_date = date.fromisoformat(value)
                            new_due_date = datetime.combine(parsed_date, time.min)
                            # Store as naive datetime to avoid timezone issues
                    else:
                        new_due_date = datetime.fromisoformat(str(value))
                    # Validate due date is not before creation date like backend
                    created_date = todo.createdAt.date()
                    new_due_date_only = new_due_date.date()
                    
                    if new_due_date_only < created_date:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Due date must be same or after todo creation date."
                        )
                    
                    todo.dueDate = new_due_date
                except (ValueError, TypeError) as e:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Invalid date format"
                    )
            else:
                todo.dueDate = None
        
        todo.updatedAt = datetime.utcnow()
        try:
            await self.session.commit()
        except IntegrityError as e:
            await self.session.rollback()
            if "unique_title_per_user" in str(e.orig).lower():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Another todo with this title already exists."
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred."
            )
        await self.session.refresh(todo)
        
        return {
            "id": todo.id,
            "title": todo.title,
            "description": todo.description,
            "priority": todo.priority,
            "category": todo.category,
            "dueDate": todo.dueDate.isoformat() if todo.dueDate else None,
            "completed": todo.completed,
            "createdAt": todo.createdAt.isoformat(),
            "updatedAt": todo.updatedAt.isoformat()
        }
    
    async def delete(self, user_id: str, todo_id: str) -> bool:
        """Delete a todo."""
        stmt = select(Todo).where(
            and_(Todo.id == todo_id, Todo.userId == user_id)
        )
        result = await self.session.execute(stmt)
        todo = result.scalar_one_or_none()
        
        if not todo:
            return False
        
        await self.session.delete(todo)
        await self.session.commit()
        
        return True