"""
API Blueprint Registration and Router Setup
"""
from flask import Blueprint

bp = Blueprint('api', __name__)


@bp.route('/', methods=['GET'])
def api_index():
    return {
        'service': 'Salone Water Watch API',
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
            '/api/ai/health',
            '/api/ai/ask',
            '/api/ai/stream',
            '/api/ai/context/well/<well_id>',
            '/api/ai/suggest-questions/<context>',
            '/api/ai/translate',
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
    ai_enhanced,
    users,
)
