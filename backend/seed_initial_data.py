import os
import pathlib
from datetime import datetime, timedelta

# Ensure the local SQLite database is used for seeding.
BASE_DIR = pathlib.Path(__file__).resolve().parent
DEFAULT_SQLITE_DB = BASE_DIR / 'instance' / 'cleanflow.db'
DEFAULT_SQLITE_DB.parent.mkdir(parents=True, exist_ok=True)
os.environ.setdefault('FLASK_ENV', 'development')
os.environ.setdefault('DATABASE_URL', f"sqlite:///{DEFAULT_SQLITE_DB.as_posix()}")

from app import create_app, db
from app.models import WaterSource, Report, MaintenanceLog, RepairCase, User, Role


def seed_database():
    app = create_app('development')

    with app.app_context():
        # Seed Roles
        admin_role = Role.query.filter_by(name='admin').first()
        if not admin_role:
            admin_role = Role(name='admin', permissions='all')
            db.session.add(admin_role)

        tech_role = Role.query.filter_by(name='technician').first()
        if not tech_role:
            tech_role = Role(name='technician', permissions='repair')
            db.session.add(tech_role)

        committee_role = Role.query.filter_by(name='committee').first()
        if not committee_role:
            committee_role = Role(name='committee', permissions='read')
            db.session.add(committee_role)

        db.session.commit()

        # Seed Admin User
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            admin_user = User(
                username='admin',
                email='admin@cleanflow.sl',
                role_id=admin_role.id
            )
            admin_user.set_password('admin123')
            db.session.add(admin_user)
            db.session.commit()

        existing_sources = WaterSource.query.count()
        if existing_sources > 0:
            print(f'Seeding skipped: {existing_sources} water source(s) already exist.')
            return

        source_a = WaterSource(
            name='Kambia Central Borehole',
            status='yellow',
            latitude=9.9551,
            longitude=-12.9858,
            district='Kambia',
            description='Rural borehole serving Kambia Central community. Reports of low flow and sediment.',
            root_cause='pump_failure',
            last_updated=datetime.utcnow()
        )

        source_b = WaterSource(
            name='Bo Market Handpump',
            status='green',
            latitude=7.9648,
            longitude=-11.7388,
            district='Bo',
            description='Embedded handpump at the market center. Operating normally.',
            root_cause=None,
            last_updated=datetime.utcnow()
        )

        db.session.add_all([source_a, source_b])
        db.session.flush()

        # Create multiple reports for better alert generation
        reports_data = [
            {
                'source_id': source_a.id,
                'reporter_phone': '+23277212345',
                'cause_category': 'pump_failure',
                'notes': 'The pump rattles and delivers less water than yesterday.',
                'timestamp': datetime.utcnow() - timedelta(hours=2)
            },
            {
                'source_id': source_a.id,
                'reporter_phone': '+23276543210',
                'cause_category': 'low_flow',
                'notes': 'Water pressure is very low this morning.',
                'timestamp': datetime.utcnow() - timedelta(days=2)
            },
            {
                'source_id': source_a.id,
                'reporter_phone': '+23278901234',
                'cause_category': 'contamination',
                'notes': 'Water has unusual color and smell.',
                'timestamp': datetime.utcnow() - timedelta(days=5)
            },
            {
                'source_id': source_b.id,
                'reporter_phone': '+23279876543',
                'cause_category': 'maintenance_due',
                'notes': 'Pump needs regular maintenance check.',
                'timestamp': datetime.utcnow() - timedelta(days=7)
            },
        ]

        reports = []
        for report_data in reports_data:
            report = Report(**report_data)
            db.session.add(report)
            reports.append(report)
        db.session.flush()

        maintenance = MaintenanceLog(
            source_id=source_a.id,
            task_type='Pump inspection and filter cleaning',
            scheduled_date=datetime.utcnow() + timedelta(days=1),
            completion_status='scheduled',
            notes='Technician visit scheduled for tomorrow morning.',
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        repair_case = RepairCase(
            report_id=reports[0].id,
            assigned_team='Western Response Unit',
            eta=datetime.utcnow() + timedelta(hours=6),
            status='open',
            notes='Dispatch team assigned to inspect the borehole pump and tubing.',
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        db.session.add_all([maintenance, repair_case])
        db.session.commit()

        print('Seed complete:')
        print(f'  Water sources: {WaterSource.query.count()}')
        print(f'  Reports: {Report.query.count()}')
        print(f'  Maintenance logs: {MaintenanceLog.query.count()}')
        print(f'  Repair cases: {RepairCase.query.count()}')


if __name__ == '__main__':
    seed_database()
