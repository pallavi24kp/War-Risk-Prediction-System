import {
  ChokepointPoint,
  IndiaTradeRouteArc,
  ProtestPoint,
  RegionalHeadlineItem,
  GovActionItem,
  CommodityTickerItem,
  CommodityNewsItem,
  ShippingRateItem,
} from '../../lib/types';

// 1. Chokepoints (Points for 3D Globe)
export const MOCK_CHOKEPOINTS: ChokepointPoint[] = [
  { id: 'chk-1', name: 'Bab al-Mandab Strait', lat: 12.59, lng: 43.34, volume_at_risk_usd_bn: 700, daily_vessel_count: 52, status: 'HIGH_RISK', risk_score: 91 },
  { id: 'chk-2', name: 'Strait of Hormuz', lat: 26.56, lng: 56.25, volume_at_risk_usd_bn: 1200, daily_vessel_count: 85, status: 'HIGH_RISK', risk_score: 84 },
  { id: 'chk-3', name: 'Suez Canal', lat: 29.975, lng: 32.56, volume_at_risk_usd_bn: 950, daily_vessel_count: 64, status: 'RESTRICTED', risk_score: 72 },
  { id: 'chk-4', name: 'Strait of Malacca', lat: 1.29, lng: 103.85, volume_at_risk_usd_bn: 1800, daily_vessel_count: 140, status: 'OPEN', risk_score: 38 },
  { id: 'chk-5', name: 'Taiwan Strait', lat: 24.5, lng: 119.8, volume_at_risk_usd_bn: 1500, daily_vessel_count: 98, status: 'HIGH_RISK', risk_score: 79 },
  { id: 'chk-6', name: 'Panama Canal', lat: 9.08, lng: -79.68, volume_at_risk_usd_bn: 270, daily_vessel_count: 32, status: 'RESTRICTED', risk_score: 61 },
  { id: 'chk-7', name: 'Turkish Straits (Bosporus)', lat: 41.12, lng: 29.08, volume_at_risk_usd_bn: 410, daily_vessel_count: 45, status: 'OPEN', risk_score: 45 },
];

// 2. India Trade Routes (Arcs for 3D Globe)
export const MOCK_INDIA_TRADE_ROUTES: IndiaTradeRouteArc[] = [
  {
    id: 'itr-1',
    route_name: 'JNPT Mumbai — Rotterdam Energy & Cargo Corridor',
    origin: 'JNPT Mumbai',
    destination: 'Rotterdam',
    origin_coords: [18.95, 72.95],
    dest_coords: [51.92, 4.47],
    risk_score: 82,
    cargo_category: 'Refined Oil & Pharmaceuticals',
    annual_value_usd_bn: 42.5,
    status: 'ELEVATED_RISK',
  },
  {
    id: 'itr-2',
    route_name: 'Mundra — Jebel Ali Crude Transport',
    origin: 'Mundra Port',
    destination: 'Jebel Ali UAE',
    origin_coords: [22.84, 69.70],
    dest_coords: [24.99, 55.06],
    risk_score: 75,
    cargo_category: 'Crude Oil & Petrochemicals',
    annual_value_usd_bn: 38.0,
    status: 'ACTIVE',
  },
  {
    id: 'itr-3',
    route_name: 'Chennai — Singapore Electronics & Defense Route',
    origin: 'Chennai Port',
    destination: 'Singapore',
    origin_coords: [13.08, 80.27],
    dest_coords: [1.35, 103.82],
    risk_score: 28,
    cargo_category: 'Electronics & Automobile Components',
    annual_value_usd_bn: 24.1,
    status: 'ACTIVE',
  },
  {
    id: 'itr-4',
    route_name: 'Kochi — Bab al-Mandab Red Sea Transit',
    origin: 'Kochi Port',
    destination: 'Suez Port',
    origin_coords: [9.96, 76.26],
    dest_coords: [29.97, 32.56],
    risk_score: 94,
    cargo_category: 'Agricultural Produce & Spices',
    annual_value_usd_bn: 15.8,
    status: 'DISRUPTED',
  },
];

// 3. Protests (Points for 3D Globe)
export const MOCK_PROTESTS: ProtestPoint[] = [
  {
    id: 'prt-1',
    location: 'Paris Port & Logistics Hub',
    country: 'FRA',
    lat: 48.856,
    lng: 2.352,
    severity: 'HIGH',
    participant_estimate: 45000,
    protest_type: 'LABOR',
    timestamp: '2026-08-07 03:20 UTC',
  },
  {
    id: 'prt-2',
    location: 'Le Havre Container Terminal',
    country: 'FRA',
    lat: 49.49,
    lng: 0.1,
    severity: 'CRITICAL',
    participant_estimate: 12000,
    protest_type: 'CIVIL_UNREST',
    timestamp: '2026-08-07 02:45 UTC',
  },
  {
    id: 'prt-3',
    location: 'New Delhi Farmer March Perimeter',
    country: 'IND',
    lat: 28.613,
    lng: 77.209,
    severity: 'MEDIUM',
    participant_estimate: 28000,
    protest_type: 'FARMER',
    timestamp: '2026-08-07 04:10 UTC',
  },
  {
    id: 'prt-4',
    location: 'Houston Refinery Access Corridor',
    country: 'USA',
    lat: 29.76,
    lng: -95.36,
    severity: 'LOW',
    participant_estimate: 1500,
    protest_type: 'FUEL_PRICE',
    timestamp: '2026-08-06 21:30 UTC',
  },
  {
    id: 'prt-5',
    location: 'Panama City Canal Logistics Rally',
    country: 'PAN',
    lat: 8.98,
    lng: -79.51,
    severity: 'HIGH',
    participant_estimate: 9500,
    protest_type: 'POLITICAL',
    timestamp: '2026-08-06 19:15 UTC',
  },
];

// 4. Regional Headlines (Top 10 with India & USA panels)
export const MOCK_REGIONAL_HEADLINES: RegionalHeadlineItem[] = [
  // INDIA
  {
    id: 'h-ind-1',
    title: 'India Maritime Ministry Issues Escort Protocol for Red Sea Cargo Transits',
    source: 'Economic Times',
    timestamp: '12m ago',
    region: 'INDIA',
    summary: 'Naval escorts deployed to safeguard Indian-flagged tankers navigating high-risk Arabian Sea corridors.',
    relevance_score: 0.95,
  },
  {
    id: 'h-ind-2',
    title: 'JNPT Freight Forwarders Report 18% Delay in EU-Bound Shipments',
    source: 'LiveMint',
    timestamp: '45m ago',
    region: 'INDIA',
    summary: 'Rerouting around Cape of Good Hope adds 12 days to transit schedules from western Indian sea-boards.',
    relevance_score: 0.88,
  },
  {
    id: 'h-ind-3',
    title: 'India Strategic Petroleum Reserve Level Stands at 87% Capacity',
    source: 'Business Standard',
    timestamp: '1h ago',
    region: 'INDIA',
    summary: 'Petroleum Ministry confirms adequate buffer stockpiles despite Middle East crude freight volatility.',
    relevance_score: 0.82,
  },
  {
    id: 'h-ind-4',
    title: 'Customs Digital Gateway Enhances Clearance Velocity at Mundra Port',
    source: 'Financial Express',
    timestamp: '3h ago',
    region: 'INDIA',
    summary: 'Automated AI document verification reduces container dwelling time by 22%.',
    relevance_score: 0.74,
  },
  {
    id: 'h-ind-5',
    title: 'Indian Coast Guard Expands Surveillance Radar Net Across Lakshadweep',
    source: 'The Hindu',
    timestamp: '4h ago',
    region: 'INDIA',
    summary: 'New coastal radar installations increase vessel track density in Nine Degree Channel.',
    relevance_score: 0.89,
  },

  // USA
  {
    id: 'h-usa-1',
    title: 'White House Issues Executive Order on Maritime Cyber Resilience',
    source: 'Washington Post',
    timestamp: '20m ago',
    region: 'USA',
    summary: 'New cybersecurity standards mandated for all US port terminal operating software systems.',
    relevance_score: 0.92,
  },
  {
    id: 'h-usa-2',
    title: 'US Coast Guard Escorts LNG Tankers in Gulf Coast Terminals',
    source: 'Reuters',
    timestamp: '55m ago',
    region: 'USA',
    summary: 'Increased security zone perimeters implemented at Sabine Pass and Corpus Christi export facilities.',
    relevance_score: 0.86,
  },
  {
    id: 'h-usa-3',
    title: 'Pentagon Briefing Highlights Indo-Pacific Naval Exercises Schedule',
    source: 'Defense One',
    timestamp: '2h ago',
    region: 'USA',
    summary: 'Carrier Strike Group 3 initiates multi-domain joint maneuvers in Philippine Sea.',
    relevance_score: 0.90,
  },

  // GLOBAL / EUROPE
  {
    id: 'h-glo-1',
    title: 'IMO Urges Universal AIS Transponder Compliance Amid Shadow Fleet Surge',
    source: 'Lloyds List',
    timestamp: '10m ago',
    region: 'GLOBAL',
    summary: 'International Maritime Organization issues alert on unflagged crude tankers operating without satellite tracking.',
    relevance_score: 0.94,
  },
  {
    id: 'h-glo-2',
    title: 'Baltic Dry Index Jumps 6.4% on Cape of Good Hope Tonnage Demand',
    source: 'Bloomberg Shipping',
    timestamp: '30m ago',
    region: 'EUROPE',
    summary: 'Longer sailing distances push up dry bulk charter rates across Capesize and Panamax segments.',
    relevance_score: 0.87,
  },
];

// 5. Government Actions Log
export const MOCK_GOV_ACTIONS: GovActionItem[] = [
  {
    id: 'ga-1',
    country: 'USA',
    action_type: 'SANCTION',
    title: 'Designation of 14 Dark-Fleet Crude Tankers in Persian Gulf',
    issuing_body: 'US Department of the Treasury (OFAC)',
    effective_date: '2026-08-07',
    impact_severity: 'HIGH',
  },
  {
    id: 'ga-2',
    country: 'IND',
    action_type: 'DEFENSE_EXECUTIVE_ORDER',
    title: 'Deployment of Operation Sankalp Maritime Anti-Piracy Task Force',
    issuing_body: 'Ministry of Defence, Government of India',
    effective_date: '2026-08-06',
    impact_severity: 'HIGH',
  },
  {
    id: 'ga-3',
    country: 'GBR',
    action_type: 'TRADE_RESTRICTION',
    title: 'Ban on Dual-Use Drone Component Exports to High-Risk Entities',
    issuing_body: 'UK Department for Business and Trade',
    effective_date: '2026-08-05',
    impact_severity: 'MEDIUM',
  },
  {
    id: 'ga-4',
    country: 'JPN',
    action_type: 'DEFENSE_EXECUTIVE_ORDER',
    title: 'Coastal Defense Readiness Elevation in Noto Maritime Perimeter',
    issuing_body: 'Japan Cabinet Office',
    effective_date: '2026-08-06',
    impact_severity: 'MEDIUM',
  },
  {
    id: 'ga-5',
    country: 'EGY',
    action_type: 'EMBARGO',
    title: 'Suez Canal Transit Rebate Adjustment for Green Ships',
    issuing_body: 'Suez Canal Authority',
    effective_date: '2026-08-04',
    impact_severity: 'LOW',
  },
];

// 6. Tracked Commodities & Ticker
export const MOCK_COMMODITY_TICKERS: CommodityTickerItem[] = [
  { symbol: 'BRENT', name: 'Brent Crude Oil', price_usd: 88.42, change_24h_percent: 2.34, unit: 'USD / bbl', category: 'ENERGY' },
  { symbol: 'WTI', name: 'WTI Crude Oil', price_usd: 84.15, change_24h_percent: 2.18, unit: 'USD / bbl', category: 'ENERGY' },
  { symbol: 'LNG-ASIA', name: 'JKM Asian Spot LNG', price_usd: 14.85, change_24h_percent: 4.12, unit: 'USD / MMBtu', category: 'ENERGY' },
  { symbol: 'GOLD', name: 'Gold Bullion', price_usd: 2485.60, change_24h_percent: 0.85, unit: 'USD / oz', category: 'METALS' },
  { symbol: 'COPPER', name: 'LME Copper Grade A', price_usd: 9420.00, change_24h_percent: -0.45, unit: 'USD / MT', category: 'METALS' },
  { symbol: 'WHEAT', name: 'CBOT Wheat Futures', price_usd: 612.50, change_24h_percent: 3.25, unit: 'USD / bu', category: 'AGRICULTURE' },
];

export const MOCK_COMMODITY_NEWS: CommodityNewsItem[] = [
  {
    id: 'cn-1',
    commodity_symbol: 'BRENT',
    headline: 'Red Sea Rerouting Adds $1.8M Fuel Cost per Tanker Voyage',
    source: 'S&P Global Commodities',
    timestamp: '15m ago',
    impact: 'BULLISH',
  },
  {
    id: 'cn-2',
    commodity_symbol: 'LNG-ASIA',
    headline: 'Asian Buyers Competition Intensifies as European Storage Drawdowns Accelerate',
    source: 'ICIS Energy',
    timestamp: '40m ago',
    impact: 'BULLISH',
  },
  {
    id: 'cn-3',
    commodity_symbol: 'WHEAT',
    headline: 'Black Sea Grain Corridor Ship Insurance Surcharges Jump 12%',
    source: 'AgriCensus',
    timestamp: '1h ago',
    impact: 'BULLISH',
  },
  {
    id: 'cn-4',
    commodity_symbol: 'COPPER',
    headline: 'Peruvian Mine Workers Union Suspends Strike Threat Following Accord',
    source: 'Metal Bulletin',
    timestamp: '2h ago',
    impact: 'BEARISH',
  },
];

// 7. Shipping Rates Ticker
export const MOCK_SHIPPING_RATES: ShippingRateItem[] = [
  { route_id: 'FBX01', route_name: 'China / East Asia — US West Coast', index_name: 'Freightos Baltic Index', rate_usd_per_feu: 4850, change_7d_percent: 14.8, status: 'SURGING' },
  { route_id: 'FBX03', route_name: 'China / East Asia — US East Coast', index_name: 'Freightos Baltic Index', rate_usd_per_feu: 6420, change_7d_percent: 18.2, status: 'SURGING' },
  { route_id: 'FBX11', route_name: 'China / East Asia — North Europe', index_name: 'Freightos Baltic Index', rate_usd_per_feu: 5980, change_7d_percent: 22.5, status: 'SURGING' },
  { route_id: 'BDTI-TD3', route_name: 'Persian Gulf — Japan (270k MT Crude)', index_name: 'Baltic Dirty Tanker Index', rate_usd_per_feu: 82.5, change_7d_percent: 6.4, status: 'STABLE' },
  { route_id: 'BCTI-TC1', route_name: 'Middle East Gulf — Japan (75k MT Clean)', index_name: 'Baltic Clean Tanker Index', rate_usd_per_feu: 195.0, change_7d_percent: -1.2, status: 'DECLINING' },
];
