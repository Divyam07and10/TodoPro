from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.utils.helpers import parse_timedelta
from app.db.session import get_db
from app.db.models.user import User
from app.core.security import get_current_user
from app.core.api_key_guard import verify_api_key
from app.core.refresh_token_guard import verify_refresh_token
from app.db.dependencies import get_auth_service
from app.api.auth.service import AuthService
from app.core.oauth import google_oauth

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/google")
async def google_auth():
    """Redirect to Google OAuth."""
    if not google_oauth:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth not configured"
        )
    
    auth_url = google_oauth.get_authorization_url()
    return RedirectResponse(auth_url)

@router.get("/google/callback")
async def google_auth_callback(code: str, request: Request, auth_service: AuthService = Depends(get_auth_service)):
    """Handle Google OAuth callback."""
    try:
        token_data = await google_oauth.exchange_code_for_tokens(code)
        user_info = await google_oauth.get_user_info(token_data['access_token'])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google authentication failed: {e}"
        )
    access_token, refresh_token = await auth_service.handle_google_login(user_info)
    
    redirect_url = f"http://localhost:3000/dashboard?access_token={access_token}"
    redirect_response = RedirectResponse(url=redirect_url)
    
    refresh_token_expires = parse_timedelta(settings.REFRESH_TOKEN_EXPIRE)
    redirect_response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        path="/",
        max_age=int(refresh_token_expires.total_seconds()),
        secure=settings.ENVIRONMENT == "production"  # Set secure in production
    )
    
    return redirect_response

@router.post("/refresh")
async def refresh_access_token(
    request: Request,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service),
    payload: dict = Depends(verify_refresh_token)
):
    """Refresh access token."""
    return await auth_service.refresh_access_token(request, response)

@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Logout user."""
    return await auth_service.logout(current_user.id, response)
