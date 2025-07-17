import pytest
import httpx
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import SQLModel, create_engine, Session
import pandas as pd

# Assuming the FastAPI app is defined in a module named 'main'
from main import app, get_async_session

# Create a TestClient for the FastAPI app
client = TestClient(app)

@pytest.fixture(scope="module")
def test_app():
    """
    Fixture to provide a test client for the FastAPI app.
    """
    return client

@pytest.fixture(scope="module")
def async_session() -> AsyncSession:
    """
    Fixture to provide an asynchronous session for database operations.
    """
    engine = create_engine("sqlite+aiosqlite:///:memory:", echo=True, future=True)
    SQLModel.metadata.create_all(engine)
    session = AsyncSession(engine)
    yield session
    await session.close()


def test_csv_upload(test_app):
    """
    Test the CSV upload functionality.
    """
    # Prepare a sample CSV file
    csv_content = """column1,column2,column3\nvalue1,value2,value3\nvalue4,value5,value6"""
    files = {'file': ('test.csv', csv_content, 'text/csv')}

    # Perform the upload request
    response = test_app.post("/upload-csv", files=files)

    # Assert the response status code
    assert response.status_code == 200

    # Assert the response contains the expected keys
    json_response = response.json()
    assert 'upload_id' in json_response
    assert 'file_metadata' in json_response
    assert 'preview_data' in json_response

    # Validate the file metadata
    file_metadata = json_response['file_metadata']
    assert file_metadata['filename'] == 'test.csv'
    assert file_metadata['size'] == len(csv_content)

    # Validate the preview data
    preview_data = json_response['preview_data']
    assert len(preview_data) == 2  # Two rows of data
    assert preview_data[0] == ['value1', 'value2', 'value3']
    assert preview_data[1] == ['value4', 'value5', 'value6']

    # Additional checks can be added for file size and type restrictions
