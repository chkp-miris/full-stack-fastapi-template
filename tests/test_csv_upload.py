import pytest
import httpx
import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException
from sqlmodel import SQLModel, Session, create_engine
from pydantic import BaseModel

# Define a Pydantic model for CSV metadata
class CSVMetadata(BaseModel):
    upload_id: str
    file_name: str
    file_size: int
    mime_type: str
    preview_data: list

# Define a FastAPI app
app = FastAPI()

# Define a SQLModel for the Item table
class Item(SQLModel, table=True):
    id: int
    name: str
    description: str

# Define a test client using httpx
@pytest.fixture
async def test_client():
    async with httpx.AsyncClient(app=app, base_url="http://test") as client:
        yield client

# Test for CSV upload
@pytest.mark.asyncio
async def test_csv_upload(test_client):
    """
    Test the CSV upload functionality.
    """
    # Prepare a sample CSV file
    csv_content = "name,description\nItem1,Description1\nItem2,Description2"
    files = {'file': ('test.csv', csv_content, 'text/csv')}

    # Perform the upload
    response = await test_client.post("/upload-csv", files=files)

    # Assert the response status code
    assert response.status_code == 200

    # Assert the response content
    data = response.json()
    assert 'upload_id' in data
    assert data['file_name'] == 'test.csv'
    assert data['mime_type'] == 'text/csv'
    assert len(data['preview_data']) == 2

# Define the CSV upload endpoint
@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    """
    Endpoint to handle CSV file uploads.
    """
    # Validate file size and MIME type
    if file.content_type != 'text/csv':
        raise HTTPException(status_code=400, detail="Invalid file type")
    if file.spool_max_size > 1024 * 1024 * 5:  # 5 MB limit
        raise HTTPException(status_code=400, detail="File too large")

    # Read CSV file using pandas
    try:
        df = pd.read_csv(file.file)
    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Malformed CSV file")

    # Generate upload_id and preview data
    upload_id = "unique-upload-id"  # This should be generated dynamically
    preview_data = df.head().to_dict(orient='records')

    # Return metadata
    return CSVMetadata(
        upload_id=upload_id,
        file_name=file.filename,
        file_size=file.spool_max_size,
        mime_type=file.content_type,
        preview_data=preview_data
    ).dict()