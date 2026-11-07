#The traffic-records API will take the valid CSV data and make its individual network connections available to the frontend.

from datetime import datetime

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

    records: list[TrafficRecord] = Field(
        default_factory=list,
    )