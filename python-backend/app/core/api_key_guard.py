from fastapi import HTTPException, Request, status
from app.core.config import settings

class APIKeyGuard:
    """API Key validation guard to prevent XSS attacks when tokens are stolen."""
    
    def __init__(self):
        self.api_key = settings.API_KEY
    
    async def __call__(self, request: Request) -> bool:
        """Validate X-API-Key header."""
        api_key = request.headers.get("x-api-key")
        
        if not api_key or api_key != self.api_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or missing API key"
            )
        
        return True

# Create global instance
api_key_guard = APIKeyGuard()

async def verify_api_key(request: Request) -> bool:
    """Dependency function for FastAPI route protection."""
    return await api_key_guard(request)