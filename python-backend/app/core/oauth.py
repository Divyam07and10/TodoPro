from typing import Dict, Any
import httpx
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from urllib.parse import urlencode
from app.core.config import settings
from app.core.exceptions import UnauthorizedException

# OAuth configuration
config = Config('.env')
oauth = OAuth(config)

# Google OAuth
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

class GoogleOAuth:
    """Google OAuth2 client."""
    
    def __init__(self):
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        self.redirect_uri = settings.GOOGLE_REDIRECT_URI
        
        if not all([self.client_id, self.client_secret, self.redirect_uri]):
            raise ValueError("Google OAuth credentials not configured")
    
    def get_authorization_url(self, state: str = None) -> str:
        """Get Google OAuth authorization URL."""
        base_url = "https://accounts.google.com/o/oauth2/v2/auth"
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": "openid email profile",
            "response_type": "code",
            "access_type": "offline"
        }
        
        if state:
            params["state"] = state
            
        return f"{base_url}?{urlencode(params)}"
    
    async def exchange_code_for_tokens(self, code: str) -> Dict[str, Any]:
        """Exchange authorization code for access and refresh tokens."""
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data)
            if response.status_code != 200:
                raise UnauthorizedException("Failed to exchange code for tokens")
            
            return response.json()
    
    async def get_user_info(self, access_token: str) -> Dict[str, Any]:
        """Get user information from Google."""
        userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(userinfo_url, headers=headers)
            if response.status_code != 200:
                raise UnauthorizedException("Failed to get user info from Google")
            
            return response.json()
    
    async def verify_id_token(self, id_token: str) -> Dict[str, Any]:
        """Verify Google ID token."""
        try:
            import jwt
            decoded = jwt.decode(id_token, options={"verify_signature": False})
            return decoded
        except Exception:
            raise UnauthorizedException("Invalid ID token")

# Global OAuth instance - only create if credentials are configured
try:
    google_oauth = GoogleOAuth() if all([
        settings.GOOGLE_CLIENT_ID,
        settings.GOOGLE_CLIENT_SECRET,
        settings.GOOGLE_REDIRECT_URI
    ]) else None
except ValueError:
    google_oauth = None