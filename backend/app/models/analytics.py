from typing import Optional
from sqlmodel import Field, SQLModel

class Analytics(SQLModel, table=True):
    """
    Represents an analytics record in the database.

    Attributes:
        id (Optional[int]): The unique identifier for the analytics record.
        event_name (str): The name of the event being tracked.
        event_timestamp (str): The timestamp when the event occurred.
        user_id (Optional[int]): The ID of the user associated with the event.
        metadata (Optional[dict]): Additional metadata related to the event.
    """

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    event_name: str = Field(..., description="The name of the event being tracked.")
    event_timestamp: str = Field(..., description="The timestamp when the event occurred.")
    user_id: Optional[int] = Field(default=None, description="The ID of the user associated with the event.")
    metadata: Optional[dict] = Field(default=None, description="Additional metadata related to the event.")