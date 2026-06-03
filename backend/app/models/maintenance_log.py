from datetime import datetime
import uuid

from app import db


class MaintenanceLog(db.Model):
    __tablename__ = 'maintenance_logs'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_id = db.Column(db.String(36), db.ForeignKey('water_sources.id', ondelete='CASCADE'), nullable=False)
    task_type = db.Column(db.String(100), nullable=False)
    scheduled_date = db.Column(db.DateTime, nullable=False)
    completion_status = db.Column(db.String(20), nullable=False, default='pending')
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    water_source = db.relationship('WaterSource', back_populates='maintenance_logs')

    def __repr__(self):
        return f'<MaintenanceLog {self.id} source={self.source_id} status={self.completion_status}>'

    def to_dict(self):
        return {
            'id': self.id,
            'source_id': self.source_id,
            'task_type': self.task_type,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'completion_status': self.completion_status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
