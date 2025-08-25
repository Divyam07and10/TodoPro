from fastapi import APIRouter, Depends, Request, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
from app.db.session import get_db
from app.db.models.user import User
from app.core.security import get_current_user
from app.core.api_key_guard import verify_api_key
from app.api.todos.service import TodoService
from app.api.todos.schemas import TodoCreate, TodoUpdate, TodoResponse

router = APIRouter(prefix="/todos", tags=["Todos"], dependencies=[Depends(verify_api_key)])

@router.post("", response_model=TodoResponse, status_code=201)
async def create_todo(
    todo_model: TodoCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new todo."""
    service = TodoService(db)
    return await service.create(current_user.id, todo_model.model_dump())

@router.get("", response_model=List[TodoResponse])
async def get_all_todos(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    search: str | None = Query(None),
    priority: str | None = Query(None),
    status: str | None = Query(None),
    orderBy: str | None = Query(None),
    category: str | None = Query(None),
):
    """Get all user todos."""
    todo_service = TodoService(db)
    filters = {
        "search": search,
        "priority": priority,
        "status": status,
        "orderBy": orderBy,
        "category": category,
    }
    return await todo_service.find_all(current_user.id, filters)

@router.get("/{todo_id}", response_model=TodoResponse)
async def get_todo(
    todo_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific todo by id."""
    todo_service = TodoService(db)
    todo = await todo_service.find_one(current_user.id, todo_id)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo

@router.patch("/{todo_id}", response_model=TodoResponse)
async def update_todo(
    todo_id: str,
    todo_model: TodoUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a todo."""
    todo_service = TodoService(db)
    todo = await todo_service.update(current_user.id, todo_id, todo_model.model_dump(exclude_unset=True))
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo

@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a todo."""
    service = TodoService(db)
    success = await service.delete(current_user.id, todo_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    
    return {"message": "Todo deleted successfully"}