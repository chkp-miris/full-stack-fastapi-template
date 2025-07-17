from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from pydantic import BaseModel
import logging

# Initialize logging
logger = logging.getLogger(__name__)

# Define the router
router = APIRouter()

# Define Pydantic models
class ChartRequest(BaseModel):
    chart_type: str
    columns: list[str]

class InsightsService:
    """
    Service class for generating data insights and statistics.
    """

    def __init__(self, session: AsyncSession):
        self.session = session

    async def generate_statistics(self, data: list[dict]) -> dict:
        """
        Calculate and return descriptive statistics for the given data.

        :param data: List of dictionaries containing data.
        :return: Dictionary containing statistics.
        """
        try:
            # Example statistics calculation
            statistics = {
                "count": len(data),
                "mean": sum(item['value'] for item in data) / len(data) if data else 0,
                "max": max(item['value'] for item in data) if data else None,
                "min": min(item['value'] for item in data) if data else None,
            }
            logger.info("Statistics generated successfully.")
            return statistics
        except Exception as e:
            logger.error(f"Error generating statistics: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

    async def generate_chart(self, chart_request: ChartRequest) -> dict:
        """
        Generate a chart based on the specified type and columns.

        :param chart_request: ChartRequest object containing chart type and columns.
        :return: Dictionary containing chart data.
        """
        try:
            # Example chart generation logic
            chart_data = {
                "chart_type": chart_request.chart_type,
                "data": [
                    {"column": column, "values": [1, 2, 3]} for column in chart_request.columns
                ]
            }
            logger.info("Chart generated successfully.")
            return chart_data
        except Exception as e:
            logger.error(f"Error generating chart: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

# Define API endpoints
@router.post("/generate-statistics")
async def generate_statistics_endpoint(data: list[dict], session: AsyncSession = Depends()) -> dict:
    """
    Endpoint to generate statistics from provided data.

    :param data: List of dictionaries containing data.
    :param session: Database session dependency.
    :return: Dictionary containing statistics.
    """
    service = InsightsService(session)
    return await service.generate_statistics(data)

@router.post("/generate-chart")
async def generate_chart_endpoint(chart_request: ChartRequest, session: AsyncSession = Depends()) -> dict:
    """
    Endpoint to generate a chart based on user request.

    :param chart_request: ChartRequest object containing chart type and columns.
    :param session: Database session dependency.
    :return: Dictionary containing chart data.
    """
    service = InsightsService(session)
    return await service.generate_chart(chart_request)