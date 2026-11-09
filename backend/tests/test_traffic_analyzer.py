from datetime import datetime

import pytest

from app.services.traffic_analyzer import analyze_traffic


CSV_HEADER = (
    "timestamp,src_ip,dst_ip,src_port,dst_port,"
    "protocol,duration,pkt_count,bytes\n"
)


def test_traffic_summary_is_calculated_correctly() -> None:
    content = (
        CSV_HEADER
        + "2026-10-18T10:00:00,"
        "192.168.1.10,"
        "203.0.113.20,"
        "51520,"
        "443,"
        "TCP,"
        "2.0,"
        "10,"
        "1000\n"
        + "2026-10-18T11:00:00,"
        "192.168.1.10,"
        "203.0.113.30,"
        "51521,"
        "53,"
        "UDP,"
        "4.0,"
        "20,"
        "2000\n"
        + "2026-10-18T12:00:00,"
        "192.168.1.20,"
        "203.0.113.40,"
        "51522,"
        "80,"
        "TCP,"
        "3.0,"
        "5,"
        "500\n"
    ).encode("utf-8")

    result = analyze_traffic(
        filename="network-traffic.csv",
        content=content,
    )

    assert result.filename == "network-traffic.csv"
    assert result.total_connections == 3
    assert result.total_packets == 35
    assert result.total_bytes == 3500
    assert result.average_duration_seconds == 3.0

    assert result.start_time == datetime.fromisoformat(
        "2026-10-18T10:00:00"
    )
    assert result.end_time == datetime.fromisoformat(
        "2026-10-18T12:00:00"
    )

    assert result.protocol_counts[0].protocol == "TCP"
    assert result.protocol_counts[0].connections == 2

    assert result.protocol_counts[1].protocol == "UDP"
    assert result.protocol_counts[1].connections == 1

    assert result.top_source_ips[0].ip_address == (
        "192.168.1.10"
    )
    assert result.top_source_ips[0].connections == 2

    assert result.normal_connections == 3
    assert result.anomalous_connections == 0
    assert result.anomaly_rate_percentage == 0

    assert len(result.records) == 3
    assert all(
        record.status == "normal"
        for record in result.records
    )


def test_high_volume_traffic_is_anomalous() -> None:
    content = (
        CSV_HEADER
        + "2026-10-18T13:00:00,"
        "192.168.1.50,"
        "203.0.113.50,"
        "52000,"
        "443,"
        "TCP,"
        "10.0,"
        "1500,"
        "2000000\n"
    ).encode("utf-8")

    result = analyze_traffic(
        filename="high-volume.csv",
        content=content,
    )

    record = result.records[0]

    assert record.status == "anomalous"
    assert record.anomaly_score == 60

    assert record.anomaly_reasons == [
        "Unusually high packet count.",
        "Unusually high byte transfer.",
    ]

    assert result.normal_connections == 0
    assert result.anomalous_connections == 1
    assert result.anomaly_rate_percentage == 100


def test_mixed_traffic_calculates_anomaly_rate() -> None:
    content = (
        CSV_HEADER
        + "2026-10-18T14:00:00,"
        "192.168.1.10,"
        "203.0.113.10,"
        "51520,"
        "443,"
        "TCP,"
        "2.0,"
        "10,"
        "1000\n"
        + "2026-10-18T14:05:00,"
        "192.168.1.99,"
        "203.0.113.99,"
        "51521,"
        "443,"
        "TCP,"
        "10.0,"
        "1500,"
        "2000000\n"
    ).encode("utf-8")

    result = analyze_traffic(
        filename="mixed-traffic.csv",
        content=content,
    )

    assert result.total_connections == 2
    assert result.normal_connections == 1
    assert result.anomalous_connections == 1
    assert result.anomaly_rate_percentage == 50

    assert result.records[0].status == "normal"
    assert result.records[1].status == "anomalous"


def test_empty_traffic_dataset_is_rejected() -> None:
    content = CSV_HEADER.encode("utf-8")

    with pytest.raises(
        ValueError,
        match="at least one data row",
    ):
        analyze_traffic(
            filename="empty.csv",
            content=content,
        )