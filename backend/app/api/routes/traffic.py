from pathlib import Path
from typing import Annotated

from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile,
    status,
)

from app.schemas.traffic import TrafficSummaryResponse
from app.services.csv_validator import validate_csv_structure
from app.services.traffic_analyzer import analyze_traffic


MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024


router = APIRouter(
    prefix="/api/v1/traffic",
    tags=["Traffic Analysis"],
)


@router.post(
    "/analyze",
    response_model=TrafficSummaryResponse,
)
async def analyze_traffic_dataset(
    file: Annotated[
        UploadFile,
        File(description="Validated network traffic CSV"),
    ],
) -> TrafficSummaryResponse:
    filename = Path(file.filename or "").name

    if Path(filename).suffix.lower() != ".csv":
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only CSV files are supported.",
        )

    try:
        content = await file.read(MAX_FILE_SIZE_BYTES + 1)
    finally:
        await file.close()

    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="The CSV file must not exceed 50 MB.",
        )

    validation_result = validate_csv_structure(
        filename=filename,
        content=content,
    )

    if not validation_result.is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=validation_result.message,
        )

    try:
        return analyze_traffic(
            filename=filename,
            content=content,
        )
    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The dataset could not be analyzed.",
        )