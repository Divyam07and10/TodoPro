import os
import shutil
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings
from app.utils.validators import validate_file_extension, validate_file_size

class FileService:
    """File service for handling file uploads and management."""
    
    def __init__(self):
        self.upload_dir = Path(settings.UPLOAD_DIR)  # e.g., static/avatars
        self.max_file_size = settings.MAX_FILE_SIZE
        self.allowed_extensions = settings.ALLOWED_EXTENSIONS
        
        # Ensure upload directory exists
        self.upload_dir.mkdir(parents=True, exist_ok=True)
    
    async def save_avatar(self, file: UploadFile, user_id: str) -> str:
        """Save user avatar and return the file path."""
        # Validate file
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No filename provided"
            )
        
        # Validate file extension
        if not validate_file_extension(file.filename, self.allowed_extensions):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {self.allowed_extensions}"
            )
        
        # Validate file size (seek to end, read size, then reset)
        try:
            current_pos = file.file.tell()
        except Exception:
            current_pos = 0
        try:
            file.file.seek(0, os.SEEK_END)
            size = file.file.tell()
            file.file.seek(current_pos)
        except Exception:
            size = 0
        if size and not validate_file_size(size, self.max_file_size):
            # 413: Payload Too Large
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Max size: {self.max_file_size // 1024 // 1024}MB"
            )
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        filename = f"avatar_{user_id}_{self._generate_unique_suffix()}{file_extension}"
        file_path = self.upload_dir / filename
        
        # Save file
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )
        
        # Return a relative path from the static mount, e.g., 'avatars/<filename>'
        return f"{self.upload_dir.name}/{filename}"
    
    def delete_avatar(self, avatar_path: str) -> bool:
        """Delete user avatar file."""
        try:
            # Extract filename from path
            filename = avatar_path.split("/")[-1]
            file_path = self.upload_dir / filename
            
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception:
            return False
    
    def get_avatar_url(self, avatar_path: str) -> str:
        """Get full avatar URL."""
        if not avatar_path:
            return ""
        
        if avatar_path.startswith("http"):
            return avatar_path
        
        # Ensure we always point under the configured upload dir
        return f"/static/{self.upload_dir.name}/{Path(avatar_path).name}"
    
    def _generate_unique_suffix(self) -> str:
        """Generate unique suffix for filenames."""
        import secrets
        return secrets.token_hex(8)
    
    def cleanup_orphaned_files(self) -> int:
        """Clean up orphaned files (files not referenced in database)."""
        # This would typically check against database records
        # For now, just return 0
        return 0
    
    def get_file_info(self, file_path: str) -> dict:
        """Get file information."""
        path = Path(file_path)
        if not path.exists():
            return {}
        
        stat = path.stat()
        return {
            "filename": path.name,
            "size": stat.st_size,
            "created": stat.st_ctime,
            "modified": stat.st_mtime,
            "extension": path.suffix
        }