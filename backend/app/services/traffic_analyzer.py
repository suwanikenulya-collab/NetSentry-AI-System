import csv
from collections import Counter
from datetime import datetime
from io import StringIO
from typing import Literal

from app.schemas.traffic import (
    ProtocolCount,
    SourceIpActivity,
    TrafficRecord,
    TrafficSummaryResponse,
)


# A record needs at least this score to be anomalous.
ANOMALY_THRESHOLD = 50

# These services are commonly targeted during attacks.
SUSPICIOUS_DESTINATION_PORTS = {
    23,    # Telnet
    445,   # SMB
    3389,  # Remote Desktop
}


def detect_anomaly(
    protocol: str,
    destination_port: int,
    duration: float,
    packet_count: int,
    byte_count: int,
) -> tuple[
    int,
    Literal["normal", "anomalous"],
    list[str],
]:
    score = 0
    reasons: list[str] = []

    # Rule 1: Very large packet count.
    if packet_count >= 1000:
        score += 30
        reasons.append(
            "Unusually high packet count."
        )

    # Rule 2: Very large amount of transferred data.
    if byte_count >= 1_000_000:
        score += 30
        reasons.append(
            "Unusually high byte transfer."
        )

    # Rule 3: Very long connection.
    if duration >= 300:
        score += 20
        reasons.append(
            "Unusually long connection duration."
        )

    # Rule 4: Connection to a commonly attacked port.
    if destination_port in SUSPICIOUS_DESTINATION_PORTS:
        score += 20
        reasons.append(
            "Traffic targets a commonly abused service port."
        )

    # Rule 5: Large ICMP traffic can indicate ping flooding.
    if protocol == "ICMP" and packet_count >= 100:
        score += 30
        reasons.append(
            "High-volume ICMP traffic detected."
        )

    # The score must remain between 0 and 100.
    score = min(score, 100)

    status: Literal["normal", "anomalous"]

    if score >= ANOMALY_THRESHOLD:
        status = "anomalous"
    else:
        status = "normal"

    return score, status, reasons


def analyze_traffic(
    filename: str,
    content: bytes,
) -> TrafficSummaryResponse:
    text_content = content.decode("utf-8-sig")

    reader = csv.DictReader(
        StringIO(text_content)
    )

    rows = list(reader)

    if not rows:
        raise ValueError(
            "The dataset must contain at least one data row."
        )

    total_packets = 0
    total_bytes = 0
    total_duration = 0.0

    timestamps: list[datetime] = []
    records: list[TrafficRecord] = []

    protocol_counter: Counter[str] = Counter()
    source_ip_counter: Counter[str] = Counter()

    normal_connections = 0
    anomalous_connections = 0

    for row in rows:
        timestamp = datetime.fromisoformat(
            row["timestamp"].strip()
        )

        source_ip = row["src_ip"].strip()
        destination_ip = row["dst_ip"].strip()

        source_port = int(
            row["src_port"].strip()
        )
        destination_port = int(
            row["dst_port"].strip()
        )

        protocol = (
            row["protocol"]
            .strip()
            .upper()
        )

        duration = float(
            row["duration"].strip()
        )
        packet_count = int(
            row["pkt_count"].strip()
        )
        byte_count = int(
            row["bytes"].strip()
        )

        anomaly_score, status, reasons = (
            detect_anomaly(
                protocol=protocol,
                destination_port=destination_port,
                duration=duration,
                packet_count=packet_count,
                byte_count=byte_count,
            )
        )

        record = TrafficRecord(
            timestamp=timestamp,
            src_ip=source_ip,
            dst_ip=destination_ip,
            src_port=source_port,
            dst_port=destination_port,
            protocol=protocol,
            duration=duration,
            pkt_count=packet_count,
            bytes=byte_count,
            anomaly_score=anomaly_score,
            status=status,
            anomaly_reasons=reasons,
        )

        records.append(record)
        timestamps.append(timestamp)

        total_packets += packet_count
        total_bytes += byte_count
        total_duration += duration

        protocol_counter[protocol] += 1
        source_ip_counter[source_ip] += 1

        if status == "anomalous":
            anomalous_connections += 1
        else:
            normal_connections += 1

    total_connections = len(records)

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

    anomaly_rate_percentage = round(
        (
            anomalous_connections
            / total_connections
        ) * 100,
        2,
    )

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
        normal_connections=normal_connections,
        anomalous_connections=anomalous_connections,
        anomaly_rate_percentage=(
            anomaly_rate_percentage
        ),
        records=records,
    )