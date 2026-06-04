import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Load environment from .env files if available
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')
load_dotenv(BASE_DIR.parent / '.env')


def make_sqlite_uri(uri: str) -> str:
    """Normalize relative SQLite URIs into an absolute path."""
    if uri.startswith('sqlite:///') and uri not in ('sqlite:///:memory:', 'sqlite://'):
        sqlite_path = uri.replace('sqlite:///', '', 1)
        path = Path(sqlite_path)
        if not path.is_absolute():
            return f"sqlite:///{(BASE_DIR / path).resolve().as_posix()}"
    return uri


class Config:
    """Base configuration"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)

    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')

    # Role-based login (Phase 3.9)
    ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')
    TECHNICIAN_USERNAME = os.getenv('TECHNICIAN_USERNAME', 'tech')
    TECHNICIAN_PASSWORD = os.getenv('TECHNICIAN_PASSWORD', 'tech123')
    COMMITTEE_USERNAME = os.getenv('COMMITTEE_USERNAME', 'committee')
    COMMITTEE_PASSWORD = os.getenv('COMMITTEE_PASSWORD', 'committee123')

    # SMS
    SMS_AUTO_REPLY = os.getenv('SMS_AUTO_REPLY', 'true').lower() == 'true'

    # Database
    SQLALCHEMY_DATABASE_URI = make_sqlite_uri(os.getenv(
        'DATABASE_URL',
        f"sqlite:///{(BASE_DIR / 'instance' / 'cleanflow.db').resolve().as_posix()}"
    ))


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False


class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = False
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SMS_AUTO_REPLY = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig,
}
