import pandas as pd
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlmodel import SQLModel, Field
from typing import List, Optional
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Item(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    value: float

class CSVData(BaseModel):
    content: bytes

class CSVService:
    """
    Service class for processing CSV data.
    Provides functionality to parse CSV content, calculate descriptive statistics,
    and optionally save data to the database.
    """

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def process_csv(self, csv_data: CSVData, save_to_db: bool = False) -> dict:
        """
        Process the CSV data, calculate descriptive statistics, and optionally save to the database.

        :param csv_data: CSVData object containing the CSV file content.
        :param save_to_db: Boolean flag to determine if data should be saved to the database.
        :return: A dictionary containing descriptive statistics.
        """
        try:
            # Read CSV data into a DataFrame
            df = pd.read_csv(io.BytesIO(csv_data.content))
            logger.info("CSV data successfully read into DataFrame.")

            # Calculate descriptive statistics
            stats = df.describe().to_dict()
            logger.info("Descriptive statistics calculated.")

            # Optionally save data to the database
            if save_to_db:
                await self._save_to_database(df)

            return stats
        except Exception as e:
            logger.error(f"Error processing CSV data: {e}")
            raise

    async def _save_to_database(self, df: pd.DataFrame):
        """
        Save the DataFrame to the database.

        :param df: DataFrame containing the data to be saved.
        """
        try:
            items = [Item(name=row['name'], value=row['value']) for index, row in df.iterrows()]
            self.db_session.add_all(items)
            await self.db_session.commit()
            logger.info("Data successfully saved to the database.")
        except Exception as e:
            logger.error(f"Error saving data to the database: {e}")
            await self.db_session.rollback()
            raise