from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.api.users.schemas import UserResponse

class UserLogin(BaseModel):
    """User login request schema."""
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    """User registration request schema."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: Optional[str] = Field(None, max_length=255)
    password: str = Field(..., min_length=8)

class UserLoginResponse(BaseModel):
    """User login response schema."""
    user: UserResponse
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

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

class PasswordResetRequest(BaseModel):
    """Password reset request schema."""
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    """Password reset confirmation schema."""
    token: str
    new_password: str = Field(..., min_length=8)

class ChangePasswordRequest(BaseModel):
    """Change password request schema."""
    current_password: str
    new_password: str = Field(..., min_length=8)