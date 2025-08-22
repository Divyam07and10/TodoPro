"""
Custom exception classes and handlers (single source of truth).
"""

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


# Custom exception classes
class ValidationException(HTTPException):
    """Custom validation exception."""

    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class NotFoundException(HTTPException):
    """Custom not found exception."""

    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class UnauthorizedException(HTTPException):
    """Custom unauthorized exception."""

    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


class ForbiddenException(HTTPException):
    """Custom forbidden exception."""

    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class ConflictException(HTTPException):
    """Custom conflict exception."""

    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors with custom messages."""
    errors = []
    for error in exc.errors():
        field = error["loc"][-1] if error["loc"] else "field"
        error_type = error["type"]
        
        # Custom error messages
        if error_type == "missing":
            if field == "title":
                message = "Title is required"
            elif field == "description":
                message = "Description is required"
            elif field == "priority":
                message = "Priority is required"
            elif field == "category":
                message = "Category is required"
            elif field == "dueDate":
                message = "Due date is required"
            else:
                message = f"{field} is required"
        elif error_type == "string_too_short":
            if field == "title":
                message = "Title cannot be empty"
            elif field == "description":
                message = "Description cannot be empty"
            else:
                message = f"{field} cannot be empty"
        elif error_type == "string_pattern_mismatch":
            if field == "priority":
                message = "Priority must be low, medium, or high"
            elif field == "category":
                message = "Category must be work, personal, health, finance, education, or other"
            else:
                message = f"Invalid {field} format"
        elif error_type == "date_parsing":
            message = "Invalid date format"
        else:
            message = error.get("msg", f"Invalid {field}")
            
        errors.append({
            "field": field,
            "message": message
        })
    
    return JSONResponse(
        status_code=400,
        content={
            "message": errors[0]["message"] if errors else "Validation failed",
            "detail": "Validation failed",
            "errors": errors
        }
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with consistent format."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": exc.detail,
            "detail": exc.detail
        }
    )