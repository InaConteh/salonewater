def test_health(client):
    res = client.get('/health')
    assert res.status_code == 200


def test_sources_geojson(client):
    res = client.get('/api/sources?format=geojson')
    assert res.status_code == 200
    data = res.get_json()
    assert data['type'] == 'FeatureCollection'
    assert len(data['features']) >= 1


def test_sources_nearby(client):
    res = client.get('/api/sources/nearby?lat=8.0&lon=-13.0&limit=1')
    assert res.status_code == 200
    assert 'sources' in res.get_json()


def test_report_updates_source_status(client, app):
    with app.app_context():
        from app.models import WaterSource

        source = WaterSource.query.first()
        source_id = source.id

    res = client.post(
        '/api/reports',
        json={'source_id': source_id, 'cause_category': 'contamination'},
    )
    assert res.status_code == 201

    with app.app_context():
        source = WaterSource.query.get(source_id)
        assert source.status == 'red'
        assert source.root_cause == 'contamination'


def test_sms_status_command(client, app):
    with app.app_context():
        from app.models import WaterSource

        source_id = WaterSource.query.first().id

    res = client.post('/api/sms', json={'text': f'STATUS {source_id}'})
    assert res.status_code == 200
    msg = res.get_json()['message']
    assert '🟢' in msg or '🟡' in msg or '🔴' in msg
    assert len(msg) <= 160


def test_sms_callback_route(client, app):
    with app.app_context():
        from app.models import WaterSource

        source_id = WaterSource.query.first().id

    res = client.post('/api/sms/callback', json={'text': f'TIPS'})
    assert res.status_code == 200
    assert '💡' in res.get_json()['message']


def test_auth_and_protected_create_source(client, admin_headers):
    res = client.post(
        '/api/sources',
        json={
            'name': 'New Borehole',
            'latitude': 8.5,
            'longitude': -12.5,
            'district': 'Makeni',
        },
        headers=admin_headers,
    )
    assert res.status_code == 201

    res_unauth = client.post(
        '/api/sources',
        json={'name': 'X', 'latitude': 1, 'longitude': 1},
    )
    assert res_unauth.status_code == 401


def test_analytics_kpis(client):
    res = client.get('/api/analytics/kpis')
    assert res.status_code == 200
    data = res.get_json()
    assert 'total_sources' in data


def test_maintenance_crud(client, app, admin_headers):
    with app.app_context():
        from app.models import WaterSource

        source_id = WaterSource.query.first().id

    res = client.post(
        '/api/maintenance',
        json={
            'source_id': source_id,
            'task_type': 'Pump check',
            'scheduled_date': '2026-06-10T09:00:00',
        },
        headers=admin_headers,
    )
    assert res.status_code == 201
