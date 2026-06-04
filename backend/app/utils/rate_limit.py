"""Simple in-memory rate limiting for SMS webhooks."""
import time
from functools import wraps

from flask import jsonify, request

_buckets: dict[str, list[float]] = {}


def rate_limit(max_requests: int = 30, window_seconds: int = 60):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            key = request.remote_addr or 'unknown'
            now = time.time()
            hits = _buckets.get(key, [])
            hits = [t for t in hits if now - t < window_seconds]
            if len(hits) >= max_requests:
                return jsonify({'error': 'Rate limit exceeded. Try again later.'}), 429
            hits.append(now)
            _buckets[key] = hits
            return fn(*args, **kwargs)

        return wrapper

    return decorator
