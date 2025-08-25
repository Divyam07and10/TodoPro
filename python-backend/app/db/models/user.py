from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    """User model."""
    
    __tablename__ = "users"
    
    id: str = Column(String(36), primary_key=True, index=True)
    email: str = Column(String(255), unique=True, index=True, nullable=False)
    name: str = Column(String(255), nullable=False)
    avatar: str = Column(Text, nullable=True)
    bio: str = Column(Text, nullable=True)
    refreshToken: str = Column(Text, nullable=True)  # camelCase field
    
    # Timestamps (camelCase)
    createdAt: datetime = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    todos = relationship("Todo", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"