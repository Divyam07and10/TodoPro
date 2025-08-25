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
            # Normalize allowed list for a clean message
            allowed_list = ", ".join([ext.strip() for ext in self.allowed_extensions.split(",")])
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed formats: {allowed_list}."
            )
        
        # We will enforce size during streaming copy to avoid unreliable seek/tell on temp files
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        filename = f"avatar_{user_id}_{self._generate_unique_suffix()}{file_extension}"
        file_path = self.upload_dir / filename
        
        # Ensure we start from beginning before saving to avoid partial writes
        try:
            file.file.seek(0)
        except Exception:
            pass

        # Save file with streaming size enforcement
        bytes_written = 0
        chunk_size = 1024 * 1024  # 1MB
        try:
            with open(file_path, "wb") as buffer:
                while True:
                    chunk = file.file.read(chunk_size)
                    if not chunk:
                        break
                    bytes_written += len(chunk)
                    if bytes_written > self.max_file_size:
                        # Abort and remove partial file
                        try:
                            buffer.close()
                        finally:
                            if file_path.exists():
                                file_path.unlink(missing_ok=True)
                        max_mb = max(1, self.max_file_size // (1024 * 1024))
                        raise HTTPException(
                            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail=f"Image must be {max_mb}MB or below."
                        )
                    buffer.write(chunk)
        except HTTPException:
            # Re-raise our intentional size error
            raise
        except Exception as e:
            # Cleanup on failure
            if file_path.exists():
                try:
                    file_path.unlink(missing_ok=True)
                except Exception:
                    pass
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