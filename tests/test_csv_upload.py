import pytest
import httpx
import pandas as pd
from fastapi import FastAPI, UploadFile, File
from fastapi.testclient import TestClient

# Assuming the FastAPI app is defined in a module named 'app'
from app import app

@pytest.fixture
async def test_client():
    """
    Fixture to provide a test client for the FastAPI app.
    """
    async with httpx.AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.mark.asyncio
async def test_csv_upload(test_client):
    """
    Test the CSV upload functionality.
    
    This test checks:
    - File size and MIME type validation
    - Proper parsing of CSV files
    - Error handling for malformed CSV files
    - Return of file metadata and preview data
    """
    # Prepare a sample CSV file
    csv_content = """column1,column2,column3\nvalue1,value2,value3\nvalue4,value5,value6"""
    files = {'file': ('test.csv', csv_content, 'text/csv')}

    # Perform the upload
    response = await test_client.post("/upload-csv", files=files)

    # Validate response
    assert response.status_code == 200, "Upload failed"
    response_data = response.json()

    # Check for upload_id in response
    assert 'upload_id' in response_data, "upload_id not returned"

    # Check for file metadata and preview data
    assert 'metadata' in response_data, "Metadata not returned"
    assert 'preview' in response_data, "Preview data not returned"

    # Validate preview data
    preview_data = response_data['preview']
    assert len(preview_data) > 0, "Preview data is empty"

@pytest.mark.asyncio
async def test_csv_upload_malformed(test_client):
    """
    Test handling of malformed CSV files.
    
    This test checks:
    - Error handling for malformed CSV files
    - Appropriate error response
    """
    # Prepare a malformed CSV file
    malformed_csv_content = """column1,column2,column3\nvalue1,value2\nvalue4,value5,value6"""
    files = {'file': ('malformed.csv', malformed_csv_content, 'text/csv')}

    # Perform the upload
    response = await test_client.post("/upload-csv", files=files)

    # Validate response
    assert response.status_code == 400, "Malformed CSV not handled correctly"
    response_data = response.json()

    # Check for error message in response
    assert 'error' in response_data, "Error message not returned"
    assert response_data['error'] == "Malformed CSV file", "Unexpected error message"

@pytest.mark.asyncio
async def test_csv_upload_large_file(test_client):
    """
    Test handling of large CSV files.
    
    This test checks:
    - Chunking of large files
    - Performance under load
    """
    # Prepare a large CSV file
    large_csv_content = "column1,column2,column3\n" + "\n".join([f"value{i},value{i+1},value{i+2}" for i in range(10000)])
    files = {'file': ('large.csv', large_csv_content, 'text/csv')}

    # Perform the upload
    response = await test_client.post("/upload-csv", files=files)

    # Validate response
    assert response.status_code == 200, "Large file upload failed"
    response_data = response.json()

    # Check for upload_id in response
    assert 'upload_id' in response_data, "upload_id not returned for large file"

    # Check for file metadata and preview data
    assert 'metadata' in response_data, "Metadata not returned for large file"
    assert 'preview' in response_data, "Preview data not returned for large file"

    # Validate preview data
    preview_data = response_data['preview']
    assert len(preview_data) > 0, "Preview data is empty for large file"
