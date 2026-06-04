from flask import request
from flask_jwt_extended import jwt_required

from app.api import bp
from app import db
from app.models import Report
from app.services.dispatch_service import auto_dispatch_for_report
from app.services.report_service import create_report
from app.utils.auth import ROLE_ADMIN, roles_required


@bp.route('/reports', methods=['GET'])
def get_reports():
    query = Report.query.order_by(Report.timestamp.desc())
    source_id = request.args.get('source_id')
    if source_id:
        query = query.filter_by(source_id=source_id)
    reports = query.all()
    return {'reports': [report.to_dict() for report in reports]}


@bp.route('/reports/<string:report_id>', methods=['GET'])
def get_report(report_id):
    report = Report.query.get_or_404(report_id)
    return report.to_dict()


@bp.route('/reports', methods=['POST'])
def create_report_endpoint():
    """Submit issue report; auto-updates linked water source status."""
    data = request.get_json() or {}
    source_id = data.get('source_id')
    cause_category = data.get('cause_category')

    if not source_id or not cause_category:
        return {'error': 'source_id and cause_category are required'}, 400

    report, err = create_report(
        source_id,
        cause_category,
        data.get('reporter_phone'),
        data.get('notes'),
    )
    if err:
        status = 404 if 'source' in err.lower() else 400
        return {'error': err}, status

    if data.get('auto_dispatch'):
        auto_dispatch_for_report(report.id)

    return report.to_dict(), 201


@bp.route('/report', methods=['POST'])
def create_report_alias():
    """Alias for POST /api/reports (implementation plan)."""
    return create_report_endpoint()


@bp.route('/reports/<string:report_id>', methods=['PATCH'])
@jwt_required()
@roles_required(ROLE_ADMIN)
def update_report(report_id):
    report = Report.query.get_or_404(report_id)
    data = request.get_json() or {}

    if 'reporter_phone' in data:
        report.reporter_phone = data['reporter_phone']
    if 'cause_category' in data:
        report.cause_category = data['cause_category']
    if 'notes' in data:
        report.notes = data['notes']

    db.session.commit()
    return report.to_dict()


@bp.route('/reports/<string:report_id>', methods=['DELETE'])
@jwt_required()
@roles_required(ROLE_ADMIN)
def delete_report(report_id):
    report = Report.query.get_or_404(report_id)
    db.session.delete(report)
    db.session.commit()
    return {'message': 'Report deleted'}
