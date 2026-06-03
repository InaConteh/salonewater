from datetime import datetime
import uuid

from app import db


class RepairCase(db.Model):
    __tablename__ = 'repair_cases'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    report_id = db.Column(db.String(36), db.ForeignKey('reports.id', ondelete='SET NULL'), nullable=True)
    assigned_team = db.Column(db.String(100), nullable=True)
    eta = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='open')
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    report = db.relationship('Report', back_populates='repair_cases')

    def __repr__(self):
        return f'<RepairCase {self.id} status={self.status}>'

    def to_dict(self):
        return {
            'id': self.id,
            'report_id': self.report_id,
            'assigned_team': self.assigned_team,
            'eta': self.eta.isoformat() if self.eta else None,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
