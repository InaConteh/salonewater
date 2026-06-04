from datetime import datetime

from flask import request
from flask_jwt_extended import jwt_required

from app.api import bp
from app import db
from app.models import MaintenanceLog, WaterSource
from app.utils.auth import ROLE_ADMIN, ROLE_COMMITTEE, ROLE_TECHNICIAN, roles_required


@bp.route('/maintenance', methods=['GET'])
def get_maintenance_logs():
    query = MaintenanceLog.query.order_by(MaintenanceLog.scheduled_date.asc())
    source_id = request.args.get('source_id')
    if source_id:
        query = query.filter_by(source_id=source_id)
    status = request.args.get('status')
    if status:
        query = query.filter_by(completion_status=status)
    logs = query.all()
    return {'maintenance_logs': [log.to_dict() for log in logs]}


@bp.route('/maintenance/<string:log_id>', methods=['GET'])
def get_maintenance_log(log_id):
    log = MaintenanceLog.query.get_or_404(log_id)
    return log.to_dict()


@bp.route('/maintenance', methods=['POST'])
@jwt_required()
@roles_required(ROLE_ADMIN, ROLE_TECHNICIAN, ROLE_COMMITTEE)
def create_maintenance_log():
    data = request.get_json() or {}
    source_id = data.get('source_id')
    task_type = data.get('task_type')
    scheduled_date = data.get('scheduled_date')

    if not source_id or not task_type or not scheduled_date:
        return {'error': 'source_id, task_type, and scheduled_date are required'}, 400

    if not WaterSource.query.get(source_id):
        return {'error': 'Invalid water source ID'}, 404

    try:
        parsed_date = datetime.fromisoformat(scheduled_date.replace('Z', '+00:00'))
    except ValueError:
        return {'error': 'scheduled_date must be ISO 8601'}, 400

    log = MaintenanceLog(
        source_id=source_id,
        task_type=task_type,
        scheduled_date=parsed_date,
        completion_status=data.get('completion_status', 'scheduled'),
        notes=data.get('notes'),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.session.add(log)
    db.session.commit()
    return log.to_dict(), 201


@bp.route('/maintenance/<string:log_id>', methods=['PATCH', 'PUT'])
@jwt_required()
@roles_required(ROLE_ADMIN, ROLE_TECHNICIAN, ROLE_COMMITTEE)
def update_maintenance_log(log_id):
    log = MaintenanceLog.query.get_or_404(log_id)
    data = request.get_json() or {}

    if 'task_type' in data:
        log.task_type = data['task_type']
    if 'scheduled_date' in data:
        try:
            log.scheduled_date = datetime.fromisoformat(
                data['scheduled_date'].replace('Z', '+00:00')
            )
        except ValueError:
            return {'error': 'scheduled_date must be ISO 8601'}, 400
    if 'completion_status' in data:
        log.completion_status = data['completion_status']
    if 'notes' in data:
        log.notes = data['notes']

    log.updated_at = datetime.utcnow()
    db.session.commit()
    return log.to_dict()


@bp.route('/maintenance/<string:log_id>', methods=['DELETE'])
@jwt_required()
@roles_required(ROLE_ADMIN)
def delete_maintenance_log(log_id):
    log = MaintenanceLog.query.get_or_404(log_id)
    db.session.delete(log)
    db.session.commit()
    return {'message': 'Maintenance log deleted'}
