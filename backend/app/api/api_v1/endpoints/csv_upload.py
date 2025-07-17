from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
import io
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class CSVUploadResponse(BaseModel):
    upload_id: str
    preview_data: dict
    metadata: dict

@router.post("/upload_csv/", response_model=CSVUploadResponse)
async def upload_csv(file: UploadFile = File(...)) -> CSVUploadResponse:
    """
    Endpoint to handle CSV file uploads.

    Validates the file type and size, parses the CSV using pandas,
    and returns file metadata and preview data.
    """
    if file.content_type != 'text/csv':
        logger.warning("Invalid file type: %s", file.content_type)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only CSV files are allowed."
        )

    if file.size > 10 * 1024 * 1024:  # 10 MB limit
        logger.warning("File size exceeds limit: %d bytes", file.size)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds limit of 10 MB."
        )

    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content), nrows=5)  # Read first 5 rows for preview
        metadata = {
            "columns": df.columns.tolist(),
            "num_rows": len(df)
        }
        preview_data = df.to_dict(orient='records')
        upload_id = "some_unique_id"  # Generate a unique ID for the upload
        logger.info("CSV file uploaded successfully with ID: %s", upload_id)
        return CSVUploadResponse(upload_id=upload_id, preview_data=preview_data, metadata=metadata)
    except pd.errors.EmptyDataError:
        logger.error("Uploaded CSV file is empty")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded CSV file is empty."
        )
    except pd.errors.ParserError:
        logger.error("Failed to parse CSV file")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to parse CSV file. Ensure it is well-formed."
        )
    except Exception as e:
        logger.error("Unexpected error during CSV upload: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected error during CSV upload.")