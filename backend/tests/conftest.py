import pytest

from app import create_app, db
from app.models import WaterSource, User, Role


@pytest.fixture
def app():
    application = create_app('testing')
    with application.app_context():
        db.create_all()

        # Seed roles and admin user for testing
        admin_role = Role(name='admin', permissions='all')
        db.session.add(admin_role)
        db.session.commit()

        admin_user = User(username='admin', role_id=admin_role.id)
        admin_user.set_password('admin123')
        db.session.add(admin_user)

        source = WaterSource(
            name='Test Well',
            status='green',
            latitude=8.0,
            longitude=-13.0,
            district='Freetown',
        )
        db.session.add(source)
        db.session.commit()
        yield application
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def admin_headers(client):
    res = client.post(
        '/api/auth/login',
        json={'username': 'admin', 'password': 'admin123'},
    )
    token = res.get_json()['access_token']
    return {'Authorization': f'Bearer {token}'}
