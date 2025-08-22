from fastapi import HTTPException, status, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from sqlalchemy.future import select
import uuid
from app.db.models.user import User
from app.core.security import create_access_token, create_refresh_token
from app.api.users.repository import UsersRepository

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def handle_google_login(self, user_info: dict):
        """Handle user login/registration after Google OAuth and generate tokens."""
        email = user_info.get("email")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Email not found in Google account"
            )

        user = await self.get_user_by_email(email)

        if not user:
            user = await self.create_user_from_google(user_info)
        
        access_token, refresh_token = await self.generate_and_set_tokens(user)

        return access_token, refresh_token

    async def refresh_access_token(self, request: Request, response: Response):
        """Refresh access token using the refresh token from cookies."""
        # Get refresh token from request state (set by refresh token guard)
        refresh_token = getattr(request.state, 'refresh_token', None)
        user_payload = getattr(request.state, 'user_payload', None)
        
        if not refresh_token or not user_payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Refresh token validation failed"
            )

        # Get user by ID from payload
        repo = UsersRepository(self.db)
        user = await repo.get_by_id(user_payload.get('sub'))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        # Verify the refresh token matches the stored token
        if not user.refreshToken or user.refreshToken != refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        # Generate new access token
        access_token = create_access_token(data={"sub": user.id})


        return {"access_token": access_token}

    async def logout(self, user_id: str, response: Response):
        """Logout user by clearing their refresh token."""
        repo = UsersRepository(self.db)
        user = await repo.get_by_id(user_id)
        if user:
            user.refreshToken = None
            await self.db.commit()
        # Delete cookie with same attributes used when setting it (see auth/router.py)
        response.delete_cookie(
            key="refresh_token",
            path="/",
            samesite="lax",
            secure=settings.ENVIRONMENT == "production",
        )
        return {"message": "Logged out successfully"}

    async def get_user_by_email(self, email: str) -> User | None:
        """Fetch a user by email."""
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalars().first()


    async def create_user_from_google(self, user_info: dict) -> User:
        """Create a new user from Google OAuth info."""
        new_user = User(
            id=str(uuid.uuid4()),
            email=user_info["email"],
            name=user_info.get("name", "Unnamed User"),
            avatar=user_info.get("picture"),
        )
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        return new_user

    async def generate_and_set_tokens(self, user: User):
        """Generate access and refresh tokens, and store the hashed refresh token."""
        access_token = create_access_token(data={"sub": user.id})
        refresh_token = create_refresh_token(data={"sub": user.id})

        user.refreshToken = refresh_token
        await self.db.commit()
        
        return access_token, refresh_token