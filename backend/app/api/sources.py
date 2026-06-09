from datetime import datetime

from flask import request
from flask_jwt_extended import jwt_required

from app.api import bp
from app import db
from app.models import Report, WaterSource
from app.utils.auth import ROLE_ADMIN, roles_required
from app.utils.helpers import haversine_km, sources_to_geojson
from app.utils.validators import validate_status


def _parse_source_payload(data):
    return {
        'name': data.get('name'),
        'status': data.get('status'),
        'latitude': data.get('latitude'),
        'longitude': data.get('longitude'),
        'district': data.get('district'),
        'description': data.get('description'),
        'root_cause': data.get('root_cause'),
    }


@bp.route('/sources/nearby', methods=['GET'])
def get_sources_nearby():
    """Find nearest functional (green) water sources by coordinates."""
    try:
        lat = float(request.args['lat'])
        lon = float(request.args['lon'])
    except (KeyError, TypeError, ValueError):
        return {'error': 'Query params lat and lon are required floats'}, 400

    try:
        limit = min(int(request.args.get('limit', 3)), 10)
    except (ValueError, TypeError):
        return {'error': 'limit must be an integer'}, 400

    sources = WaterSource.query.filter(WaterSource.status == 'green').all()
    ranked = sorted(sources, key=lambda s: haversine_km(lat, lon, s.latitude, s.longitude))
    nearest = ranked[:limit]
    return {
        'sources': [
            {**s.to_dict(), 'distance_km': round(haversine_km(lat, lon, s.latitude, s.longitude), 2)}
            for s in nearest
        ]
    }


@bp.route('/sources', methods=['GET'])
def get_sources():
    sources = WaterSource.query.order_by(WaterSource.name).all()
    fmt = (request.args.get('format') or '').lower()
    if fmt == 'geojson':
        return sources_to_geojson(sources)
    return {'sources': [source.to_dict() for source in sources]}


@bp.route('/sources/<string:source_id>', methods=['GET'])
def get_source(source_id):
    source = WaterSource.query.get_or_404(source_id)
    return source.to_dict()


@bp.route('/sources/<string:source_id>/reports', methods=['GET'])
def get_source_reports(source_id):
    WaterSource.query.get_or_404(source_id)
    reports = (
        Report.query.filter_by(source_id=source_id)
        .order_by(Report.timestamp.desc())
        .all()
    )
    return {'reports': [r.to_dict() for r in reports]}


@bp.route('/sources', methods=['POST'])
@jwt_required()
@roles_required(ROLE_ADMIN)
def create_source():
    data = request.get_json() or {}
    payload = _parse_source_payload(data)

    if not payload['name'] or payload['latitude'] is None or payload['longitude'] is None:
        return {'error': 'name, latitude, and longitude are required'}, 400

    status = payload.get('status') or 'green'
    if not validate_status(status):
        return {'error': 'status must be green, yellow, or red'}, 400

    source = WaterSource(
        name=payload['name'],
        status=status,
        latitude=payload['latitude'],
        longitude=payload['longitude'],
        district=payload.get('district'),
        description=payload.get('description'),
        root_cause=payload.get('root_cause'),
        last_updated=datetime.utcnow(),
    )

    db.session.add(source)
    db.session.commit()

    return source.to_dict(), 201


def _apply_source_update(source, data):
    payload = _parse_source_payload(data)
    if payload.get('status') and not validate_status(payload['status']):
        return {'error': 'status must be green, yellow, or red'}, 400

    for key, value in payload.items():
        if value is not None:
            setattr(source, key, value)

    source.last_updated = datetime.utcnow()
    db.session.commit()
    return source.to_dict()


@bp.route('/sources/<string:source_id>', methods=['PATCH', 'PUT'])
@jwt_required()
@roles_required(ROLE_ADMIN)
def update_source(source_id):
    source = WaterSource.query.get_or_404(source_id)
    data = request.get_json() or {}
    result = _apply_source_update(source, data)
    if isinstance(result, tuple):
        return result
    return result


@bp.route('/sources/<string:source_id>', methods=['DELETE'])
@jwt_required()
@roles_required(ROLE_ADMIN)
def delete_source(source_id):
    source = WaterSource.query.get_or_404(source_id)
    db.session.delete(source)
    db.session.commit()

    return {'message': 'Water source deleted'}
