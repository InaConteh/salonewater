from datetime import datetime
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(50), unique=True, nullable=False)
    permissions = db.Column(db.Text, nullable=True) # JSON string of permissions

    users = db.relationship('User', back_populates='role')

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    role_id = db.Column(db.String(36), db.ForeignKey('roles.id'), nullable=False)
    district_scope = db.Column(db.String(100), nullable=True) # For multi-district scoping
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    role = db.relationship('Role', back_populates='users')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role.name if self.role else None,
            'district_scope': self.district_scope,
            'is_active': self.is_active,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
