import { LayerId } from '../../store/useDashboardState';
import { MOCK_CHOKEPOINTS, MOCK_INDIA_TRADE_ROUTES, MOCK_PROTESTS } from '../../data/mock/dbPanelsData';
import { MOCK_CONTAGION_ARCS } from '../../data/mock/contagionData';

export interface GlobePoint {
  id: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  category: LayerId;
  details?: {
    severity?: string;
    updatedAgo?: string;
    description?: string;
    [key: string]: any;
  };
}

export interface RouteArc {
  id: string;
  name: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  category: 'trade' | 'military' | 'sanctions' | 'contagion' | 'indiaTrade';
  altitude: number; // Altitude offset for overlapping corridors
  cargoType: string;
  vesselType: string;
  chokepoints: string[];
  eta: string;
  status: 'ACTIVE' | 'DISRUPTED' | 'REROUTED' | 'ELEVATED_RISK' | 'HIGH_RISK';
  isDashed?: boolean;
}

export interface LayerMetadata {
  id: LayerId;
  name: string;
  shortName: string;
  categoryTag: string;
  count: number;
  updatedAgo: string;
  description: string;
  color: string;
}

export const LAYER_METADATA_REGISTRY: Record<LayerId, LayerMetadata> = {
  conflicts: {
    id: 'conflicts',
    name: 'Active Conflict Events',
    shortName: 'Conflicts',
    categoryTag: 'MILITARY / KINETIC',
    count: 142,
    updatedAgo: '2m ago',
    description: 'Real-time GDELT 2.0 kinetic conflict & strike telemetry.',
    color: '#ff4a4a',
  },
  bases: {
    id: 'bases',
    name: 'Strategic Military Bases',
    shortName: 'Bases',
    categoryTag: 'INFRASTRUCTURE',
    count: 86,
    updatedAgo: '1h ago',
    description: 'Airbases, naval facilities, and radar garrisons.',
    color: '#00f0ff',
  },
  hotspots: {
    id: 'hotspots',
    name: 'Geopolitical Instability Hotspots',
    shortName: 'Hotspots',
    categoryTag: 'RISK INDEX',
    count: 34,
    updatedAgo: '5m ago',
    description: 'Aggregated high-risk density regional clusters.',
    color: '#ff9f00',
  },
  nuclear: {
    id: 'nuclear',
    name: 'Nuclear & Critical Facilities',
    shortName: 'Nuclear',
    categoryTag: 'STRATEGIC',
    count: 48,
    updatedAgo: '12m ago',
    description: 'Power reactors, enrichment complexes, and weapons storage.',
    color: '#a855f7',
  },
  sanctions: {
    id: 'sanctions',
    name: 'Sanctioned Trade Zones',
    shortName: 'Sanctions',
    categoryTag: 'ECONOMIC',
    count: 19,
    updatedAgo: '30m ago',
    description: 'OFAC, EU, and UN sanctioned jurisdictional entities.',
    color: '#ef4444',
  },
  weather: {
    id: 'weather',
    name: 'Severe Maritime Weather',
    shortName: 'Weather',
    categoryTag: 'ENVIRONMENTAL',
    count: 27,
    updatedAgo: '8m ago',
    description: 'Tropical cyclones, extreme sea states, and monsoon surges.',
    color: '#3b82f6',
  },
  economic: {
    id: 'economic',
    name: 'Economic Shock & Inflation',
    shortName: 'Economic',
    categoryTag: 'MACRO',
    count: 62,
    updatedAgo: '15m ago',
    description: 'Currency devaluation, GDP shocks, and supply chain stress.',
    color: '#f59e0b',
  },
  waterways: {
    id: 'waterways',
    name: 'Strategic Maritime Chokepoints',
    shortName: 'Chokepoints',
    categoryTag: 'LOGISTICS',
    count: 12,
    updatedAgo: '1m ago',
    description: 'Bab al-Mandab, Hormuz, Suez, Malacca, and Panama canals.',
    color: '#06b6d4',
  },
  outages: {
    id: 'outages',
    name: 'Telecom & Power Outages',
    shortName: 'Outages',
    categoryTag: 'CYBER / GRID',
    count: 31,
    updatedAgo: '4m ago',
    description: 'Subsea cable cuts, grid blackouts, and internet drops.',
    color: '#10b981',
  },
  military: {
    id: 'military',
    name: 'Naval & Troop Deployments',
    shortName: 'Deployments',
    categoryTag: 'DEFENSE',
    count: 55,
    updatedAgo: '3m ago',
    description: 'Carrier strike groups, amphibious units, and air sorties.',
    color: '#f43f5e',
  },
  natural: {
    id: 'natural',
    name: 'Natural Disaster Signals',
    shortName: 'Disasters',
    categoryTag: 'DISASTER (USGS)',
    count: 43,
    updatedAgo: '6m ago',
    description: 'Earthquakes M5.0+, wildfires, and volcanic plumes.',
    color: '#84cc16',
  },
  tradeRoutes: {
    id: 'tradeRoutes',
    name: 'Maritime Trade Corridors',
    shortName: 'Trade Routes',
    categoryTag: 'COMMERCE',
    count: 18,
    updatedAgo: 'LIVE',
    description: 'Great-circle maritime & strategic energy transport arcs.',
    color: '#00f0ff',
  },
  contagionArcs: {
    id: 'contagionArcs',
    name: 'Cascade & Contagion Arcs',
    shortName: 'Contagion',
    categoryTag: 'SPILLOVER',
    count: 9,
    updatedAgo: 'LIVE',
    description: 'Directional conflict contagion & regional spillover vectors.',
    color: '#ec4899',
  },
  chokepoints: {
    id: 'chokepoints',
    name: 'DB Waterway Chokepoints',
    shortName: 'DB Chokepoints',
    categoryTag: 'LOGISTICS DB',
    count: 7,
    updatedAgo: '1m ago',
    description: 'Tracked maritime chokepoints with volume at risk metrics.',
    color: '#06b6d4',
  },
  indiaTradeRoutes: {
    id: 'indiaTradeRoutes',
    name: 'India Export Trade Corridors',
    shortName: 'India Routes',
    categoryTag: 'INDIA TRADE',
    count: 4,
    updatedAgo: 'LIVE',
    description: 'Dedicated India maritime trade & energy export routes.',
    color: '#f59e0b',
  },
  protests: {
    id: 'protests',
    name: 'Civil Unrest & Protests',
    shortName: 'Protests',
    categoryTag: 'CIVIL UNREST',
    count: 5,
    updatedAgo: '4m ago',
    description: 'Tracked civil unrest, port strikes, and labor demonstrations.',
    color: '#eab308',
  },
};

// Rich Mock Dataset for Globe Rendering
export const MOCK_GLOBE_POINTS: GlobePoint[] = [
  // Conflicts
  { id: 'c1', lat: 15.369, lng: 44.191, size: 1.2, color: '#ff4a4a', label: 'Red Sea Anti-Ship Missile Strike', category: 'conflicts', details: { severity: 'CRITICAL', updatedAgo: '2m ago' } },
  { id: 'c2', lat: 31.501, lng: 34.466, size: 1.5, color: '#ff4a4a', label: 'Gaza Sector Kinetic Engagement', category: 'conflicts', details: { severity: 'HIGH', updatedAgo: '5m ago' } },
  { id: 'c3', lat: 48.379, lng: 31.165, size: 1.4, color: '#ff4a4a', label: 'Dnieper River Front Artillery Duels', category: 'conflicts', details: { severity: 'HIGH', updatedAgo: '1m ago' } },
  { id: 'c4', lat: 24.86, lng: 67.001, size: 0.9, color: '#ff4a4a', label: 'Balochistan Border Skirmish', category: 'conflicts', details: { severity: 'MEDIUM', updatedAgo: '14m ago' } },

  // Bases
  { id: 'b1', lat: 25.276, lng: 51.52, size: 0.8, color: '#00f0ff', label: 'Al Udeid Air Base', category: 'bases', details: { severity: 'OPERATIONAL', updatedAgo: '1h ago' } },
  { id: 'b2', lat: 11.588, lng: 43.145, size: 0.8, color: '#00f0ff', label: 'Camp Lemonnier Djibouti', category: 'bases', details: { severity: 'ALERT', updatedAgo: '30m ago' } },
  { id: 'b3', lat: 1.352, lng: 103.819, size: 0.8, color: '#00f0ff', label: 'Changi Naval Base Singapore', category: 'bases', details: { severity: 'OPERATIONAL', updatedAgo: '2h ago' } },

  // Hotspots
  { id: 'h1', lat: 23.5, lng: 121.0, size: 1.8, color: '#ff9f00', label: 'Taiwan Strait Exercise Zone', category: 'hotspots', details: { severity: 'HIGH ESCALATION', updatedAgo: '10m ago' } },
  { id: 'h2', lat: 26.5, lng: 56.25, size: 1.6, color: '#ff9f00', label: 'Strait of Hormuz Interdiction Area', category: 'hotspots', details: { severity: 'HIGH ESCALATION', updatedAgo: '3m ago' } },

  // Nuclear
  { id: 'n1', lat: 47.51, lng: 34.58, size: 1.0, color: '#a855f7', label: 'Zaporizhzhia NPP Complex', category: 'nuclear', details: { severity: 'MONITORED', updatedAgo: '12m ago' } },
  { id: 'n2', lat: 32.65, lng: 51.72, size: 1.0, color: '#a855f7', label: 'Natanz Fuel Enrichment Plant', category: 'nuclear', details: { severity: 'HIGH SECURITY', updatedAgo: '45m ago' } },

  // Outages & Disasters
  { id: 'o1', lat: 12.879, lng: 45.018, size: 0.7, color: '#00e676', label: 'Subsea Cable SMW5 Cut', category: 'outages', details: { severity: 'MAJOR CUT', updatedAgo: '4m ago' } },
  { id: 'nd1', lat: 37.87, lng: 138.8, size: 0.9, color: '#00e676', label: 'USGS M6.4 Earthquake Noto', category: 'natural', details: { severity: 'MODERATE', updatedAgo: '6m ago' } },

  // Chokepoints (DB Layer)
  ...MOCK_CHOKEPOINTS.map((chk) => ({
    id: chk.id,
    lat: chk.lat,
    lng: chk.lng,
    size: 1.3,
    color: '#06b6d4',
    label: chk.name,
    category: 'chokepoints' as LayerId,
    details: {
      severity: chk.status,
      updatedAgo: '1m ago',
      description: `Volume at Risk: $${chk.volume_at_risk_usd_bn}B | Daily Vessels: ${chk.daily_vessel_count}`,
    },
  })),

  // Protests (DB Layer)
  ...MOCK_PROTESTS.map((prt) => ({
    id: prt.id,
    lat: prt.lat,
    lng: prt.lng,
    size: 1.1,
    color: '#eab308',
    label: `${prt.location} (${prt.protest_type})`,
    category: 'protests' as LayerId,
    details: {
      severity: prt.severity,
      updatedAgo: prt.timestamp,
      description: `Participants: ~${prt.participant_estimate.toLocaleString()} | Type: ${prt.protest_type}`,
    },
  })),
];

// Great-Circle Trade, Military, Contagion & India Arcs
export const MOCK_TRADE_ROUTES: RouteArc[] = [
  {
    id: 'r1',
    name: 'Suez — Bab al-Mandab Energy Corridor',
    startLat: 29.975,
    startLng: 32.56,
    endLat: 12.59,
    endLng: 43.34,
    color: '#00f0ff',
    category: 'trade',
    altitude: 0.15,
    cargoType: 'LNG & Crude Oil (1.4M bpd)',
    vesselType: 'Aframax Tanker Squadron',
    chokepoints: ['Bab al-Mandab', 'Suez Canal'],
    eta: 'LIVE · In Transit (8.4 kts)',
    status: 'DISRUPTED',
  },
  {
    id: 'r2',
    name: 'Persian Gulf — Malacca Strait Crude Transit',
    startLat: 26.56,
    startLng: 56.25,
    endLat: 1.29,
    endLng: 103.85,
    color: '#ff9f00',
    category: 'trade',
    altitude: 0.22,
    cargoType: 'VLCC Petroleum Consignment',
    vesselType: 'Supertanker Convoy',
    chokepoints: ['Strait of Hormuz', 'Malacca Strait'],
    eta: 'LIVE · 48 Hours to Changi',
    status: 'ACTIVE',
  },
  {
    id: 'r3',
    name: 'US East Coast — Rotterdam Grain & Container Route',
    startLat: 40.71,
    startLng: -74.0,
    endLat: 51.92,
    endLng: 4.47,
    color: '#00e676',
    category: 'trade',
    altitude: 0.18,
    cargoType: 'Agricultural & Electronics',
    vesselType: 'Post-Panamax Container Vessel',
    chokepoints: ['English Channel'],
    eta: 'LIVE · On Schedule',
    status: 'ACTIVE',
  },
  {
    id: 'r4',
    name: 'Carrier Strike Group 3 Transit (Indo-Pacific)',
    startLat: 13.44,
    startLng: 144.79, // Guam
    endLat: 22.31,
    endLng: 114.16, // Hong Kong / Taiwan
    color: '#ff4a4a',
    category: 'military',
    altitude: 0.28,
    cargoType: 'Naval Defense Assets',
    vesselType: 'Guided Missile Destroyer Group',
    chokepoints: ['Luzon Strait'],
    eta: 'LIVE · Tactical Speed (24 kts)',
    status: 'ACTIVE',
  },

  // Contagion Arcs (Section 3)
  ...MOCK_CONTAGION_ARCS.map((ca) => ({
    id: ca.id,
    name: `Contagion Spillover: ${ca.source_country} ➔ ${ca.target_country} (${ca.spillover_type})`,
    startLat: ca.source_coords[0],
    startLng: ca.source_coords[1],
    endLat: ca.target_coords[0],
    endLng: ca.target_coords[1],
    color: '#ec4899',
    category: 'contagion' as const,
    altitude: ca.altitude,
    cargoType: `Spillover Vector: ${ca.spillover_type}`,
    vesselType: `Contagion Severity ${ca.contagion_score}/100`,
    chokepoints: [ca.source_country, ca.target_country],
    eta: 'PULSING · High Instability Contagion',
    status: 'HIGH_RISK' as const,
    isDashed: true,
  })),

  // India Trade Routes (Section 6)
  ...MOCK_INDIA_TRADE_ROUTES.map((itr) => ({
    id: itr.id,
    name: itr.route_name,
    startLat: itr.origin_coords[0],
    startLng: itr.origin_coords[1],
    endLat: itr.dest_coords[0],
    endLng: itr.dest_coords[1],
    color: '#f59e0b',
    category: 'indiaTrade' as const,
    altitude: 0.20,
    cargoType: itr.cargo_category,
    vesselType: `Annual Value $${itr.annual_value_usd_bn}B`,
    chokepoints: [itr.origin, itr.destination],
    eta: `Risk Score ${itr.risk_score}/100`,
    status: (itr.status === 'ELEVATED_RISK' ? 'DISRUPTED' : itr.status === 'DISRUPTED' ? 'DISRUPTED' : 'ACTIVE') as any,
  })),
];

export function computeActiveCentroid(
  activeLayers: LayerId[]
): { lat: number; lng: number; altitude: number } | null {
  const activePoints = MOCK_GLOBE_POINTS.filter((pt) => activeLayers.includes(pt.category));
  const activeArcs = MOCK_TRADE_ROUTES.filter((arc) => {
    if (arc.category === 'trade' && activeLayers.includes('tradeRoutes')) return true;
    if (arc.category === 'military' && activeLayers.includes('tradeRoutes')) return true;
    if (arc.category === 'contagion' && activeLayers.includes('contagionArcs')) return true;
    if (arc.category === 'indiaTrade' && activeLayers.includes('indiaTradeRoutes')) return true;
    return false;
  });

  const coords: { lat: number; lng: number }[] = [];

  activePoints.forEach((p) => {
    if (typeof p.lat === 'number' && typeof p.lng === 'number') {
      coords.push({ lat: p.lat, lng: p.lng });
    }
  });

  activeArcs.forEach((a) => {
    if (typeof a.startLat === 'number' && typeof a.startLng === 'number') {
      coords.push({ lat: a.startLat, lng: a.startLng });
    }
    if (typeof a.endLat === 'number' && typeof a.endLng === 'number') {
      coords.push({ lat: a.endLat, lng: a.endLng });
    }
  });

  if (coords.length === 0) return null;

  let sumLat = 0;
  let sumLng = 0;
  coords.forEach((c) => {
    sumLat += c.lat;
    sumLng += c.lng;
  });

  return {
    lat: sumLat / coords.length,
    lng: sumLng / coords.length,
    altitude: 2.3,
  };
}
