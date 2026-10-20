export interface ProtocolCount {
  protocol: string;
  connections: number;
}

export interface SourceIpActivity {
  ip_address: string;
  connections: number;
}

export interface TrafficSummaryResponse {
  filename: string;

  total_connections: number;
  total_packets: number;
  total_bytes: number;

  average_duration_seconds: number;

  start_time: string;
  end_time: string;

  protocol_counts: ProtocolCount[];
  top_source_ips: SourceIpActivity[];
}
