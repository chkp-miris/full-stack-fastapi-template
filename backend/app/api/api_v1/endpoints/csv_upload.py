from fastapi import APIRouter, UploadFile, File, HTTPException, status
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
    preview_data: dict
    file_metadata: dict

@router.post("/csv/upload", response_model=CSVUploadResponse)
async def upload_csv(
    file: UploadFile = File(..., description="CSV file to upload"),
    db: Session = Depends(get_db)
) -> CSVUploadResponse:
    """
    Endpoint to upload and process a CSV file.
    Validates the file type and size, parses the CSV, and returns metadata and preview data.
    """
    if file.content_type != 'text/csv':
        logger.warning(f"Invalid file type: {file.content_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only CSV files are allowed."
        )

    try:
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:  # 10 MB limit
            logger.warning("File size exceeds limit")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds the limit of 10 MB."
            )

        # Use pandas to read the CSV file
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')), nrows=5)
        preview_data = df.to_dict(orient='records')
        file_metadata = {
            "filename": file.filename,
            "size": len(contents),
            "columns": df.columns.tolist()
        }

        # Generate a unique upload ID (for demonstration purposes, using filename)
        upload_id = file.filename

        logger.info(f"CSV file '{file.filename}' uploaded successfully")
        return CSVUploadResponse(upload_id=upload_id, preview_data=preview_data, file_metadata=file_metadata)

    except pd.errors.ParserError as e:
        logger.error(f"Failed to parse CSV file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to parse CSV file. Ensure it is well-formed."
        )
    except Exception as e:
        logger.error(f"Unexpected error during CSV upload: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during CSV upload."
        )