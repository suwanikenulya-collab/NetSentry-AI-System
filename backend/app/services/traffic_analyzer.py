import csv
from collections import Counter
from datetime import datetime
from io import StringIO

from app.schemas.traffic import (
    ProtocolCount,
    SourceIpActivity,
    TrafficRecord,
    TrafficSummaryResponse,
)


def analyze_traffic(
    filename: str,
    content: bytes,
) -> TrafficSummaryResponse:
    text = content.decode("utf-8-sig")

    reader = csv.DictReader(StringIO(text))
    rows = list(reader)

    if not rows:
        raise ValueError(
            "The dataset must contain at least one data row."
        )

    records: list[TrafficRecord] = []

    # Convert every CSV row into a TrafficRecord.
    for row in rows:
        record = TrafficRecord(
            timestamp=datetime.fromisoformat(
                row["timestamp"].strip()
            ),
            src_ip=row["src_ip"].strip(),
            dst_ip=row["dst_ip"].strip(),
            src_port=int(row["src_port"]),
            dst_port=int(row["dst_port"]),
            protocol=row["protocol"].strip().upper(),
            duration=float(row["duration"]),
            pkt_count=int(row["pkt_count"]),
            bytes=int(row["bytes"]),
        )

        records.append(record)

    # Calculate basic totals.
    total_connections = len(records)

    total_packets = sum(
        record.pkt_count for record in records
    )

    total_bytes = sum(
        record.bytes for record in records
    )

    average_duration = sum(
        record.duration for record in records
    ) / total_connections

    timestamps = [
        record.timestamp for record in records
    ]

    # Count the different protocols.
    protocol_counter = Counter(
        record.protocol for record in records
    )

    protocol_counts = [
        ProtocolCount(
            protocol=protocol,
            connections=connections,
        )
        for protocol, connections
        in sorted(protocol_counter.items())
    ]

    # Find the five most active source IP addresses.
    source_ip_counter = Counter(
        record.src_ip for record in records
    )

    top_source_ips = [
        SourceIpActivity(
            ip_address=ip_address,
            connections=connections,
        )
        for ip_address, connections
        in source_ip_counter.most_common(5)
    ]

    return TrafficSummaryResponse(
        filename=filename,
        total_connections=total_connections,
        total_packets=total_packets,
        total_bytes=total_bytes,
        average_duration_seconds=average_duration,
        start_time=min(timestamps),
        end_time=max(timestamps),
        protocol_counts=protocol_counts,
        top_source_ips=top_source_ips,
        records=records,
    )
def test_traffic_records_are_returned() -> None:
    content = (
        "timestamp,src_ip,dst_ip,src_port,dst_port,"
        "protocol,duration,pkt_count,bytes\n"
        "2026-09-06T10:30:00,192.168.1.10,"
        "203.0.113.20,51520,443,TCP,2.45,18,14560\n"
    ).encode("utf-8")

    result = analyze_traffic(
        filename="traffic.csv",
        content=content,
    )

    assert len(result.records) == 1

    record = result.records[0]

    assert record.src_ip == "192.168.1.10"
    assert record.dst_ip == "203.0.113.20"
    assert record.src_port == 51520
    assert record.dst_port == 443
    assert record.protocol == "TCP"
    assert record.duration == 2.45
    assert record.pkt_count == 18
    assert record.bytes == 14560