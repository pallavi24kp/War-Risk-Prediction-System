// TypeScript Interfaces matching Backend API Spec

// 1. CII & ML Diagnostics
export interface CountryFeatureSnapshot {
  trade_concentration: number;
  goldstein_scale: number;
  tone_norm: number;
  kinetic_event_density: number;
  subsea_proximity: number;
  sanction_intensity: number;
  [key: string]: number;
}

export interface CountryInstabilityEntry {
  country_code: string; // e.g. "YEM", "UKR", "IND"
  country_name: string;
  flag: string;
  rank: number;
  score: number; // 0 - 100
  confidence_low: number;
  confidence_high: number;
  trend: 'up' | 'down' | 'stable';
  feature_snapshot: CountryFeatureSnapshot;
}

export interface FeatureImportance {
  feature_name: string;
  importance_score: number; // 0 - 1.0
  category: 'MACRO' | 'OSINT' | 'KINETIC' | 'GEOSPATIAL';
}

export interface RetrainHistoryEntry {
  id: string;
  timestamp: string; // ISO 8601
  model_version: string;
  r2: number;
  rmse: number;
  roc_auc: number;
  guardrail_promotion_note: string;
  promoted_to_prod: boolean;
}

export interface MLDiagnosticsData {
  r2: number;
  rmse: number;
  roc_auc: number;
  last_trained: string;
  feature_importance: FeatureImportance[];
  retrain_history: RetrainHistoryEntry[];
}

// 2. Bilateral Aggression Matrix
export interface BilateralTensionPair {
  country_a: string; // ISO3 code
  country_b: string; // ISO3 code
  score: number; // Hostility score 0 - 100
  last_updated: string;
  primary_conflict_driver?: string;
}

// 3. Cascade & Contagion
export interface ContagionArcData {
  id: string;
  source_country: string;
  target_country: string;
  source_coords: [number, number]; // [lat, lng]
  target_coords: [number, number]; // [lat, lng]
  contagion_score: number; // 0 - 100
  spillover_type: 'REFUGEE_SURGE' | 'TRADE_BLOCKADE' | 'KINETIC_SPREAD' | 'CYBER_SPILLOVER';
  altitude: number;
}

// 4. Live Escalation Signals
export type SignalRegion = 'INDIA' | 'USA' | 'EUROPE' | 'MIDDLE_EAST' | 'INDO_PACIFIC' | 'GLOBAL';

export interface RegionalSignalItem {
  id: string;
  source: string;
  category: 'KINETIC' | 'NATURAL' | 'ECONOMIC' | 'CYBER';
  status: string;
  headline: string;
  time: string;
  region: SignalRegion;
  severity_score: number;
}

// 5. Ingestion & Source Health
export type IngestionHealthStatus = 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';

export interface SourceHealthItem {
  source_id: string;
  source_name: string;
  status: IngestionHealthStatus;
  latency_ms: number;
  last_ingested_at: string;
  error_rate: number;
}

export interface IngestionHealthSummary {
  overall_status: IngestionHealthStatus;
  active_sources_count: number;
  total_sources_count: number;
  sources: SourceHealthItem[];
}

// 6. DB-backed Panels & Data Layers
export interface ChokepointPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  volume_at_risk_usd_bn: number;
  daily_vessel_count: number;
  status: 'OPEN' | 'HIGH_RISK' | 'BLOCKED' | 'RESTRICTED';
  risk_score: number;
}

export interface IndiaTradeRouteArc {
  id: string;
  route_name: string;
  origin: string; // e.g. "Mumbai (JNPT)"
  destination: string; // e.g. "Rotterdam"
  origin_coords: [number, number]; // [lat, lng]
  dest_coords: [number, number]; // [lat, lng]
  risk_score: number; // 0 - 100
  cargo_category: string;
  annual_value_usd_bn: number;
  status: 'ACTIVE' | 'ELEVATED_RISK' | 'DISRUPTED';
}

export interface ProtestPoint {
  id: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  participant_estimate: number;
  protest_type: 'LABOR' | 'POLITICAL' | 'FUEL_PRICE' | 'FARMER' | 'CIVIL_UNREST';
  timestamp: string;
}

export interface RegionalHeadlineItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  region: 'INDIA' | 'USA' | 'EUROPE' | 'MIDDLE_EAST' | 'GLOBAL';
  summary: string;
  url?: string;
  relevance_score: number;
}

export interface GovActionItem {
  id: string;
  country: string;
  action_type: 'SANCTION' | 'DEFENSE_EXECUTIVE_ORDER' | 'TRADE_RESTRICTION' | 'DIPLOMATIC_EXPULSION' | 'EMBARGO';
  title: string;
  issuing_body: string;
  effective_date: string;
  impact_severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface CommodityTickerItem {
  symbol: string;
  name: string;
  price_usd: number;
  change_24h_percent: number;
  unit: string;
  category: 'ENERGY' | 'METALS' | 'AGRICULTURE';
}

export interface CommodityNewsItem {
  id: string;
  commodity_symbol: string;
  headline: string;
  source: string;
  timestamp: string;
  impact: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export interface ShippingRateItem {
  route_id: string;
  route_name: string;
  index_name: string; // e.g. "FBX01", "BDTI"
  rate_usd_per_feu: number;
  change_7d_percent: number;
  status: 'SURGING' | 'STABLE' | 'DECLINING';
}
