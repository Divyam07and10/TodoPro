from typing import Optional
from pydantic import BaseModel

class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class RefreshTokenRequest(BaseModel):
    """Refresh token request schema."""
    refresh_token: str

class GoogleAuthRequest(BaseModel):
    """Google OAuth request schema."""
    code: str
    state: Optional[str] = None

class LogoutRequest(BaseModel):
    """Logout request schema."""
    refresh_token: str