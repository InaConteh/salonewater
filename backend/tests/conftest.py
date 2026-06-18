import pytest

from app import create_app, db
from app.models import WaterSource, User, Role


@pytest.fixture
def app():
    application = create_app('testing')
    with application.app_context():
        db.create_all()

        # Seed all roles for testing
        admin_role = Role(name='admin', permissions='all')
        tech_role = Role(name='technician', permissions='repair')
        committee_role = Role(name='committee', permissions='read')
        db.session.add_all([admin_role, tech_role, committee_role])
        db.session.commit()

        # Create users for each role
        admin_user = User(username='admin', role_id=admin_role.id)
        admin_user.set_password('admin123')
        
        tech_user = User(username='tech', role_id=tech_role.id)
        tech_user.set_password('tech123')
        
        committee_user = User(username='committee', role_id=committee_role.id)
        committee_user.set_password('committee123')
        
        db.session.add_all([admin_user, tech_user, committee_user])

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


@pytest.fixture
def technician_headers(client):
    res = client.post(
        '/api/auth/login',
        json={'username': 'tech', 'password': 'tech123'},
    )
    token = res.get_json()['access_token']
    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def committee_headers(client):
    res = client.post(
        '/api/auth/login',
        json={'username': 'committee', 'password': 'committee123'},
    )
    token = res.get_json()['access_token']
    return {'Authorization': f'Bearer {token}'}
