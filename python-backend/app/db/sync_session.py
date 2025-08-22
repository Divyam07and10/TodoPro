from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# Use the sync URL for Alembic
SYNC_DATABASE_URL = settings.DATABASE_SYNC_URL

# Create sync engine and session factory
engine = create_engine(SYNC_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=Session)

def get_sync_db():
    """Yield a synchronous DB session (for scripts/CLI if ever needed)."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()