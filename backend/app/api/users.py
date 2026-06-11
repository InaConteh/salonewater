from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api import bp
from app import db
from app.models.user import User, Role
from app.models.audit_log import AuditLog
from app.utils.auth import ROLE_ADMIN, roles_required

@bp.route('/users', methods=['GET'])
@jwt_required()
@roles_required(ROLE_ADMIN)
def get_users():
    users = User.query.all()
    return jsonify({'users': [u.to_dict() for u in users]})

@bp.route('/users', methods=['POST'])
@jwt_required()
@roles_required(ROLE_ADMIN)
def create_user():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    role_name = data.get('role', 'committee')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return jsonify({'error': 'Invalid role'}), 400

    user = User(
        username=username,
        email=data.get('email'),
        role_id=role.id,
        district_scope=data.get('district_scope')
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201

@bp.route('/roles', methods=['GET'])
@jwt_required()
@roles_required(ROLE_ADMIN)
def get_roles():
    roles = Role.query.all()
    return jsonify({'roles': [{'id': r.id, 'name': r.name, 'permissions': r.permissions} for r in roles]})

@bp.route('/audit-logs', methods=['GET'])
@jwt_required()
@roles_required(ROLE_ADMIN)
def get_audit_logs():
    logs = AuditLog.query.order_by(AuditLog.timestamp.desc()).limit(100).all()
    return jsonify({'logs': [l.to_dict() for l in logs]})
