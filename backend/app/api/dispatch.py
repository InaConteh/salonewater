from datetime import datetime

from flask import request
from flask_jwt_extended import jwt_required

from app.api import bp
from app import db
from app.models import RepairCase
from app.services.dispatch_service import (
    create_repair_case,
    get_due_maintenance_reminders,
    update_repair_status,
)
from app.utils.auth import ROLE_ADMIN, ROLE_TECHNICIAN, roles_required


@bp.route('/dispatch/reminders', methods=['GET'])
@jwt_required()
@roles_required(ROLE_ADMIN, ROLE_TECHNICIAN)
def maintenance_reminders():
    try:
        hours = int(request.args.get('within_hours', 24))
    except (ValueError, TypeError):
        return {'error': 'within_hours must be an integer'}, 400
    return {'reminders': get_due_maintenance_reminders(hours)}


@bp.route('/dispatch', methods=['GET'])
def get_dispatch_cases():
    cases = RepairCase.query.order_by(RepairCase.created_at.desc()).all()
    return {'repair_cases': [case.to_dict() for case in cases]}


@bp.route('/dispatch', methods=['POST'])
@jwt_required()
@roles_required(ROLE_ADMIN, ROLE_TECHNICIAN)
def create_dispatch_case():
    data = request.get_json() or {}
    eta = data.get('eta')
    parsed_eta = None
    if eta:
        try:
            parsed_eta = datetime.fromisoformat(eta)
        except ValueError:
            return {'error': 'Invalid eta format. Use ISO 8601.'}, 400

    case, err = create_repair_case(
        report_id=data.get('report_id'),
        assigned_team=data.get('assigned_team'),
        eta=parsed_eta,
        status=data.get('status', 'open'),
        notes=data.get('notes'),
    )
    if err:
        return {'error': err}, 404
    return case.to_dict(), 201


@bp.route('/dispatch/<string:case_id>', methods=['PATCH', 'PUT'])
@jwt_required()
@roles_required(ROLE_ADMIN, ROLE_TECHNICIAN)
def update_dispatch_case(case_id):
    data = request.get_json() or {}
    eta = None
    if 'eta' in data and data['eta']:
        try:
            eta = datetime.fromisoformat(data['eta'])
        except ValueError:
            return {'error': 'Invalid eta format. Use ISO 8601.'}, 400

    fields = {k: v for k, v in {
        'assigned_team': data.get('assigned_team'),
        'status': data.get('status'),
        'notes': data.get('notes'),
        'eta': eta,
    }.items() if k in data or (k == 'eta' and eta is not None)}
    case, err = update_repair_status(case_id, **fields)
    if err:
        return {'error': err}, 404
    return case.to_dict()


@bp.route('/dispatch/<string:case_id>', methods=['DELETE'])
@jwt_required()
@roles_required(ROLE_ADMIN)
def delete_dispatch_case(case_id):
    repair_case = RepairCase.query.get_or_404(case_id)
    db.session.delete(repair_case)
    db.session.commit()
    return {'message': 'Repair case deleted'}
