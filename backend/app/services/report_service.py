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
        source.status = cause_to_status(normalized)
        source.last_updated = datetime.utcnow()

    db.session.commit()
    return report, None
