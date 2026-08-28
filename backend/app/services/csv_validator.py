import csv
from io import StringIO

try:
    from ..schemas.dataset import DatasetValidationResponse
except ImportError:  # pragma: no cover - fallback for direct script execution
    from app.schemas.dataset import DatasetValidationResponse


REQUIRED_COLUMNS: tuple[str, ...] = (
    "timestamp",
    "src_ip",
    "dst_ip",
    "src_port",
    "dst_port",
    "protocol",
    "duration",
    "pkt_count",
    "bytes",
)


def validate_csv_structure(
    filename: str,
    content: bytes,
) -> DatasetValidationResponse:
    if not content:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=0,
            detected_columns=[],
            missing_columns=list(REQUIRED_COLUMNS),
            message="The CSV file is empty.",
        )

    try:
        text_content = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=0,
            detected_columns=[],
            missing_columns=list(REQUIRED_COLUMNS),
            message="The CSV file must use UTF-8 text encoding.",
        )

    try:
        reader = csv.reader(StringIO(text_content), strict=True)
        header = next(reader, None)

        if header is None:
            return DatasetValidationResponse(
                filename=filename,
                is_valid=False,
                row_count=0,
                detected_columns=[],
                missing_columns=list(REQUIRED_COLUMNS),
                message="The CSV file does not contain a header row.",
            )

        detected_columns = [column.strip() for column in header]

        missing_columns = [
            column
            for column in REQUIRED_COLUMNS
            if column not in detected_columns
        ]

        row_count = sum(
            1
            for row in reader
            if any(cell.strip() for cell in row)
        )

    except csv.Error:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=0,
            detected_columns=[],
            missing_columns=list(REQUIRED_COLUMNS),
            message="The file contains malformed CSV data.",
        )

    if missing_columns:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=row_count,
            detected_columns=detected_columns,
            missing_columns=missing_columns,
            message="The dataset is missing required columns.",
        )

    if row_count == 0:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=0,
            detected_columns=detected_columns,
            missing_columns=[],
            message="The dataset must contain at least one data row.",
        )

    return DatasetValidationResponse(
        filename=filename,
        is_valid=True,
        row_count=row_count,
        detected_columns=detected_columns,
        missing_columns=[],
        message="Dataset structure is valid.",
    )