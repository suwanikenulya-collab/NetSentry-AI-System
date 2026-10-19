import csv
from collections import Counter
from datetime import datetime
from io import StringIO

from app.schemas.traffic import (
    ProtocolCount,
    SourceIpActivity,
    TrafficSummaryResponse,
)


def analyze_traffic(
    filename: str,
    content: bytes,
) -> TrafficSummaryResponse:
    text_content = content.decode("utf-8-sig")

    reader = csv.DictReader(StringIO(text_content))
    rows = list(reader)

    if not rows:
        raise ValueError(
            "The dataset must contain at least one data row."
        )

    total_packets = 0
    total_bytes = 0
    total_duration = 0.0

    timestamps: list[datetime] = []
    protocol_counter: Counter[str] = Counter()
    source_ip_counter: Counter[str] = Counter()

    for row in rows:
        timestamp = datetime.fromisoformat(
            row["timestamp"].strip()
        )
        protocol = row["protocol"].strip().upper()
        source_ip = row["src_ip"].strip()

        packet_count = int(row["pkt_count"])
        byte_count = int(row["bytes"])
        duration = float(row["duration"])

        timestamps.append(timestamp)

        total_packets += packet_count
        total_bytes += byte_count
        total_duration += duration

        protocol_counter[protocol] += 1
        source_ip_counter[source_ip] += 1

    protocol_counts = [
        ProtocolCount(
            protocol=protocol,
            connections=connections,
        )
        for protocol, connections
        in sorted(protocol_counter.items())
    ]

    top_source_ips = [
        SourceIpActivity(
            ip_address=ip_address,
            connections=connections,
        )
        for ip_address, connections
        in source_ip_counter.most_common(5)
    ]

    total_connections = len(rows)

    return TrafficSummaryResponse(
        filename=filename,
        total_connections=total_connections,
        total_packets=total_packets,
        total_bytes=total_bytes,
        average_duration_seconds=(
            total_duration / total_connections
        ),
        start_time=min(timestamps),
        end_time=max(timestamps),
        protocol_counts=protocol_counts,
        top_source_ips=top_source_ips,
    )