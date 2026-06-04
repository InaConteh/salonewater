import csv
import io
from collections import Counter
from datetime import datetime, timedelta

from flask import Response, request

from app.api import bp
from app.models import RepairCase, Report, WaterSource
from app.services.prediction_engine import analyze_source_risk, generate_alerts


@bp.route('/analytics/kpis', methods=['GET'])
def get_kpis():
    sources = WaterSource.query.all()
    status_counts = Counter(s.status for s in sources)
    since = datetime.utcnow() - timedelta(days=30)
    recent_reports = Report.query.filter(Report.timestamp >= since).count()
    open_cases = RepairCase.query.filter(RepairCase.status == 'open').count()

    return {
        'total_sources': len(sources),
        'status_green': status_counts.get('green', 0),
        'status_yellow': status_counts.get('yellow', 0),
        'status_red': status_counts.get('red', 0),
        'reports_last_30_days': recent_reports,
        'open_repair_cases': open_cases,
    }


@bp.route('/analytics/trends', methods=['GET'])
def get_trends():
    days = int(request.args.get('days', 30))
    since = datetime.utcnow() - timedelta(days=days)
    reports = Report.query.filter(Report.timestamp >= since).all()

    by_cause = Counter(r.cause_category for r in reports)
    by_day: dict[str, int] = {}
    for report in reports:
        day = report.timestamp.strftime('%Y-%m-%d') if report.timestamp else 'unknown'
        by_day[day] = by_day.get(day, 0) + 1

    payload = {
        'period_days': days,
        'total_reports': len(reports),
        'by_cause': dict(by_cause),
        'by_day': dict(sorted(by_day.items())),
        'risk_sources': analyze_source_risk(),
        'alerts': generate_alerts(),
    }

    fmt = (request.args.get('format') or 'json').lower()
    if fmt == 'csv':
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['metric', 'value'])
        writer.writerow(['period_days', days])
        writer.writerow(['total_reports', len(reports)])
        for cause, count in by_cause.items():
            writer.writerow([f'cause_{cause}', count])
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=trends.csv'},
        )

    return payload
