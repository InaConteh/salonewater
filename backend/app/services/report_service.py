"""Report creation with automatic water-source status updates."""
from datetime import datetime

from app import db
from app.models import Report, WaterSource
from app.utils.validators import cause_to_status, normalize_cause


def create_report(
    source_id: str,
    cause_category: str,
    reporter_phone: str | None = None,
    notes: str | None = None,
    *,
    update_source: bool = True,
) -> tuple[Report | None, str | None]:
    """
    Create a report and optionally update the linked water source.
    Returns (report, error_message).
    """
    source = WaterSource.query.get(source_id)
    if not source:
        return None, 'Invalid water source ID'

    normalized = normalize_cause(cause_category)
    if not normalized:
        return None, (
            'Invalid cause. Use 1-6 or: drought, broken_pump, dry_well, '
            'contamination, overuse, seasonal'
        )

    report = Report(
        source_id=source_id,
        reporter_phone=reporter_phone,
        cause_category=normalized,
        notes=notes,
        timestamp=datetime.utcnow(),
    )
    db.session.add(report)

    if update_source:
        source.root_cause = normalized
        new_status = cause_to_status(normalized)

        # Only update status if it's more severe than the current status
        # Severity: red (3) > yellow (2) > green (1)
        severity = {'red': 3, 'yellow': 2, 'green': 1}
        current_sev = severity.get(source.status, 0)
        new_sev = severity.get(new_status, 0)

        if new_sev > current_sev:
            source.status = new_status

        source.last_updated = datetime.utcnow()

    db.session.commit()
    return report, None
