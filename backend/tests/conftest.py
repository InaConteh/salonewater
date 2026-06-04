import pytest

from app import create_app, db
from app.models import WaterSource


@pytest.fixture
def app():
    application = create_app('testing')
    with application.app_context():
        db.create_all()
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
