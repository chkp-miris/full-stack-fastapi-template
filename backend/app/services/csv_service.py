from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlmodel import SQLModel, Field
import pandas as pd
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the SQLModel for the Item table
class Item(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    description: str

# Define the Pydantic model for CSV data
class CSVData(BaseModel):
    name: str
    description: str

# Initialize FastAPI router
router = APIRouter()

@router.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...), session: AsyncSession = None):
    """
    Endpoint to upload a CSV file, process it, and optionally save data to the database.

    :param file: CSV file to be uploaded
    :param session: Database session for saving data
    :return: Descriptive statistics of the CSV data
    """
    try:
        # Read CSV file into a pandas DataFrame
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))

        # Calculate descriptive statistics
        stats = df.describe().to_dict()

        # Optionally save data to the database
        if session:
            for index, row in df.iterrows():
                item = Item(name=row['name'], description=row['description'])
                session.add(item)
            await session.commit()

        return {"statistics": stats}

    except Exception as e:
        logger.error(f"Error processing CSV file: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Example unit test
async def test_upload_csv():
    from fastapi.testclient import TestClient
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
    from sqlalchemy.orm import sessionmaker

    # Create a test database engine
    DATABASE_URL = "sqlite+aiosqlite:///./test.db"
    engine = create_async_engine(DATABASE_URL, echo=True)
    async_session = sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    # Initialize FastAPI app and client
    app = FastAPI()
    app.include_router(router)
    client = TestClient(app)

    # Test CSV upload
    with open("test.csv", "rb") as f:
        response = client.post("/upload-csv/", files={"file": f})
    assert response.status_code == 200
    assert "statistics" in response.json()