from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check_returns_ok() -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "NetSentry AI API",
    }
    
    #pytest starts the test
       # ↓
#TestClient sends GET /api/v1/health
       # ↓
#FastAPI runs health_check()
       # ↓
#FastAPI returns the response
       # ↓
#assert checks status code and JSON
        #↓
#pytest reports PASSED or FAILED 