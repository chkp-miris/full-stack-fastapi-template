from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.analytics import AnalyticsRecord
from app.schemas.analytics import AnalyticsRecordRead
from app.core.logging import logger

router = APIRouter()

@router.get("/analytics", response_model=List[AnalyticsRecordRead])
async def get_analytics_records(skip: int = 0, limit: int = 10, db: Session = Depends(get_session)) -> List[AnalyticsRecordRead]:
    """
    Retrieve a list of analytics records from the database.

    Args:
        skip (int): Number of records to skip for pagination. Default is 0.
        limit (int): Maximum number of records to return. Default is 10.
        db (Session): Database session dependency.

    Returns:
        List[AnalyticsRecordRead]: A list of analytics records.

    Raises:
        HTTPException: If there is an error retrieving the records.
    """
    try:
        query = select(AnalyticsRecord).offset(skip).limit(limit)
        results = db.exec(query).all()
        return results
    except Exception as e:
        logger.error(f"Error retrieving analytics records: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")