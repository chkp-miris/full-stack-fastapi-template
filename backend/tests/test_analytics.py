from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from ..main import app
from ..dependencies import get_db
from ..models.analytics import AnalyticsEvent, SystemMetric, ApiUsageMetric, DashboardWidget
import uuid
from datetime import datetime

client = TestClient(app)

def test_get_analytics_overview():
    response = client.get("/analytics/overview", params={"start_date": "2023-01-01", "end_date": "2023-12-31"})
    assert response.status_code == 200
    # Add more assertions based on expected response structure


def test_track_analytics_event():
    event = AnalyticsEvent(
        event_type="page_view",
        event_category="user_interaction",
        event_data={"page": "home"},
        user_id=uuid.uuid4(),
        timestamp=datetime.utcnow()
    )
    response = client.post("/analytics/events", json=event.dict())
    assert response.status_code == 200
    # Add more assertions based on expected response


def test_export_analytics_data():
    response = client.get("/analytics/export/csv")
    assert response.status_code == 200
    # Add more assertions based on expected response


def test_get_dashboard_widgets():
    user_id = uuid.uuid4()
    response = client.get("/dashboard/widgets", params={"user_id": str(user_id)})
    assert response.status_code == 200
    # Add more assertions based on expected response