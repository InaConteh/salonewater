from datetime import datetime
import uuid

from app import db


class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_id = db.Column(db.String(36), db.ForeignKey('water_sources.id', ondelete='CASCADE'), nullable=False)
    reporter_phone = db.Column(db.String(20), nullable=True)
    cause_category = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    water_source = db.relationship('WaterSource', back_populates='reports')
    repair_cases = db.relationship('RepairCase', back_populates='report', cascade='all, delete-orphan', lazy='dynamic')

    def __repr__(self):
        return f'<Report {self.id} source={self.source_id} cause={self.cause_category}>'

    def to_dict(self):
        source = self.water_source
        # Map source status (green/yellow/red) to report status (safe/warning/danger)
        status_map = {'green': 'safe', 'yellow': 'warning', 'red': 'danger'}
        report_status = status_map.get(source.status, 'safe') if source else 'safe'
        
        return {
            'id': self.id,
            'source_id': self.source_id,
            'source_name': source.name if source else None,
            'district': source.district if source else None,
            'reporter_phone': self.reporter_phone,
            'cause_category': self.cause_category,
            'notes': self.notes,
            'message': self.notes,  # Alias for compatibility
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'status': report_status,
        }
