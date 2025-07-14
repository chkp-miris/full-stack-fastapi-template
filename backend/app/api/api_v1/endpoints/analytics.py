from fastapi import APIRouter, Depends
from datetime import datetime
from sqlalchemy.orm import Session
from ...dependencies import get_db
from ...models.analytics import AnalyticsEvent, SystemMetric, ApiUsageMetric, DashboardWidget
from ...services.analytics_service import analytics_service

router = APIRouter()

@router.get("/analytics/overview", response_model=AnalyticsOverview)
def get_analytics_overview(
    start_date: datetime, end_date: datetime, db: Session = Depends(get_db)
):
    return analytics_service.get_overview(start_date, end_date, db)

@router.get("/analytics/users", response_model=UserBehaviorAnalytics)
def get_user_behavior_analytics(
    start_date: datetime, end_date: datetime, db: Session = Depends(get_db)
):
    return analytics_service.get_user_behavior(start_date, end_date, db)

@router.get("/analytics/api-usage", response_model=ApiUsageAnalytics)
def get_api_usage_analytics(
    start_date: datetime, end_date: datetime, db: Session = Depends(get_db)
):
    return analytics_service.get_api_usage(start_date, end_date, db)

@router.post("/analytics/events")
def track_analytics_event(event: AnalyticsEvent, db: Session = Depends(get_db)):
    analytics_service.track_event(event, db)

@router.get("/analytics/export/{format}", response_model=ExportedAnalytics)
def export_analytics_data(format: str, db: Session = Depends(get_db)):
    return analytics_service.export_data(format, db)

@router.get("/dashboard/widgets", response_model=List[DashboardWidget])
def get_dashboard_widgets(user_id: uuid.UUID, db: Session = Depends(get_db)):
    return analytics_service.get_widgets(user_id, db)

@router.post("/dashboard/widgets")
def create_or_update_dashboard_widget(widget: DashboardWidget, db: Session = Depends(get_db)):
    return analytics_service.save_widget(widget, db)