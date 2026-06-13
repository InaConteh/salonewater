"""Risk analysis and predictive alerts (Phase 3.7)."""
from datetime import datetime, timedelta

from app.models import Report, WaterSource

# Optional weather integration via Open-Meteo (no API key required)
OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast'


def _reports_last_days(days: int = 30) -> list[Report]:
    since = datetime.utcnow() - timedelta(days=days)
    return Report.query.filter(Report.timestamp >= since).all()


def analyze_source_risk() -> list[dict]:
    """Flag sources with elevated report frequency or critical status."""
    reports = _reports_last_days(30)
    counts: dict[str, int] = {}
    for report in reports:
        counts[report.source_id] = counts.get(report.source_id, 0) + 1

    risks = []
    
    # Check for sources with multiple reports (pattern detection)
    for source_id, count in counts.items():
        if count < 1:  # Lower threshold to 1 to catch any reported issue
            continue
        source = WaterSource.query.get(source_id)
        if not source:
            continue
        level = 'high' if count >= 3 else 'medium'
        risks.append({
            'source_id': source_id,
            'source_name': source.name,
            'report_count_30d': count,
            'risk_level': level,
            'suggested_action': 'Schedule inspection' if level == 'medium' else 'Urgent dispatch',
        })
    
    # Also check for sources with red/yellow status
    for source in WaterSource.query.all():
        if source.id in counts:
            continue  # Already in risks
        if source.status in ['red', 'yellow']:
            risks.append({
                'source_id': source.id,
                'source_name': source.name,
                'report_count_30d': 0,
                'risk_level': 'high' if source.status == 'red' else 'medium',
                'suggested_action': 'Check infrastructure' if source.status == 'yellow' else 'Urgent inspection needed',
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
    Build alert payloads for contamination risk, source failures, and drought.
    Returns actionable alerts based on report patterns and source status.
    """
    alerts = []
    
    # Generate alerts from risk analysis
    risks = analyze_source_risk()
    for risk in risks:
        if risk['risk_level'] == 'high':
            if risk['report_count_30d'] > 0:
                alerts.append({
                    'type': 'contamination_or_failure',
                    'source_id': risk['source_id'],
                    'message': (
                        f"{risk['source_name']}: {risk['report_count_30d']} "
                        f"report(s) in 30 days indicating potential water quality or infrastructure issue."
                    ),
                })
            else:
                # Status-based alert
                alerts.append({
                    'type': 'infrastructure_failure',
                    'source_id': risk['source_id'],
                    'message': f"{risk['source_name']} is showing critical status and requires immediate attention.",
                })
        elif risk['risk_level'] == 'medium':
            alerts.append({
                'type': 'contamination_warning',
                'source_id': risk['source_id'],
                'message': f"{risk['source_name']} requires routine maintenance or monitoring.",
            })

    # Sample drought/rainfall check for sources with coordinates
    sources = WaterSource.query.limit(5).all()
    for source in sources:
        if source.status == 'red':  # Only for critical sources
            forecast = fetch_rainfall_forecast(source.latitude, source.longitude)
            if forecast and forecast.get('drought_risk'):
                alerts.append({
                    'type': 'drought_risk',
                    'source_id': source.id,
                    'message': f"Low rainfall forecast for {source.name}. Monitor water availability closely.",
                })
    
    return alerts
