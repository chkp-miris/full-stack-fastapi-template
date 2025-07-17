from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import pandas as pd
import io
import logging

from app.core.deps import get_db
from app.models.item import Item
from app.schemas.item import ItemCreate

logger = logging.getLogger(__name__)
router = APIRouter()

class CSVUploadResponse(BaseModel):
    upload_id: str
    preview: dict
    metadata: dict

@router.post("/upload-csv/", response_model=CSVUploadResponse)
async def upload_csv(
    file: UploadFile = File(..., description="CSV file to upload"),
    db: Session = Depends(get_db)
) -> CSVUploadResponse:
    """
    Endpoint to upload and process a CSV file.

    Validates the file type and size, processes the CSV using pandas,
    and returns a preview of the data along with metadata.
    """
    # Validate file type
    if file.content_type != 'text/csv':
        logger.warning(f"Invalid file type: {file.content_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only CSV files are allowed."
        )

    # Validate file size (e.g., max 10MB)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        logger.warning("File size exceeds the limit of 10MB")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the limit of 10MB."
        )

    # Process CSV file
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')), nrows=5)
        metadata = {
            "columns": df.columns.tolist(),
            "row_count": len(df)
        }
        preview = df.to_dict(orient='records')
    except Exception as e:
        logger.error(f"Error processing CSV file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process CSV file."
        )

    # Generate a unique upload ID (for demonstration purposes, using a simple counter)
    upload_id = f"upload_{len(preview)}"

    # Optionally save data to the database
    # for record in preview:
    #     item = ItemCreate(**record)
    #     db_item = Item(**item.dict())
    #     db.add(db_item)
    # db.commit()

    return CSVUploadResponse(upload_id=upload_id, preview=preview, metadata=metadata)