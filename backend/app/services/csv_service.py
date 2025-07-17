from fastapi import HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
import pandas as pd
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CSVService:
    """
    Service class for handling CSV file operations, including parsing, processing,
    and optionally saving data to the database.
    """

    def __init__(self, db_session: AsyncSession):
        """
        Initialize the CSVService with a database session.

        :param db_session: AsyncSession instance for database operations
        """
        self.db_session = db_session

    async def process_csv(self, file: UploadFile) -> dict:
        """
        Process the uploaded CSV file and return descriptive statistics.

        :param file: UploadedFile object containing the CSV data
        :return: Dictionary with descriptive statistics
        :raises HTTPException: If file processing fails
        """
        try:
            # Read the file into a pandas DataFrame
            contents = await file.read()
            df = pd.read_csv(io.BytesIO(contents))
            logger.info("CSV file successfully read into DataFrame.")

            # Calculate descriptive statistics
            stats = df.describe().to_dict()
            logger.info("Descriptive statistics calculated.")

            return stats
        except Exception as e:
            logger.error(f"Failed to process CSV file: {e}")
            raise HTTPException(status_code=400, detail="Failed to process CSV file.")

    async def save_to_database(self, df: pd.DataFrame, model: BaseModel) -> None:
        """
        Save the DataFrame to the database using the specified SQLModel.

        :param df: DataFrame containing the data to be saved
        :param model: SQLModel class representing the database table
        :raises HTTPException: If saving to the database fails
        """
        try:
            # Convert DataFrame to list of model instances
            records = df.to_dict(orient='records')
            instances = [model(**record) for record in records]

            # Add instances to the session and commit
            self.db_session.add_all(instances)
            await self.db_session.commit()
            logger.info("Data successfully saved to the database.")
        except Exception as e:
            logger.error(f"Failed to save data to the database: {e}")
            raise HTTPException(status_code=500, detail="Failed to save data to the database.")
