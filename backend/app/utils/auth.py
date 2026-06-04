"""Role-based access helpers for JWT-protected routes."""
from functools import wraps

from flask import current_app, jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request

ROLE_ADMIN = 'admin'
ROLE_TECHNICIAN = 'technician'
ROLE_COMMITTEE = 'committee'

ROLE_CREDENTIALS = {
    ROLE_ADMIN: ('ADMIN_USERNAME', 'ADMIN_PASSWORD'),
    ROLE_TECHNICIAN: ('TECHNICIAN_USERNAME', 'TECHNICIAN_PASSWORD'),
    ROLE_COMMITTEE: ('COMMITTEE_USERNAME', 'COMMITTEE_PASSWORD'),
}


def authenticate_user(username: str, password: str) -> str | None:
    """Return role if credentials match env-configured users."""
    for role, (user_key, pass_key) in ROLE_CREDENTIALS.items():
        expected_user = current_app.config.get(user_key) or ''
        expected_pass = current_app.config.get(pass_key) or ''
        if expected_user and username == expected_user and password == expected_pass:
            return role
    return None


def roles_required(*allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get('role')
            if role not in allowed_roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator
