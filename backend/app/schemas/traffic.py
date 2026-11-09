from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ProtocolCount(BaseModel):
    protocol: str
    connections: int = Field(ge=0)


class SourceIpActivity(BaseModel):
    ip_address: str
    connections: int = Field(ge=0)


class TrafficRecord(BaseModel):
    timestamp: datetime

    src_ip: str
    dst_ip: str

    src_port: int = Field(
        ge=0,
        le=65535,
    )
    dst_port: int = Field(
        ge=0,
        le=65535,
    )

    protocol: str
    duration: float = Field(ge=0)
    pkt_count: int = Field(ge=0)
    bytes: int = Field(ge=0)

    # Anomaly-detection results for this record.
    anomaly_score: int = Field(
        default=0,
        ge=0,
        le=100,
    )

    status: Literal[
        "normal",
        "anomalous",
    ] = "normal"

    anomaly_reasons: list[str] = Field(
        default_factory=list,
    )


class TrafficSummaryResponse(BaseModel):
    filename: str

    total_connections: int = Field(ge=0)
    total_packets: int = Field(ge=0)
    total_bytes: int = Field(ge=0)

    average_duration_seconds: float = Field(ge=0)

    start_time: datetime
    end_time: datetime

    protocol_counts: list[ProtocolCount]
    top_source_ips: list[SourceIpActivity]

    # Overall anomaly statistics.
    normal_connections: int = Field(
        default=0,
        ge=0,
    )

    anomalous_connections: int = Field(
        default=0,
        ge=0,
    )

    anomaly_rate_percentage: float = Field(
        default=0,
        ge=0,
        le=100,
    )

    records: list[TrafficRecord] = Field(
        default_factory=list,
    )