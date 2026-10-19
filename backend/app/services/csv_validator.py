import csv
from datetime import datetime
from io import StringIO
from ipaddress import ip_address
from math import isfinite

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


ALLOWED_PROTOCOLS: frozenset[str] = frozenset(
    {
        "TCP",
        "UDP",
        "ICMP",
    }
)


def create_invalid_row_response(
    filename: str,
    row_count: int,
    detected_columns: list[str],
) -> DatasetValidationResponse:
    return DatasetValidationResponse(
        filename=filename,
        is_valid=False,
        row_count=row_count,
        detected_columns=detected_columns,
        missing_columns=[],
        message="The dataset contains invalid row values.",
    )


def validate_row_values(
    row: list[str],
    column_indexes: dict[str, int],
) -> bool:
    try:
        timestamp = row[column_indexes["timestamp"]]

        source_ip = row[column_indexes["src_ip"]]
        destination_ip = row[column_indexes["dst_ip"]]

        source_port = int(
            row[column_indexes["src_port"]]
        )
        destination_port = int(
            row[column_indexes["dst_port"]]
        )

        protocol = row[
            column_indexes["protocol"]
        ].upper()

        duration = float(
            row[column_indexes["duration"]]
        )

        packet_count = int(
            row[column_indexes["pkt_count"]]
        )

        byte_count = int(
            row[column_indexes["bytes"]]
        )

        datetime.fromisoformat(
            timestamp.replace("Z", "+00:00")
        )

        ip_address(source_ip)
        ip_address(destination_ip)

    except (ValueError, IndexError):
        return False

    if not 0 <= source_port <= 65535:
        return False

    if not 0 <= destination_port <= 65535:
        return False

    if protocol not in ALLOWED_PROTOCOLS:
        return False

    if not isfinite(duration) or duration < 0:
        return False

    if packet_count < 0:
        return False

    if byte_count < 0:
        return False

    return True


def validate_csv_structure(
    filename: str,
    content: bytes,
) -> DatasetValidationResponse:
    # Check 1: The uploaded file must contain data.
    if not content:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=0,
            detected_columns=[],
            missing_columns=list(REQUIRED_COLUMNS),
            message="The CSV file is empty.",
        )

    # Check 2: Convert the uploaded bytes into text.
    try:
        text_content = content.decode("utf-8-sig")

    except UnicodeDecodeError:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=0,
            detected_columns=[],
            missing_columns=list(REQUIRED_COLUMNS),
            message=(
                "The CSV file must use UTF-8 text encoding."
            ),
        )

    # Check 3: Read the CSV structure.
    try:
        reader = csv.reader(
            StringIO(text_content),
            strict=True,
        )

        header = next(reader, None)

        if header is None:
            return DatasetValidationResponse(
                filename=filename,
                is_valid=False,
                row_count=0,
                detected_columns=[],
                missing_columns=list(REQUIRED_COLUMNS),
                message=(
                    "The CSV file does not contain "
                    "a header row."
                ),
            )

        detected_columns = [
            column.strip().lower()
            for column in header
        ]

        missing_columns = [
            required_column
            for required_column in REQUIRED_COLUMNS
            if required_column not in detected_columns
        ]

        data_rows = [
            [cell.strip() for cell in row]
            for row in reader
            if any(cell.strip() for cell in row)
        ]

    except csv.Error:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=0,
            detected_columns=[],
            missing_columns=list(REQUIRED_COLUMNS),
            message=(
                "The file contains malformed CSV data."
            ),
        )

    row_count = len(data_rows)

    # Check 4: Required columns must be present.
    if missing_columns:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=row_count,
            detected_columns=detected_columns,
            missing_columns=missing_columns,
            message=(
                "The dataset is missing required columns."
            ),
        )

    # Check 5: At least one data row is required.
    if row_count == 0:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=0,
            detected_columns=detected_columns,
            missing_columns=[],
            message=(
                "The dataset must contain at least "
                "one data row."
            ),
        )

    column_indexes = {
        column: index
        for index, column in enumerate(
            detected_columns
        )
    }

    # Check 6: Validate every CSV row.
    for row in data_rows:
        if len(row) != len(detected_columns):
            return create_invalid_row_response(
                filename=filename,
                row_count=row_count,
                detected_columns=detected_columns,
            )

        if not validate_row_values(
            row=row,
            column_indexes=column_indexes,
        ):
            return create_invalid_row_response(
                filename=filename,
                row_count=row_count,
                detected_columns=detected_columns,
            )

    # Every check passed.
    return DatasetValidationResponse(
        filename=filename,
        is_valid=True,
        row_count=row_count,
        detected_columns=detected_columns,
        missing_columns=[],
        message="Dataset structure is valid.",
    )