from datetime import datetime
import uuid

from app import db


class WaterSource(db.Model):
    __tablename__ = 'water_sources'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(10), nullable=False, default='green')
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    district = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    root_cause = db.Column(db.String(50), nullable=True)
    last_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    reports = db.relationship(
        'Report',
        back_populates='water_source',
        cascade='all, delete-orphan',
        lazy='dynamic'
    )
    maintenance_logs = db.relationship(
        'MaintenanceLog',
        back_populates='water_source',
        cascade='all, delete-orphan',
        lazy='dynamic'
    )

    def __repr__(self):
        return f'<WaterSource {self.id} {self.name} {self.status}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'status': self.status,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'district': self.district,
            'description': self.description,
            'root_cause': self.root_cause,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
        }
