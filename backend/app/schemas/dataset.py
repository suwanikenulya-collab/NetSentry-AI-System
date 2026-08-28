from pydantic import BaseModel, Field


class DatasetValidationResponse(BaseModel):
    filename: str
    is_valid: bool
    row_count: int = Field(ge=0)
    detected_columns: list[str]
    missing_columns: list[str]
    message: str

    #This is a Pydantic response model. It defines the API contract that FastAPI must return after validating a dataset.