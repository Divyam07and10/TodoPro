import re
from typing import Optional

def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_username(username: str) -> bool:
    """Validate username format."""
    # Username should be 3-30 characters, alphanumeric and underscores only
    pattern = r'^[a-zA-Z0-9_]{3,30}$'
    return bool(re.match(pattern, username))

def validate_password_strength(password: str) -> tuple[bool, Optional[str]]:
    """Validate password strength and return (is_valid, error_message)."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one digit"
    
    return True, None

def sanitize_string(text: str) -> str:
    """Sanitize user input string."""
    # Remove potentially dangerous characters
    return re.sub(r'[<>"\']', '', text.strip())

def validate_priority(priority: str) -> bool:
    """Validate todo priority."""
    return priority in ["low", "medium", "high"]

def validate_file_extension(filename: str, allowed_extensions: str) -> bool:
    """Validate file extension."""
    if not filename:
        return False
    
    extension = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    allowed = [ext.strip().lower() for ext in allowed_extensions.split(',')]
    return extension in allowed

def validate_file_size(file_size: int, max_size: int) -> bool:
    """Validate file size."""
    return file_size <= max_size