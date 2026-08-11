/**
 * Centralized API Client module for War Risk Prediction System FastAPI Backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface CIIScore {
  country_code: string;
  score_date: string;
  cii_score: number;
  model_version: string;
  confidence_interval_low: number;
  confidence_interval_high: number;
  feature_snapshot: Record<string, any>;
  computed_at: string;
}

export interface EscalationFeedItem {
  global_event_id: number;
  event_date: string;
  ingested_at: string | null;
  source_url: string | null;
  actor1_code: string | null;
  actor2_code: string | null;
  country_code: string | null;
  event_code: string | null;
  event_severity: number;
  num_mentions: number;
  related_mentions_count: number;
  article_text: string | null;
  fetch_status: string | null;
}

export interface EscalationFeedResponse {
  region: string;
  window_hours: number;
  total_escalations: number;
  items: EscalationFeedItem[];
}

export interface AggressionPair {
  country_a: string;
  country_b: string;
  aggression_score: number | null;
  event_count: number;
  data_source: string;
  baseline_source: string | null;
  baseline_data_year: number | null;
  last_event_date: string | null;
  computed_at: string;
}

export interface AggressionMatrixResponse {
  total_pairs: number;
  pairs: AggressionPair[];
}

export interface CascadePair {
  source_country: string;
  target_country: string;
  contagion_score: number;
  co_spike_count: number;
  source_spike_count: number;
  window_days: number;
  analysis_start_date: string | null;
  analysis_end_date: string | null;
  computed_at: string | null;
}

export interface CascadeResponse {
  country_code: string;
  window_days: number;
  total_pairs: number;
  pairs: CascadePair[];
}

export interface SourceHealthItem {
  source_name: string;
  feed_name: string;
  status: string;
  records_processed: number;
  records_failed: number;
  error_message: string | null;
  last_fetch_at: string | null;
}

export interface ModelHealthStatus {
  model_version: string;
  status: string;
  is_active: boolean;
  val_r2: number;
  val_rmse: number;
  val_roc_auc: number;
  trained_at: string;
  promotion_notes: string | null;
}

export interface SystemHealthResponse {
  status: string;
  sources: SourceHealthItem[];
  active_model: ModelHealthStatus | null;
}

export interface SynthesisCitation {
  id: number;
  source: string;
  title: string;
  timestamp: string;
}

export interface SynthesisThreatVector {
  id: string;
  severity: 'critical' | 'warning';
  title: string;
  detail: string;
  citationId: number;
}

export interface SynthesisResponse {
  region: string;
  risk_score: number;
  risk_delta: number;
  summary: string;
  threat_vectors: SynthesisThreatVector[];
  citations: SynthesisCitation[];
  generated_at: string;
  source_event_ids: string[];
  model_version: string;
}

/** Helper function for fetch with timeout and error handling */
async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText} at ${endpoint}`);
  }

  return res.json();
}

/** API endpoint methods */
export const api = {
  /** Fetch latest CII scores for all in-scope countries */
  async getCIILatest(): Promise<CIIScore[]> {
    return fetchJson<CIIScore[]>('/api/v1/cii/latest');
  },

  /** Fetch historical CII scores for a specific country */
  async getCIIHistory(countryCode: string, limit = 30): Promise<CIIScore[]> {
    return fetchJson<CIIScore[]>(`/api/v1/cii/${encodeURIComponent(countryCode)}?limit=${limit}`);
  },

  /** Fetch live high-severity escalation feed for a region */
  async getLiveFeed(region: string, windowHours = 24): Promise<EscalationFeedResponse> {
    return fetchJson<EscalationFeedResponse>(`/api/v1/live-feed/${encodeURIComponent(region)}?window_hours=${windowHours}`);
  },

  /** Fetch AI executive synthesis for a region */
  async getSynthesis(region = 'middle_east', windowHours = 24): Promise<SynthesisResponse> {
    return fetchJson<SynthesisResponse>(`/api/v1/synthesis/${encodeURIComponent(region)}?window_hours=${windowHours}`);
  },

  /** Fetch full matrix of bilateral aggression scores */
  async getAggressionMatrix(dataSource?: string): Promise<AggressionMatrixResponse> {
    const query = dataSource ? `?data_source=${encodeURIComponent(dataSource)}` : '';
    return fetchJson<AggressionMatrixResponse>(`/api/v1/aggression/matrix${query}`);
  },

  /** Fetch bilateral aggression score for a specific pair of countries */
  async getPairAggression(countryA: string, countryB: string): Promise<AggressionPair> {
    return fetchJson<AggressionPair>(`/api/v1/aggression/${encodeURIComponent(countryA)}/${encodeURIComponent(countryB)}`);
  },

  /** Fetch cascade contagion scores for a country */
  async getCascadeScores(countryCode: string, windowDays = 7): Promise<CascadeResponse> {
    return fetchJson<CascadeResponse>(`/api/v1/cascade/${encodeURIComponent(countryCode)}?window_days=${windowDays}`);
  },

  /** Fetch system health status */
  async getHealth(): Promise<SystemHealthResponse> {
    return fetchJson<SystemHealthResponse>('/api/v1/health');
  },
};
