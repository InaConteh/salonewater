"""
API Blueprint Registration and Router Setup
"""
from flask import Blueprint

bp = Blueprint('api', __name__)


@bp.route('/', methods=['GET'])
def api_index():
    return {
        'service': 'CleanFlow SL API',
        'version': 'phase-3',
        'endpoints': [
            '/api/auth/login',
            '/api/sources',
            '/api/sources/nearby',
            '/api/sources?format=geojson',
            '/api/reports',
            '/api/report',
            '/api/maintenance',
            '/api/dispatch',
            '/api/dispatch/reminders',
            '/api/tips',
            '/api/sms',
            '/api/sms/callback',
            '/api/analytics/kpis',
            '/api/analytics/trends',
        ],
    }


from app.api import (
    analytics,
    auth,
    dispatch,
    maintenance,
    reports,
    sms_callback,
    sources,
    tips,
)

__all__ = ['bp']
