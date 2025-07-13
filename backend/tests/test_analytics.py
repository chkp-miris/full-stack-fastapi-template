import pytest
from httpx import AsyncClient
from main import app  # Assuming the FastAPI app is defined in main.py

@pytest.mark.asyncio
async def test_get_analytics():
    """
    Test the GET /analytics endpoint.

    This test ensures that the analytics endpoint returns a 200 status code
    and the expected JSON response structure.
    """
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.get("/analytics")

    assert response.status_code == 200, "Expected status code 200"
    assert "data" in response.json(), "Response JSON should contain 'data' key"
    assert isinstance(response.json()["data"], list), "'data' key should contain a list"

@pytest.mark.asyncio
async def test_post_analytics():
    """
    Test the POST /analytics endpoint.

    This test ensures that the analytics endpoint accepts valid input data,
    processes it correctly, and returns the expected response.
    """
    payload = {
        "metric": "page_views",
        "value": 123,
        "timestamp": "2023-01-01T12:00:00Z"
    }

    async with AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.post("/analytics", json=payload)

    assert response.status_code == 201, "Expected status code 201"
    assert "id" in response.json(), "Response JSON should contain 'id' key"
    assert isinstance(response.json()["id"], int), "'id' key should be an integer"

@pytest.mark.asyncio
async def test_post_analytics_invalid_data():
    """
    Test the POST /analytics endpoint with invalid data.

    This test ensures that the endpoint returns a 422 status code
    when invalid data is provided.
    """
    payload = {
        "metric": "page_views",
        "value": "invalid_value",  # Invalid type for 'value'
        "timestamp": "not_a_timestamp"  # Invalid timestamp format
    }

    async with AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.post("/analytics", json=payload)

    assert response.status_code == 422, "Expected status code 422 for invalid data"
    assert "detail" in response.json(), "Response JSON should contain 'detail' key"