from flask import current_app, request

from app.api import bp
from app.services.sms_service import process_sms_command
from app.utils.at_client import send_sms
from app.utils.rate_limit import rate_limit


def _handle_incoming_sms():
    payload = request.get_json() or request.form.to_dict() or {}
    sender = payload.get('from') or payload.get('sender') or payload.get('sender_phone')
    text = payload.get('text') or payload.get('message')

    if not text:
        return {'error': 'Missing SMS text'}, 400

    response = process_sms_command(text.strip(), sender)

    if sender and current_app.config.get('SMS_AUTO_REPLY', True):
        send_sms(sender, response)

    return {'message': response}


@bp.route('/sms', methods=['POST'])
@rate_limit(max_requests=30, window_seconds=60)
def sms_webhook():
    return _handle_incoming_sms()


@bp.route('/sms/callback', methods=['POST'])
@rate_limit(max_requests=30, window_seconds=60)
def sms_callback():
    """Africa's Talking inbound SMS callback."""
    return _handle_incoming_sms()
