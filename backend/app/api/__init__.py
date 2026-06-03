"""
API Blueprint Registration and Router Setup
"""
from flask import Blueprint

bp = Blueprint('api', __name__)

# Import routes to register them with the blueprint
from app.api import sources, reports, sms_callback, tips, dispatch

__all__ = ['bp']
