"""Repair dispatch workflow and maintenance reminders."""
from datetime import datetime, timedelta

from app import db
from app.models import MaintenanceLog, RepairCase, Report


def create_repair_case(
    report_id: str | None = None,
    assigned_team: str | None = None,
    eta: datetime | None = None,
    status: str = 'open',
    notes: str | None = None,
) -> tuple[RepairCase | None, str | None]:
    if report_id:
        report = Report.query.get(report_id)
        if not report:
            return None, 'Invalid report_id'

    case = RepairCase(
        report_id=report_id,
        assigned_team=assigned_team,
        eta=eta,
        status=status,
        notes=notes,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.session.add(case)
    db.session.commit()
    return case, None


def update_repair_status(case_id: str, **fields) -> tuple[RepairCase | None, str | None]:
    case = RepairCase.query.get(case_id)
    if not case:
        return None, 'Repair case not found'

    for key in ('assigned_team', 'status', 'notes', 'eta'):
        if key in fields:
            setattr(case, key, fields[key])

    case.updated_at = datetime.utcnow()
    db.session.commit()
    return case, None


def get_due_maintenance_reminders(within_hours: int = 24) -> list[dict]:
    """Maintenance tasks due soon (pending or scheduled)."""
    cutoff = datetime.utcnow() + timedelta(hours=within_hours)
    logs = (
        MaintenanceLog.query.filter(
            MaintenanceLog.completion_status.in_(('pending', 'scheduled')),
            MaintenanceLog.scheduled_date <= cutoff,
        )
        .order_by(MaintenanceLog.scheduled_date.asc())
        .all()
    )
    return [log.to_dict() for log in logs]


def auto_dispatch_for_report(report_id: str, team: str = 'Field Response Unit') -> RepairCase | None:
    """Open a repair case when a report is filed (optional automation)."""
    case, err = create_repair_case(
        report_id=report_id,
        assigned_team=team,
        eta=datetime.utcnow() + timedelta(hours=48),
        notes='Auto-created from community report',
    )
    if err:
        return None
    return case
