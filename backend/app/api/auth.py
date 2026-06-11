from flask import jsonify, request
from flask_jwt_extended import create_access_token

from app.api import bp
from app.utils.auth import authenticate_user


@bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'username and password required'}), 400

    user = authenticate_user(username, password)
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    role_name = user.role.name if user.role else 'user'
    token = create_access_token(
        identity=user.id,
        additional_claims={
            'role': role_name,
            'district_scope': user.district_scope
        }
    )
    return jsonify({'access_token': token, 'role': role_name}), 200
