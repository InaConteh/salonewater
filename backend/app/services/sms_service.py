"""SMS command parsing and formatted responses (PRD Section 3.2)."""
import random
from datetime import datetime

from app.models import WaterSource
from app.services.report_service import create_report
from app.utils.helpers import haversine_km, status_emoji, truncate_sms
from app.utils.validators import normalize_cause

TIPS = [
    'Boil or filter water before drinking.',
    'Wash hands with soap before eating.',
    'Report broken pumps or dirty water fast.',
    'Store water in clean covered containers.',
    'Check pump seals during dry season.',
]

HELP_TEXT = 'CMD: STATUS [ID] | CAUSE [ID] [1-6] | NEARBY [area] | TIPS'


def _find_source(source_id: str) -> WaterSource | None:
    return WaterSource.query.get(source_id)


def _format_status(source: WaterSource | None) -> str:
    if not source:
        return truncate_sms('Source not found. Check ID and try STATUS [ID].')

    emoji = status_emoji(source.status)
    cause = (source.root_cause or 'none').replace('_', ' ')[:20]
    updated = source.last_updated.strftime('%Y-%m-%d') if source.last_updated else '?'
    msg = f"{emoji} {source.name}: {source.status.upper()}. Cause: {cause}. Updated {updated}."
    return truncate_sms(msg)


def _handle_cause(source_id: str, cause_raw: str, phone: str | None, notes: str | None) -> str:
    normalized = normalize_cause(cause_raw)
    if not normalized:
        return truncate_sms('Invalid cause. Use codes 1-6: drought,pump,well,contam,overuse,season.')

    report, err = create_report(source_id, cause_raw, phone, notes)
    if err:
        return truncate_sms(err)

    source = _find_source(source_id)
    emoji = status_emoji(source.status if source else 'yellow')
    return truncate_sms(f"{emoji} Report saved for {source.name if source else source_id}. Thank you!")


def _handle_nearby(area: str) -> str:
    results = (
        WaterSource.query.filter(
            WaterSource.district.ilike(f'%{area}%'),
            WaterSource.status == 'green',
        )
        .limit(3)
        .all()
    )
    if not results:
        return truncate_sms(f'No safe (green) sources in {area}. Try another area.')

    parts = [f"{status_emoji('green')} {s.name}" for s in results]
    return truncate_sms('Nearby safe: ' + ', '.join(parts))


def _handle_nearby_coords(lat: float, lon: float, limit: int = 3) -> str:
    sources = WaterSource.query.filter(WaterSource.status == 'green').all()
    ranked = sorted(
        sources,
        key=lambda s: haversine_km(lat, lon, s.latitude, s.longitude),
    )[:limit]
    if not ranked:
        return truncate_sms('No safe sources found nearby.')
    parts = []
    for s in ranked:
        dist = haversine_km(lat, lon, s.latitude, s.longitude)
        parts.append(f"{s.name} ({dist:.1f}km)")
    return truncate_sms('Nearby safe: ' + ', '.join(parts))


def process_sms_command(text: str, sender: str | None) -> str:
    if not text or not text.strip():
        return truncate_sms(HELP_TEXT)

    parts = text.strip().split()
    command = parts[0].upper()

    if command == 'STATUS' and len(parts) >= 2:
        return _format_status(_find_source(parts[1]))

    if command == 'CAUSE' and len(parts) >= 3:
        notes = ' '.join(parts[3:]) if len(parts) > 3 else None
        return _handle_cause(parts[1], parts[2], sender, notes)

    if command == 'NEARBY' and len(parts) >= 2:
        # NEARBY lat lon  OR  NEARBY DistrictName
        try:
            lat, lon = float(parts[1]), float(parts[2])
            return _handle_nearby_coords(lat, lon)
        except (ValueError, IndexError):
            return _handle_nearby(' '.join(parts[1:]))

    if command == 'TIPS':
        return truncate_sms(f"💡 {random.choice(TIPS)}")

    return truncate_sms(HELP_TEXT)
