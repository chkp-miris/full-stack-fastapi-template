from sqlmodel import SQLModel, Field, Column, JSON
import uuid
from datetime import datetime

class AnalyticsEvent(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    event_type: str
    event_category: str
    event_data: dict = Field(default_factory=dict, sa_column=Column(JSON))
    user_id: uuid.UUID | None = Field(foreign_key="user.id", nullable=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SystemMetric(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    metric_name: str
    metric_value: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ApiUsageMetric(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    endpoint: str
    call_count: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class DashboardWidget(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    widget_name: str
    configuration: dict = Field(default_factory=dict, sa_column=Column(JSON))
    user_id: uuid.UUID = Field(foreign_key="user.id")