export interface Citation {
  id: number;
  source: string;
  title: string;
  timestamp: string;
}

export interface ThreatVector {
  id: string;
  severity: 'critical' | 'warning';
  title: string;
  detail: string;
  citationId: number;
}

export interface SituationBriefData {
  riskScore: number;
  riskDelta: number;
  synthesisText: string;
  citations: Citation[];
  threatVectors: ThreatVector[];
  updatedAt: string;
}

export interface RiskIndexData {
  score: number;
  label: string;
  delta24h: number;
  submetrics: {
    kineticRisk: number;
    tradeChokepoint: number;
  };
  sourcesCount: string;
  updatedAt: string;
}

export type ForecastCategory = 'LOGISTICS' | 'COMMODITIES' | 'DEFENSE';
export type ForecastRegion = 'MIDDLE EAST' | 'INDO-PACIFIC' | 'EUROPE';

export interface ForecastItem {
  id: string;
  title: string;
  category: ForecastCategory;
  region: ForecastRegion;
  probability: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  horizon: string;
}

export type SignalCategory = 'KINETIC' | 'NATURAL' | 'ECONOMIC' | 'CYBER';

export interface SignalItem {
  id: string;
  source: string;
  category: SignalCategory;
  status: string;
  headline: string;
  time: string;
}

export interface AssetCount {
  label: string;
  count: number;
  type: 'naval' | 'air' | 'cyber';
}

export interface TheaterItem {
  id: string;
  name: string;
  severity: 'CRITICAL' | 'HIGH';
  status: string;
  direction: string;
  assets: AssetCount[];
}

export interface InstabilityItem {
  rank: number;
  code: string;
  flag: string;
  name: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  u: string;
  c: string;
  s: string;
  f: string;
}

export interface EscalationTimelineData {
  criticalEventsCount: number;
  criticalEventsDelta: string;
  activeEscalationDays: number;
  eventVelocityPercent: number;
  last7DaysAvg: number;
  prior7DaysAvg: number;
  updatedAt: string;
}

export interface IntelligenceData {
  situationBrief: SituationBriefData;
  riskIndex: RiskIndexData;
  forecasts: ForecastItem[];
  signals: SignalItem[];
  theaters: TheaterItem[];
  instabilityLeaderboard: InstabilityItem[];
  escalationTimeline: EscalationTimelineData;
}

export const MOCK_INTELLIGENCE_DATA: IntelligenceData = {
  situationBrief: {
    riskScore: 78.4,
    riskDelta: 2.1,
    synthesisText:
      'Geopolitical escalation scores across the Red Sea and Persian Gulf energy transit corridors have surged to 78.4 (+2.1) following anti-ship missile interdiction events and simultaneous subsea telecom cable cuts. Tanker rerouting around the Cape of Good Hope has increased spot freight rates by 14.8%.',
    citations: [
      { id: 1, source: 'GDELT 2.0 Telemetry', title: 'Kinetic strike reported in Bab al-Mandab maritime sector', timestamp: '06:14 UTC' },
      { id: 2, source: 'USGS Earthquake Telemetry', title: 'M6.4 seismic activity near Noto Peninsula infrastructure', timestamp: '05:42 UTC' },
      { id: 3, source: 'OFAC Sanctions Bulletin', title: 'Designation of 14 dark-fleet crude tankers in Persian Gulf', timestamp: '04:18 UTC' },
      { id: 4, source: 'Subsea Cable Alliance', title: 'SMW5 fiber optic severance verified at Red Sea landfall', timestamp: '03:55 UTC' },
    ],
    threatVectors: [
      {
        id: 'tv-1',
        severity: 'critical',
        title: 'Red Sea Transit Reroute',
        detail: '42 container vessels diverted south; transit times extended +11 days',
        citationId: 3,
      },
      {
        id: 'tv-2',
        severity: 'warning',
        title: 'Seismic Infrastructure',
        detail: 'USGS confirmed M6.4 event in Japan coastal zone',
        citationId: 2,
      },
    ],
    updatedAt: '1m ago',
  },
  riskIndex: {
    score: 78,
    label: 'High Critical',
    delta24h: 2.1,
    submetrics: {
      kineticRisk: 84.2,
      tradeChokepoint: 71.9,
    },
    sourcesCount: '12/12',
    updatedAt: '1m ago',
  },
  forecasts: [
    {
      id: 'f1',
      title: 'Bab al-Mandab Shipping Reroute Persistence > 30 Days',
      category: 'LOGISTICS',
      region: 'MIDDLE EAST',
      probability: 88,
      confidence: 'HIGH',
      horizon: 'Q3 2026',
    },
    {
      id: 'f2',
      title: 'Persian Gulf Crude Spot Freight Spike +25%',
      category: 'COMMODITIES',
      region: 'MIDDLE EAST',
      probability: 74,
      confidence: 'MEDIUM',
      horizon: '14 Days',
    },
    {
      id: 'f3',
      title: 'Taiwan Strait Maritime Air Exclusion Zone Expansion',
      category: 'DEFENSE',
      region: 'INDO-PACIFIC',
      probability: 62,
      confidence: 'MEDIUM',
      horizon: '30 Days',
    },
    {
      id: 'f4',
      title: 'Black Sea Grain Vessel Hull Insurance Surcharge',
      category: 'COMMODITIES',
      region: 'EUROPE',
      probability: 91,
      confidence: 'HIGH',
      horizon: '7 Days',
    },
  ],
  signals: [
    {
      id: 's1',
      source: 'GDELT 2.0',
      category: 'KINETIC',
      status: 'High Severity',
      headline: 'Commercial bulk carrier reports near-miss missile detonation 45nm SW of Aden',
      time: 'Just now',
    },
    {
      id: 's2',
      source: 'USGS',
      category: 'NATURAL',
      status: 'M6.4 Verified',
      headline: 'Seismic epicenter identified near Noto nuclear coastal perimeter',
      time: '3m ago',
    },
    {
      id: 's3',
      source: 'OFAC',
      category: 'ECONOMIC',
      status: 'Sanction Added',
      headline: 'Treasury designates 8 maritime front entities operating shadow crude tankers',
      time: '8m ago',
    },
    {
      id: 's4',
      source: 'Subsea Monitor',
      category: 'CYBER',
      status: 'Cable Sever',
      headline: 'SMW5 landing station telemetry confirms 48% throughput drop in Red Sea segment',
      time: '14m ago',
    },
  ],
  theaters: [
    {
      id: 'th-1',
      name: 'Bab al-Mandab & Southern Red Sea',
      severity: 'CRITICAL',
      status: 'Active Anti-Ship Interdiction',
      direction: 'Escalating (+14%)',
      assets: [
        { label: 'Naval Assets', count: 14, type: 'naval' },
        { label: 'Air Assets', count: 32, type: 'air' },
        { label: 'Radar Stations', count: 8, type: 'cyber' },
      ],
    },
    {
      id: 'th-2',
      name: 'Strait of Hormuz & Persian Gulf',
      severity: 'HIGH',
      status: 'Elevated Tanker Boarding Risk',
      direction: 'Escalating (+6%)',
      assets: [
        { label: 'Naval Assets', count: 22, type: 'naval' },
        { label: 'Air Assets', count: 45, type: 'air' },
        { label: 'Radar Stations', count: 12, type: 'cyber' },
      ],
    },
    {
      id: 'th-3',
      name: 'Suwalki Gap & Baltic Transit',
      severity: 'HIGH',
      status: 'GPS Jamming & Telemetry Outage',
      direction: 'Stable',
      assets: [
        { label: 'Naval Assets', count: 9, type: 'naval' },
        { label: 'Air Assets', count: 18, type: 'air' },
        { label: 'Radar Stations', count: 6, type: 'cyber' },
      ],
    },
  ],
  instabilityLeaderboard: [
    { rank: 1, code: 'YEM', flag: '🇾🇪', name: 'Yemen', score: 94.2, trend: 'up', u: '98', c: '92', s: '96', f: '90' },
    { rank: 2, code: 'UKR', flag: '🇺🇦', name: 'Ukraine', score: 89.8, trend: 'up', u: '91', c: '94', s: '86', f: '88' },
    { rank: 3, code: 'SDN', flag: '🇸🇩', name: 'Sudan', score: 87.5, trend: 'stable', u: '89', c: '84', s: '92', f: '85' },
    { rank: 4, code: 'TWN', flag: '🇹🇼', name: 'Taiwan', score: 76.4, trend: 'up', u: '68', c: '82', s: '74', f: '80' },
    { rank: 5, code: 'IRN', flag: '🇮🇷', name: 'Iran', score: 74.1, trend: 'down', u: '72', c: '78', s: '70', f: '75' },
    { rank: 6, code: 'SYR', flag: '🇸🇾', name: 'Syria', score: 72.8, trend: 'stable', u: '75', c: '70', s: '74', f: '71' },
  ],
  escalationTimeline: {
    criticalEventsCount: 42,
    criticalEventsDelta: '+8 vs yesterday',
    activeEscalationDays: 18,
    eventVelocityPercent: 34,
    last7DaysAvg: 6.0,
    prior7DaysAvg: 4.4,
    updatedAt: '3m ago',
  },
};
