"""Risk analysis and predictive alerts (Phase 3.7)."""
from datetime import datetime, timedelta

from app.models import Report, WaterSource

# Optional weather integration via Open-Meteo (no API key required)
OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast'


def _reports_last_days(days: int = 30) -> list[Report]:
    since = datetime.utcnow() - timedelta(days=days)
    return Report.query.filter(Report.timestamp >= since).all()


def analyze_source_risk() -> list[dict]:
    """Flag sources with elevated report frequency."""
    reports = _reports_last_days(30)
    counts: dict[str, int] = {}
    for report in reports:
        counts[report.source_id] = counts.get(report.source_id, 0) + 1

    risks = []
    for source_id, count in counts.items():
        if count < 2:
            continue
        source = WaterSource.query.get(source_id)
        if not source:
            continue
        level = 'high' if count >= 4 else 'medium'
        risks.append({
            'source_id': source_id,
            'source_name': source.name,
            'report_count_30d': count,
            'risk_level': level,
            'suggested_action': 'Schedule inspection' if level == 'medium' else 'Urgent dispatch',
        })
    return sorted(risks, key=lambda r: r['report_count_30d'], reverse=True)


def fetch_rainfall_forecast(latitude: float, longitude: float) -> dict | None:
    """Fetch 7-day precipitation sum from Open-Meteo (best-effort)."""
    try:
        import requests

        params = {
            'latitude': latitude,
            'longitude': longitude,
            'daily': 'precipitation_sum',
            'forecast_days': 7,
            'timezone': 'auto',
        }
        resp = requests.get(OPEN_METEO_URL, params=params, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        daily = data.get('daily', {})
        precip = daily.get('precipitation_sum', [])
        total = sum(precip) if precip else 0
        return {
            'latitude': latitude,
            'longitude': longitude,
            'precipitation_sum_7d_mm': round(total, 1),
            'drought_risk': total < 5.0,
        }
    except Exception:
        return None


def generate_alerts() -> list[dict]:
    """
    Build alert payloads for drought/contamination risk.
    Does not send SMS; callers use at_client.send_sms.
    """
    alerts = []
    for risk in analyze_source_risk():
        if risk['risk_level'] == 'high':
            alerts.append({
                'type': 'contamination_or_failure',
                'source_id': risk['source_id'],
                'message': (
                    f"⚠️ {risk['source_name']}: {risk['report_count_30d']} "
                    f"reports in 30 days. Check water safety."
                ),
            })

    # Sample drought check for first source with coordinates
    source = WaterSource.query.first()
    if source:
        forecast = fetch_rainfall_forecast(source.latitude, source.longitude)
        if forecast and forecast.get('drought_risk'):
            alerts.append({
                'type': 'drought',
                'source_id': source.id,
                'message': (
                    f"⚠️ Low rainfall forecast near {source.name}. "
                    "Conserve water and monitor sources."
                ),
            })
    return alerts
