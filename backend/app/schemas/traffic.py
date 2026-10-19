from datetime import datetime

from pydantic import BaseModel, Field


class ProtocolCount(BaseModel):
    protocol: str
    connections: int = Field(ge=0)


class SourceIpActivity(BaseModel):
    ip_address: str
    connections: int = Field(ge=0)


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