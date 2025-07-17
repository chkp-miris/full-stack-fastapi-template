from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from pydantic import BaseModel
from typing import List, Optional
import logging

# Initialize logger
logger = logging.getLogger(__name__)

# Define Pydantic models for request and response
class ChartRequest(BaseModel):
    chart_type: str
    columns: List[str]
    save_data: Optional[bool] = False

class ChartResponse(BaseModel):
    chart_url: str

# Define the service class
class InsightsService:
    """
    Service class for generating data insights and statistics.
    """

    def __init__(self, session: AsyncSession):
        self.session = session

    async def generate_chart(self, request: ChartRequest) -> ChartResponse:
        """
        Generate a chart based on the provided chart type and columns.

        :param request: ChartRequest object containing chart type and columns
        :return: ChartResponse object containing the URL of the generated chart
        """
        try:
            # Validate chart type
            if request.chart_type not in ['histogram', 'bar', 'line']:
                logger.error(f"Invalid chart type: {request.chart_type}")
                raise HTTPException(status_code=400, detail="Invalid chart type")

            # Fetch data from the database
            query = select(Item).where(Item.columns.in_(request.columns))
            result = await self.session.execute(query)
            data = result.fetchall()

            # Generate chart (placeholder for actual chart generation logic)
            chart_url = f"https://charts.example.com/{request.chart_type}/{request.columns}"

            # Optionally save data
            if request.save_data:
                # Placeholder for saving data logic
                logger.info("Data saved to the database")

            return ChartResponse(chart_url=chart_url)

        except Exception as e:
            logger.exception("Failed to generate chart")
            raise HTTPException(status_code=500, detail="Internal Server Error")

# FastAPI router
router = APIRouter()

@router.post("/generate-chart", response_model=ChartResponse)
async def generate_chart_endpoint(request: ChartRequest, session: AsyncSession = Depends()):
    """
    Endpoint to generate a chart based on user input.

    :param request: ChartRequest object containing chart type and columns
    :param session: Database session dependency
    :return: ChartResponse object containing the URL of the generated chart
    """
    service = InsightsService(session)
    return await service.generate_chart(request)