import { IngestionHealthSummary } from '../../lib/types';

export const MOCK_INGESTION_HEALTH: IngestionHealthSummary = {
  overall_status: 'OPERATIONAL',
  active_sources_count: 11,
  total_sources_count: 12,
  sources: [
    { source_id: 'gdelt-2.0', source_name: 'GDELT 2.0 Global NLP Feed', status: 'OPERATIONAL', latency_ms: 124, last_ingested_at: 'Just now', error_rate: 0.001 },
    { source_id: 'usgs-seismic', source_name: 'USGS Earthquake Telemetry', status: 'OPERATIONAL', latency_ms: 88, last_ingested_at: '1m ago', error_rate: 0.000 },
    { source_id: 'ais-vessel-tracker', source_name: 'Global AIS Vessel Telemetry', status: 'OPERATIONAL', latency_ms: 210, last_ingested_at: 'Just now', error_rate: 0.004 },
    { source_id: 'ofac-sanctions-api', source_name: 'US Treasury OFAC Sanctions Stream', status: 'OPERATIONAL', latency_ms: 340, last_ingested_at: '5m ago', error_rate: 0.000 },
    { source_id: 'subsea-cable-mon', source_name: 'Subsea Cable Fiber Telemetry', status: 'DEGRADED', latency_ms: 1850, last_ingested_at: '8m ago', error_rate: 0.048 },
    { source_id: 'incois-india-radar', source_name: 'INCOIS Coastal Maritime Radar', status: 'OPERATIONAL', latency_ms: 142, last_ingested_at: '2m ago', error_rate: 0.002 },
    { source_id: 'acled-conflict-db', source_name: 'ACLED Kinetic Event Stream', status: 'OPERATIONAL', latency_ms: 410, last_ingested_at: '3m ago', error_rate: 0.005 },
    { source_id: 'openfda-pharma', source_name: 'openFDA Supply Chain Monitor', status: 'OPERATIONAL', latency_ms: 290, last_ingested_at: '12m ago', error_rate: 0.000 },
    { source_id: 'platts-energy-ticker', source_name: 'Platts Freight & Energy Ticker', status: 'OPERATIONAL', latency_ms: 165, last_ingested_at: 'Just now', error_rate: 0.001 },
    { source_id: 'sentinel-2-imagery', source_name: 'Copernicus Sentinel-2 Optical', status: 'OPERATIONAL', latency_ms: 620, last_ingested_at: '15m ago', error_rate: 0.008 },
    { source_id: 'firm-satellite-fire', source_name: 'NASA FIRMS Thermal Anomaly', status: 'OPERATIONAL', latency_ms: 310, last_ingested_at: '4m ago', error_rate: 0.003 },
    { source_id: 'blacksea-ais-relay', source_name: 'Black Sea Transponder Relay', status: 'OFFLINE', latency_ms: 0, last_ingested_at: '2h ago', error_rate: 1.000 },
  ],
};
