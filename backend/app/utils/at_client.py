"""Africa's Talking outbound SMS client."""
import logging
import os

logger = logging.getLogger(__name__)


def send_sms(to: str, message: str) -> bool:
    """
    Send outbound SMS via Africa's Talking.
    Returns True on success; False if credentials missing or send fails.
    """
    username = os.getenv('AT_USERNAME')
    api_key = os.getenv('AT_API_KEY')

    if not username or not api_key or username.startswith('your_'):
        logger.info('SMS not sent (AT credentials not configured): %s', to[:4] + '***')
        return False

    try:
        import africastalking

        africastalking.initialize(username, api_key)
        sms = africastalking.SMS
        response = sms.send(message, [to])
        logger.info('Africa\'s Talking SMS response: %s', response)
        return True
    except Exception as exc:
        logger.exception('Failed to send SMS: %s', exc)
        return False
