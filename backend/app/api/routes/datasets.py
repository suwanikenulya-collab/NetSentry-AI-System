from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.schemas.dataset import DatasetValidationResponse
from ...services.csv_validator import validate_csv_structure


MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024


router = APIRouter(
    prefix="/api/v1/datasets",
    tags=["Datasets"],
)


@router.post(
    "/validate",
    response_model=DatasetValidationResponse,
)
async def validate_dataset(
    file: Annotated[
        UploadFile,
        File(description="CSV network traffic dataset"),
    ],
) -> DatasetValidationResponse:
    filename = Path(file.filename or "").name

    try:
        if Path(filename).suffix.lower() != ".csv":
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Only CSV files are supported.",
            )

        content = await file.read(MAX_FILE_SIZE_BYTES + 1)

    finally:
        await file.close()

    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="The CSV file must not exceed 50 MB.",
        )

    return validate_csv_structure(
        filename=filename,
        content=content,
    )