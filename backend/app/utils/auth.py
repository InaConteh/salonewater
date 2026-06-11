"""Role-based access helpers for JWT-protected routes."""
from functools import wraps

from flask import current_app, jsonify, request
from flask_jwt_extended import get_jwt, verify_jwt_in_request, get_jwt_identity
from app.models.user import User
from app.models.audit_log import AuditLog
from app import db

ROLE_ADMIN = 'admin'
ROLE_TECHNICIAN = 'technician'
ROLE_COMMITTEE = 'committee'


def authenticate_user(username: str, password: str) -> User | None:
    """Return User object if credentials match database records."""
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password) and user.is_active:
        return user
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


def audit_log(action, resource_type):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            response = fn(*args, **kwargs)

            # Only log successful or created responses (2xx)
            if 200 <= response[1] < 300 if isinstance(response, tuple) else True:
                user_id = get_jwt_identity()
                resource_id = kwargs.get('source_id') or kwargs.get('report_id') or \
                    kwargs.get('case_id') or kwargs.get('log_id') or kwargs.get('user_id')

                # Try to extract resource_id from response if not in kwargs
                if not resource_id and isinstance(response, tuple) and isinstance(response[0], dict):
                    resource_id = response[0].get('id')

                log = AuditLog(
                    user_id=user_id,
                    action=action,
                    resource_type=resource_type,
                    resource_id=str(resource_id) if resource_id else None,
                    ip_address=request.remote_addr,
                    details=f"Method: {request.method}, Path: {request.path}"
                )
                db.session.add(log)
                db.session.commit()

            return response

        return wrapper

    return decorator
