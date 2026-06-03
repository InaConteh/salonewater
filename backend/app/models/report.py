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
        return {
            'id': self.id,
            'source_id': self.source_id,
            'reporter_phone': self.reporter_phone,
            'cause_category': self.cause_category,
            'notes': self.notes,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
        }
