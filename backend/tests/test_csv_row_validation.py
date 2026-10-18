from app.schemas.dataset import DatasetValidationResponse
from app.services.csv_validator import validate_csv_structure
import csv
from datetime import datetime
from io import StringIO
from ipaddress import ip_address


# These are CSV column names that must exist.
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


# These are allowed values inside the protocol column.
ALLOWED_PROTOCOLS: frozenset[str] = frozenset(
    {
        "TCP",
        "UDP",
        "ICMP",
    }
)


def validate_csv_structure(
    filename: str,
    content: bytes,
) -> DatasetValidationResponse:
    # Check 1: The uploaded file must not be empty.
    if not content:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=0,
            detected_columns=[],
            missing_columns=list(REQUIRED_COLUMNS),
            message="The CSV file is empty.",
        )

    # Check 2: Convert uploaded bytes into UTF-8 text.
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

    # Check 3: Read the CSV content.
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
                    "The CSV file does not contain a header row."
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

        row_count = len(data_rows)

    except csv.Error:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=0,
            detected_columns=[],
            missing_columns=list(REQUIRED_COLUMNS),
            message="The file contains malformed CSV data.",
        )

    # Check 4: All required columns must exist.
    if missing_columns:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=row_count,
            detected_columns=detected_columns,
            missing_columns=missing_columns,
            message="The dataset is missing required columns.",
        )

    # Check 5: The CSV must contain at least one data row.
    if row_count == 0:
        return DatasetValidationResponse(
            filename=filename,
            is_valid=False,
            row_count=0,
            detected_columns=detected_columns,
            missing_columns=[],
            message=(
                "The dataset must contain at least one data row."
            ),
        )

    # Connect each column name to its position.
    column_indexes = {
        column: index
        for index, column in enumerate(detected_columns)
    }

    # Check 6: Validate every data row.
    for row in data_rows:
        source_ip_index = column_indexes["src_ip"]
        destination_ip_index = column_indexes["dst_ip"]

        source_ip = (
            row[source_ip_index]
            if source_ip_index < len(row)
            else ""
        )

        destination_ip = (
            row[destination_ip_index]
            if destination_ip_index < len(row)
            else ""
        )

        # Validate the source and destination IP addresses.
        try:
            ip_address(source_ip)
            ip_address(destination_ip)
        except ValueError:
            return DatasetValidationResponse(
                filename=filename,
                is_valid=False,
                row_count=row_count,
                detected_columns=detected_columns,
                missing_columns=[],
                message=(
                    "The dataset contains invalid row values."
                ),
            )

        source_port_index = column_indexes["src_port"]
        destination_port_index = column_indexes["dst_port"]

        source_port_text = (
            row[source_port_index]
            if source_port_index < len(row)
            else ""
        )

        destination_port_text = (
            row[destination_port_index]
            if destination_port_index < len(row)
            else ""
        )

        # Convert port text into integer numbers.
        try:
            source_port = int(source_port_text)
            destination_port = int(destination_port_text)
        except ValueError:
            return DatasetValidationResponse(
                filename=filename,
                is_valid=False,
                row_count=row_count,
                detected_columns=detected_columns,
                missing_columns=[],
                message=(
                    "The dataset contains invalid row values."
                ),
            )

        # Port numbers must remain within the 16-bit range.
        if not 0 <= source_port <= 65535:
            return DatasetValidationResponse(
                filename=filename,
                is_valid=False,
                row_count=row_count,
                detected_columns=detected_columns,
                missing_columns=[],
                message=(
                    "The dataset contains invalid row values."
                ),
            )

        if not 0 <= destination_port <= 65535:
            return DatasetValidationResponse(
                filename=filename,
                is_valid=False,
                row_count=row_count,
                detected_columns=detected_columns,
                missing_columns=[],
                message=(
                    "The dataset contains invalid row values."
                ),
            )

        protocol_index = column_indexes["protocol"]

        protocol = (
            row[protocol_index].upper()
            if protocol_index < len(row)
            else ""
        )

        # Validate the network protocol.
        if protocol not in ALLOWED_PROTOCOLS:
            return DatasetValidationResponse(
                filename=filename,
                is_valid=False,
                row_count=row_count,
                detected_columns=detected_columns,
                missing_columns=[],
                message=(
                    "The dataset contains invalid row values."
                ),
            )

        timestamp_index = column_indexes["timestamp"]

        timestamp = (
            row[timestamp_index]
            if timestamp_index < len(row)
            else ""
        )

        # Validate the ISO-formatted date and time.
        try:
            datetime.fromisoformat(timestamp)
        except ValueError:
            return DatasetValidationResponse(
                filename=filename,
                is_valid=False,
                row_count=row_count,
                detected_columns=detected_columns,
                missing_columns=[],
                message=(
                    "The dataset contains invalid row values."
                ),
            )

    # Every validation check passed.
    return DatasetValidationResponse(
        filename=filename,
        is_valid=True,
        row_count=row_count,
        detected_columns=detected_columns, 
        missing_columns=[],
        message="Dataset structure is valid.",
    )