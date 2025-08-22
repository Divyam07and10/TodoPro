"""
Helpers for filesystem and generic utilities.
"""
from pathlib import Path
import re
from datetime import timedelta

from app.core.config import settings


def ensure_static_dirs() -> None:
    """Ensure the avatars upload directory exists (idempotent)."""
    avatars_dir = Path(settings.UPLOAD_DIR)  # e.g., static/avatars
    avatars_dir.mkdir(parents=True, exist_ok=True)


def parse_timedelta(time_str: str) -> timedelta:
    """
    Parse a time string like '30m', '7d', '1y' into a timedelta.
    Handles integer values for backward compatibility (treated as minutes).
    """
    if isinstance(time_str, int):
        return timedelta(minutes=time_str)

    if not isinstance(time_str, str):
        raise TypeError(f"Invalid type for time string: {type(time_str)}")

    match = re.match(r"(\d+)([mdy])", time_str.lower())
    if not match:
        raise ValueError(f"Invalid time string format: '{time_str}'. Use '10m', '7d', '1y'.")

    value, unit = match.groups()
    value = int(value)

    if unit == 'm':
        return timedelta(minutes=value)
    if unit == 'd':
        return timedelta(days=value)
    if unit == 'y':
        return timedelta(days=value * 365)  # approximate year

    # Should be unreachable due to regex
    raise ValueError(f"Invalid time unit: '{unit}'")