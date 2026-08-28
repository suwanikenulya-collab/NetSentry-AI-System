from fastapi import FastAPI

from app.api.routes.datasets import router as datasets_router


app = FastAPI(
    title="NetSentry AI API",
    description="Backend API for network traffic analysis and security alert management.",
    version="0.1.0",
)

app.include_router(datasets_router) #let main.py knows there is a dataset route 


@app.get("/api/v1/health", tags=["System"])
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "NetSentry AI API",
    }

#this file is the main entry point for the FastAPI application. It defines the app instance and a health check endpoint. The health check endpoint returns a JSON response indicating that the service is running correctly.