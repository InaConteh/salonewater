import pytest
from app.services.report_service import create_report
from app.models import WaterSource
from app import db as _db

def test_status_downgrade_prevention(app):
    """Verify that a less severe status does not overwrite a more severe one."""
    with app.app_context():
        # Create a red source
        source = WaterSource(
            name="Test Source Red",
            status="red",
            latitude=0.0,
            longitude=0.0
        )
        _db.session.add(source)
        _db.session.commit()
        source_id = source.id

        # File a report that would normally result in a yellow status (e.g., drought)
        report, err = create_report(source_id, "drought")
        assert err is None

        # Check that status remained red
        updated_source = WaterSource.query.get(source_id)
        assert updated_source.status == "red"

        # Test upgrading from green to yellow
        source2 = WaterSource(
            name="Green Source",
            status="green",
            latitude=0.0,
            longitude=0.0
        )
        _db.session.add(source2)
        _db.session.commit()
        source2_id = source2.id

        create_report(source2_id, "drought")
        assert WaterSource.query.get(source2_id).status == "yellow"

def test_api_param_validation(client):
    """Test that API endpoints handle invalid integer parameters gracefully."""
    # Test /api/sources/nearby
    resp = client.get('/api/sources/nearby?lat=8.0&lon=-12.0&limit=abc')
    assert resp.status_code == 400
    assert b"limit must be an integer" in resp.data

    # Test /api/analytics/trends
    resp = client.get('/api/analytics/trends?days=xyz')
    assert resp.status_code == 400
    assert b"days must be an integer" in resp.data

def test_drought_prediction_iteration(app):
    """Verify that prediction engine checks multiple sources."""
    from app.services.prediction_engine import generate_alerts
    import responses

    with app.app_context():
        # Add 5 sources
        for i in range(5):
            s = WaterSource(
                name=f"Source {i}",
                status="green",
                latitude=8.0 + i,
                longitude=-12.0
            )
            _db.session.add(s)
        _db.session.commit()

        # Mock Open-Meteo to return drought for all
        with responses.RequestsMock() as rsps:
            rsps.add(
                responses.GET,
                "https://api.open-meteo.com/v1/forecast",
                json={"daily": {"precipitation_sum": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]}},
                status=200
            )

            alerts = generate_alerts()
            drought_alerts = [a for a in alerts if a['type'] == 'drought']
            # It should have checked multiple sources.
            assert len(drought_alerts) > 1
