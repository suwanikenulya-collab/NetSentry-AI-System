from fastapi import FastAPI


app = FastAPI(
    title="NetSentry AI API",
    description="Backend API for network traffic analysis and security alert management.",
    version="0.1.0",
)


@app.get("/api/v1/health", tags=["System"])
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "NetSentry AI API",
    }