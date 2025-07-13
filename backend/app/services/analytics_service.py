from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from typing import List
from backend.app.models.analytics import AnalyticsRecord, AnalyticsCreate
from backend.app.database import get_session
from backend.app.utils.logger import logger

router = APIRouter()

@router.get("/analytics", response_model=List[AnalyticsRecord])
async def get_analytics_records(skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    """
    Retrieve a list of analytics records from the database.

    Args:
        skip (int): Number of records to skip for pagination.
        limit (int): Maximum number of records to return.
        session (Session): Database session dependency.

    Returns:
        List[AnalyticsRecord]: A list of analytics records.

    Raises:
        HTTPException: If an error occurs while fetching records.
    """
    try:
        query = select(AnalyticsRecord).offset(skip).limit(limit)
        results = session.exec(query).all()
        return results
    except Exception as e:
        logger.error(f"Error fetching analytics records: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch analytics records")

@router.post("/analytics", response_model=AnalyticsRecord)
async def create_analytics_record(record: AnalyticsCreate, session: Session = Depends(get_session)):
    """
    Create a new analytics record in the database.

    Args:
        record (AnalyticsCreate): The analytics record data to create.
        session (Session): Database session dependency.

    Returns:
        AnalyticsRecord: The created analytics record.

    Raises:
        HTTPException: If an error occurs while creating the record.
    """
    try:
        new_record = AnalyticsRecord.from_orm(record)
        session.add(new_record)
        session.commit()
        session.refresh(new_record)
        return new_record
    except Exception as e:
        logger.error(f"Error creating analytics record: {e}")
        raise HTTPException(status_code=500, detail="Failed to create analytics record")