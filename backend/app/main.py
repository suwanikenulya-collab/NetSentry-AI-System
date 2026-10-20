from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware #import the CORSMiddleware class from the fastapi.middleware.cors module. This middleware is used to handle Cross-Origin Resource Sharing (CORS) in FastAPI applications.

from app.api.routes.datasets import router as datasets_router
from app.api.routes.traffic import router as traffic_router


app = FastAPI(
    title="NetSentry AI API",
    description=(
        "Backend API for network traffic analysis "
        "and security alert management."
    ),
    version="0.1.0",
)


# React development-server addresses allowed to call FastAPI.
FRONTEND_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]


# Give the permitted React origins access to this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register the dataset and traffic-analysis endpoints.
app.include_router(datasets_router)
app.include_router(traffic_router)


@app.get("/api/v1/health", tags=["System"])
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "NetSentry AI API",
    }

