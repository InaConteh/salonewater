"""Formatting, distance, and GeoJSON helpers."""
import math
from typing import Iterable

SMS_MAX_LENGTH = 160

STATUS_EMOJI = {
    'green': '🟢',
    'yellow': '🟡',
    'red': '🔴',
}


def status_emoji(status: str | None) -> str:
    return STATUS_EMOJI.get((status or '').lower(), '⚪')


def truncate_sms(message: str, max_len: int = SMS_MAX_LENGTH) -> str:
    message = (message or '').strip()
    if len(message) <= max_len:
        return message
    return message[: max_len - 3].rstrip() + '...'


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in kilometres."""
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlon / 2) ** 2
    return r * 2 * math.asin(math.sqrt(a))


def sources_to_geojson(sources: Iterable) -> dict:
    features = []
    for source in sources:
        features.append({
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [source.longitude, source.latitude],
            },
            'properties': source.to_dict(),
        })
    return {'type': 'FeatureCollection', 'features': features}
