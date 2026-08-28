from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


VALID_CSV = """timestamp,src_ip,dst_ip,src_port,dst_port,protocol,duration,pkt_count,bytes
2026-08-28T10:00:00,192.168.1.10,203.0.113.20,51520,443,TCP,2.45,18,14560
2026-08-28T10:01:00,192.168.1.15,198.51.100.12,53110,53,UDP,0.08,2,256
"""


INVALID_CSV = """timestamp,src_ip,dst_ip,protocol
2026-08-28T10:00:00,192.168.1.10,203.0.113.20,TCP
"""


def test_valid_csv_is_accepted() -> None:
    response = client.post(
        "/api/v1/datasets/validate",
        files={
            "file": (
                "valid-network-traffic.csv",
                VALID_CSV.encode("utf-8"),
                "text/csv",
            )
        },
    )

    assert response.status_code == 200

    response_body = response.json()

    assert response_body["is_valid"] is True
    assert response_body["row_count"] == 2
    assert response_body["missing_columns"] == []
    assert response_body["message"] == "Dataset structure is valid."


def test_csv_with_missing_columns_is_rejected() -> None:
    response = client.post(
        "/api/v1/datasets/validate",
        files={
            "file": (
                "invalid-network-traffic.csv",
                INVALID_CSV.encode("utf-8"),
                "text/csv",
            )
        },
    )

    assert response.status_code == 200

    response_body = response.json()

    assert response_body["is_valid"] is False
    assert response_body["missing_columns"] == [
        "src_port",
        "dst_port",
        "duration",
        "pkt_count",
        "bytes",
    ]


def test_non_csv_file_returns_unsupported_media_type() -> None:
    response = client.post(
        "/api/v1/datasets/validate",
        files={
            "file": (
                "network-traffic.txt",
                b"ordinary text",
                "text/plain",
            )
        },
    )

    assert response.status_code == 415
    assert response.json() == {
        "detail": "Only CSV files are supported."
    }


def test_empty_csv_is_rejected() -> None:
    response = client.post(
        "/api/v1/datasets/validate",
        files={
            "file": (
                "empty.csv",
                b"",
                "text/csv",
            )
        },
    )

    assert response.status_code == 200

    response_body = response.json()

    assert response_body["is_valid"] is False
    assert response_body["row_count"] == 0
    assert response_body["message"] == "The CSV file is empty."