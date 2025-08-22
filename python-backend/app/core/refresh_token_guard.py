from fastapi import HTTPException, Request, status
from typing import Optional
from app.core.security import verify_token
from app.core.config import settings

class RefreshTokenGuard:
    """Refresh token validation guard."""
    
    async def __call__(self, request: Request) -> dict:
        """Validate refresh token from cookies."""
        refresh_token = request.cookies.get("refresh_token")
        
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token not found"
            )
        
        payload = verify_token(refresh_token, "refresh")
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Add the payload and token to request for use in endpoints
        request.state.user_payload = payload
        request.state.refresh_token = refresh_token
        
        return payload

# Create global instance
refresh_token_guard = RefreshTokenGuard()

async def verify_refresh_token(request: Request) -> dict:
    """Dependency function for FastAPI route protection."""
    return await refresh_token_guard(request)