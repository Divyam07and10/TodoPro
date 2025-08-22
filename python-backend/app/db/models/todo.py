from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Todo(Base):
    """Todo model."""
    
    __tablename__ = "todos"
    
    id: str = Column(String(36), primary_key=True, index=True)
    title: str = Column(String(255), nullable=False)  # Remove global unique constraint
    description: str = Column(Text, nullable=False, default="")
    completed: bool = Column(Boolean, default=False, nullable=False)
    priority: str = Column(String(20), nullable=False)  # enum: high, medium, low
    category: str = Column(String(20), nullable=False)  # enum: work, personal, health, finance, education, other
    dueDate: DateTime = Column(DateTime(timezone=False), nullable=True)  # Optional; stored as naive datetime
    
    # Foreign Keys
    userId: str = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)  # camelCase field
    
    # Timestamps
    createdAt: datetime = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)  # camelCase
    updatedAt: datetime = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)  # camelCase
    
    # Relationships
    user = relationship("User", back_populates="todos")
    
    # Composite unique constraint
    __table_args__ = (
        UniqueConstraint('title', 'userId', name='unique_title_per_user'),
    )
    
    def __repr__(self) -> str:
        return f"<Todo(id={self.id}, title={self.title}, userId={self.userId})>"