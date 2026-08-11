import { LayerId } from '../../store/useDashboardState';
import { MOCK_CHOKEPOINTS, MOCK_INDIA_TRADE_ROUTES, MOCK_PROTESTS } from '../../data/mock/dbPanelsData';
import { MOCK_CONTAGION_ARCS } from '../../data/mock/contagionData';

export interface PoiMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  category: 'nuclearPlants' | 'seaports' | 'navalAssets' | 'airAssets' | 'alertZones';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  metadata: {
    status?: string;
    subCategory?: string;
    updatedAgo?: string;
    description?: string;
    vessels?: number;
    capacity?: string;
    output?: string;
    locationName?: string;
    [key: string]: any;
  };
}

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
  nuclearPlants: {
    id: 'nuclearPlants',
    name: 'Nuclear Power & Strategic Reactors',
    shortName: 'Nuclear Plants',
    categoryTag: 'STRATEGIC POI',
    count: 18,
    updatedAgo: '5m ago',
    description: 'Global nuclear power reactors, enrichment complexes, and strategic facilities.',
    color: '#ef4444',
  },
  seaports: {
    id: 'seaports',
    name: 'Major Harbors & Maritime Ports',
    shortName: 'Seaports',
    categoryTag: 'MARITIME HARBORS',
    count: 18,
    updatedAgo: '3m ago',
    description: 'High-capacity commercial shipping ports, harbors, and container terminals.',
    color: '#3b82f6',
  },
  navalAssets: {
    id: 'navalAssets',
    name: 'Naval Vessels & Fleet Squadrons',
    shortName: 'Naval Assets',
    categoryTag: 'FLEET SQUADRONS',
    count: 12,
    updatedAgo: '1m ago',
    description: 'Active carrier strike groups, guided missile destroyers, and naval task forces.',
    color: '#f59e0b',
  },
  airAssets: {
    id: 'airAssets',
    name: 'Strategic Airbases & Aviation Hubs',
    shortName: 'Air Assets',
    categoryTag: 'AIRBASE / SORTIES',
    count: 10,
    updatedAgo: '7m ago',
    description: 'Military airfields, strategic bomber garrisons, and air support stations.',
    color: '#00f0ff',
  },
  alertZones: {
    id: 'alertZones',
    name: 'Tactical & High-Priority Alert Zones',
    shortName: 'Alert Zones',
    categoryTag: 'HIGH ALERT',
    count: 10,
    updatedAgo: 'LIVE',
    description: 'Active kinetic, cyber, economic, and severe natural risk alert perimeters.',
    color: '#ec4899',
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

export const MOCK_POI_DATA: PoiMarker[] = [
  // ── Nuclear Power Plants ──
  { id: 'poi-nuke-1', lat: 47.51, lng: 34.58, name: 'Zaporizhzhia Nuclear Power Plant', category: 'nuclearPlants', severity: 'CRITICAL', metadata: { status: 'MILITARY GUARD', output: '6,000 MW (6 Units)', locationName: 'Zaporizhzhia, Ukraine', updatedAgo: '2m ago', description: 'Largest nuclear plant in Europe. Under active military control & IAEA monitoring.' } },
  { id: 'poi-nuke-2', lat: 32.65, lng: 51.72, name: 'Natanz Fuel Enrichment Complex', category: 'nuclearPlants', severity: 'CRITICAL', metadata: { status: 'HIGH SECURITY', output: 'Centrifuge Cascade Facility', locationName: 'Isfahan, Iran', updatedAgo: '10m ago', description: 'Subterranean uranium enrichment site under heavy air defense coverage.' } },
  { id: 'poi-nuke-3', lat: 28.83, lng: 50.89, name: 'Bushehr Nuclear Power Plant', category: 'nuclearPlants', severity: 'HIGH', metadata: { status: 'OPERATIONAL', output: '1,000 MW VVER-1000', locationName: 'Bushehr, Iran', updatedAgo: '15m ago', description: 'Persian Gulf coastal nuclear station monitored for regional security threats.' } },
  { id: 'poi-nuke-4', lat: 31.00, lng: 35.14, name: 'Shimon Peres Negev Nuclear Center', category: 'nuclearPlants', severity: 'HIGH', metadata: { status: 'RESTRICTED', output: 'Heavy Water Research Complex', locationName: 'Dimona, Israel', updatedAgo: '30m ago', description: 'Strategic nuclear research facility in Negev Desert with multi-layer air defense.' } },
  { id: 'poi-nuke-5', lat: 8.16, lng: 77.71, name: 'Kudankulam Nuclear Power Plant', category: 'nuclearPlants', severity: 'MEDIUM', metadata: { status: 'OPERATIONAL', output: '2,000 MW (2 VVER Units)', locationName: 'Tamil Nadu, India', updatedAgo: '1h ago', description: 'India largest nuclear power station located on the southern coastline.' } },
  { id: 'poi-nuke-6', lat: 19.83, lng: 72.66, name: 'Tarapur Atomic Power Station', category: 'nuclearPlants', severity: 'LOW', metadata: { status: 'OPERATIONAL', output: '1,400 MW (4 Units)', locationName: 'Maharashtra, India', updatedAgo: '2h ago', description: 'India oldest commercial nuclear station supplying West Coast industrial grid.' } },
  { id: 'poi-nuke-7', lat: 21.24, lng: 73.35, name: 'Kakrapar Atomic Power Station', category: 'nuclearPlants', severity: 'LOW', metadata: { status: 'OPERATIONAL', output: '1,140 MW (3 PHWR Units)', locationName: 'Gujarat, India', updatedAgo: '4h ago', description: 'Indigenous 700MWe pressurized heavy-water reactor commercial unit.' } },
  { id: 'poi-nuke-8', lat: 37.42, lng: 141.03, name: 'Fukushima Daiichi Complex', category: 'nuclearPlants', severity: 'MEDIUM', metadata: { status: 'DECOMMISSIONING', output: 'ALPS Treated Water Release Site', locationName: 'Fukushima, Japan', updatedAgo: '45m ago', description: 'Active decommissioning & environmental maritime discharge monitoring station.' } },
  { id: 'poi-nuke-9', lat: 37.42, lng: 138.60, name: 'Kashiwazaki-Kariwa Station', category: 'nuclearPlants', severity: 'LOW', metadata: { status: 'RESTART INSPECTION', output: '8,212 MW (7 BWR Units)', locationName: 'Niigata, Japan', updatedAgo: '3h ago', description: 'World largest capacity nuclear facility undergoing safety restarts.' } },
  { id: 'poi-nuke-10', lat: 30.43, lng: 120.95, name: 'Qinshan Nuclear Power Plant', category: 'nuclearPlants', severity: 'LOW', metadata: { status: 'OPERATIONAL', output: '6,856 MW (9 Units)', locationName: 'Zhejiang, China', updatedAgo: '5h ago', description: 'Major East China nuclear energy hub supplying Shanghai industrial cluster.' } },
  { id: 'poi-nuke-11', lat: 21.90, lng: 112.98, name: 'Taishan Nuclear Power Plant', category: 'nuclearPlants', severity: 'MEDIUM', metadata: { status: 'OPERATIONAL', output: '3,500 MW (2 EPR Units)', locationName: 'Guangdong, China', updatedAgo: '1h ago', description: 'World first operational European Pressurized Reactor (EPR) commercial units.' } },
  { id: 'poi-nuke-12', lat: 23.97, lng: 52.23, name: 'Barakah Nuclear Energy Plant', category: 'nuclearPlants', severity: 'LOW', metadata: { status: 'OPERATIONAL', output: '5,600 MW (4 APR1400 Units)', locationName: 'Abu Dhabi, UAE', updatedAgo: '2h ago', description: 'Arabian Peninsula first commercial nuclear energy plant.' } },
  { id: 'poi-nuke-13', lat: 51.38, lng: 30.10, name: 'Chornobyl Exclusion Zone Facility', category: 'nuclearPlants', severity: 'HIGH', metadata: { status: 'MONITORED', output: 'New Safe Confinement Shelter', locationName: 'Kyiv Oblast, Ukraine', updatedAgo: '12m ago', description: 'Exclusion zone spent nuclear fuel storage facility under international safeguards.' } },
  { id: 'poi-nuke-14', lat: 51.01, lng: 2.14, name: 'Gravelines Nuclear Station', category: 'nuclearPlants', severity: 'LOW', metadata: { status: 'OPERATIONAL', output: '5,460 MW (6 Units)', locationName: 'Nord, France', updatedAgo: '4h ago', description: 'Largest nuclear plant in Western Europe near English Channel maritime strait.' } },
  { id: 'poi-nuke-15', lat: 51.67, lng: 35.60, name: 'Kursk Nuclear Power Plant', category: 'nuclearPlants', severity: 'CRITICAL', metadata: { status: 'DEFENSE ALERT', output: '4,000 MW (RBMK Reactors)', locationName: 'Kursk, Russia', updatedAgo: '5m ago', description: 'Frontier region nuclear station under heightened air defense & security protection.' } },
  { id: 'poi-nuke-16', lat: 51.32, lng: 25.89, name: 'Rivne Nuclear Power Plant', category: 'nuclearPlants', severity: 'MEDIUM', metadata: { status: 'OPERATIONAL', output: '2,835 MW (4 VVER Units)', locationName: 'Rivne, Ukraine', updatedAgo: '30m ago', description: 'Western Ukraine nuclear power complex integrated into European ENTSO-E grid.' } },
  { id: 'poi-nuke-17', lat: 44.32, lng: -81.60, name: 'Bruce Nuclear Generating Station', category: 'nuclearPlants', severity: 'LOW', metadata: { status: 'OPERATIONAL', output: '6,430 MW (8 CANDU Units)', locationName: 'Ontario, Canada', updatedAgo: '6h ago', description: 'One of the world largest operating CANDU heavy-water nuclear complexes.' } },
  { id: 'poi-nuke-18', lat: 33.39, lng: -112.86, name: 'Palo Verde Generating Station', category: 'nuclearPlants', severity: 'LOW', metadata: { status: 'OPERATIONAL', output: '3,937 MW (3 PWR Units)', locationName: 'Arizona, USA', updatedAgo: '8h ago', description: 'Largest electricity generating facility by net generation in the United States.' } },

  // ── Major Seaports ──
  { id: 'poi-port-1', lat: 30.63, lng: 122.06, name: 'Port of Shanghai (Yangshan)', category: 'seaports', severity: 'LOW', metadata: { status: 'OPERATIONAL', capacity: '47.3M TEU / year', locationName: 'Shanghai, China', updatedAgo: '10m ago', description: 'World busiest container port hub controlling East China Sea trade flows.' } },
  { id: 'poi-port-2', lat: 1.26, lng: 103.84, name: 'Port of Singapore', category: 'seaports', severity: 'LOW', metadata: { status: 'OPERATIONAL', capacity: '37.3M TEU / year', locationName: 'Singapore', updatedAgo: '5m ago', description: 'Global primary maritime transshipment hub at Malacca Strait bottleneck.' } },
  { id: 'poi-port-3', lat: 51.95, lng: 4.14, name: 'Port of Rotterdam', category: 'seaports', severity: 'LOW', metadata: { status: 'OPERATIONAL', capacity: '14.5M TEU / year', locationName: 'Rotterdam, Netherlands', updatedAgo: '20m ago', description: 'Europe premier deepwater gateway and energy import port terminal.' } },
  { id: 'poi-port-4', lat: 24.98, lng: 55.06, name: 'Port of Jebel Ali', category: 'seaports', severity: 'HIGH', metadata: { status: 'MONITORED', capacity: '14.0M TEU / year', locationName: 'Dubai, UAE', updatedAgo: '15m ago', description: 'Persian Gulf largest deepwater harbor & Middle East commercial logistics hub.' } },
  { id: 'poi-port-5', lat: 12.79, lng: 44.97, name: 'Port of Aden', category: 'seaports', severity: 'CRITICAL', metadata: { status: 'HIGH RISK', capacity: 'Deepwater Container Terminal', locationName: 'Aden, Yemen', updatedAgo: '1m ago', description: 'Strategic Gulf of Aden port experiencing severe regional missile & security threats.' } },
  { id: 'poi-port-6', lat: 14.84, lng: 42.93, name: 'Port of Hodeidah', category: 'seaports', severity: 'CRITICAL', metadata: { status: 'MILITARY ZONE', capacity: 'Red Sea Cargo Hub', locationName: 'Hodeidah, Yemen', updatedAgo: '3m ago', description: 'Red Sea port under active blockade & strike risk. Crucial food & fuel entry point.' } },
  { id: 'poi-port-7', lat: 32.82, lng: 34.99, name: 'Port of Haifa', category: 'seaports', severity: 'CRITICAL', metadata: { status: 'ELEVATED THREAT', capacity: '3.0M TEU / year', locationName: 'Haifa, Israel', updatedAgo: '8m ago', description: 'Eastern Mediterranean container terminal facing rocket threats & GPS jamming.' } },
  { id: 'poi-port-8', lat: 46.49, lng: 30.74, name: 'Port of Odesa', category: 'seaports', severity: 'CRITICAL', metadata: { status: 'WAR RISK ZONE', capacity: 'Black Sea Grain & Cargo Hub', locationName: 'Odesa, Ukraine', updatedAgo: '4m ago', description: 'Black Sea primary agricultural export terminal subject to naval blockade & drone strikes.' } },
  { id: 'poi-port-9', lat: 44.61, lng: 33.52, name: 'Port of Sevastopol', category: 'seaports', severity: 'CRITICAL', metadata: { status: 'NAVAL BASE', capacity: 'Black Sea Fleet Anchorage', locationName: 'Sevastopol, Crimea', updatedAgo: '6m ago', description: 'Fortified naval harbor & ammunition terminal under frequent uncrewed surface vessel attacks.' } },
  { id: 'poi-port-10', lat: 18.95, lng: 72.95, name: 'Jawaharlal Nehru Port (JNPT)', category: 'seaports', severity: 'LOW', metadata: { status: 'OPERATIONAL', capacity: '6.05M TEU / year', locationName: 'Navi Mumbai, India', updatedAgo: '30m ago', description: 'India largest container port handling over 50% of national maritime containerized cargo.' } },
  { id: 'poi-port-11', lat: 22.74, lng: 69.70, name: 'Port of Mundra', category: 'seaports', severity: 'MEDIUM', metadata: { status: 'OPERATIONAL', capacity: '155M Tons Cargo / year', locationName: 'Gujarat, India', updatedAgo: '45m ago', description: 'Largest private commercial port in India handling crude imports & containerized exports.' } },
  { id: 'poi-port-12', lat: 6.94, lng: 79.85, name: 'Port of Colombo', category: 'seaports', severity: 'LOW', metadata: { status: 'OPERATIONAL', capacity: '7.2M TEU / year', locationName: 'Colombo, Sri Lanka', updatedAgo: '1h ago', description: 'South Asian transshipment gateway serving Indian Ocean sea lanes of communication.' } },
  { id: 'poi-port-13', lat: 24.84, lng: 66.97, name: 'Port of Karachi', category: 'seaports', severity: 'MEDIUM', metadata: { status: 'OPERATIONAL', capacity: 'Deepwater Container Terminal', locationName: 'Karachi, Pakistan', updatedAgo: '2h ago', description: 'Pakistan primary deepwater seaport handling 60% of national maritime commerce.' } },
  { id: 'poi-port-14', lat: 25.12, lng: 62.33, name: 'Port of Gwadar', category: 'seaports', severity: 'HIGH', metadata: { status: 'SECURITY PATROL', capacity: 'CPEC Deepwater Terminal', locationName: 'Balochistan, Pakistan', updatedAgo: '18m ago', description: 'China-Pakistan Economic Corridor flagship deepwater port under insurgent threat alert.' } },
  { id: 'poi-port-15', lat: 22.61, lng: 120.28, name: 'Port of Kaohsiung', category: 'seaports', severity: 'HIGH', metadata: { status: 'ALERT MONITOR', capacity: '9.5M TEU / year', locationName: 'Kaohsiung, Taiwan', updatedAgo: '25m ago', description: 'Taiwan largest seaport located on Taiwan Strait, monitored during military drills.' } },
  { id: 'poi-port-16', lat: 35.10, lng: 129.04, name: 'Port of Busan', category: 'seaports', severity: 'LOW', metadata: { status: 'OPERATIONAL', capacity: '22.7M TEU / year', locationName: 'Busan, South Korea', updatedAgo: '2h ago', description: 'Northeast Asia transshipment hub connecting Trans-Pacific & Intra-Asia trade lanes.' } },
  { id: 'poi-port-17', lat: 33.74, lng: -118.27, name: 'Port of Los Angeles / Long Beach', category: 'seaports', severity: 'LOW', metadata: { status: 'OPERATIONAL', capacity: '10.6M TEU / year', locationName: 'California, USA', updatedAgo: '4h ago', description: 'Premier maritime commerce gateway for Trans-Pacific trade into North America.' } },
  { id: 'poi-port-18', lat: 29.96, lng: 32.55, name: 'Port of Suez', category: 'seaports', severity: 'HIGH', metadata: { status: 'CONVOY ASSEMBLY', capacity: 'Canal Southern Terminal', locationName: 'Suez, Egypt', updatedAgo: '12m ago', description: 'Suez Canal southern assembly harbor monitored for Red Sea rerouting impacts.' } },

  // ── Naval Assets & Fleet Squadrons ──
  { id: 'poi-naval-1', lat: 15.50, lng: 41.80, name: 'Carrier Strike Group 3 (USS Eisenhower)', category: 'navalAssets', severity: 'CRITICAL', metadata: { status: 'COMBAT ENGAGED', subCategory: 'Carrier Battle Group', vessels: 6, updatedAgo: '1m ago', description: 'US Navy CSG conducting Operation Prosperity Guardian anti-missile interdictions.' } },
  { id: 'poi-naval-2', lat: 26.23, lng: 50.59, name: 'US Navy 5th Fleet NSA Headquarters', category: 'navalAssets', severity: 'HIGH', metadata: { status: 'ALERT LEVEL 3', subCategory: 'Fleet Command Base', vessels: 12, updatedAgo: '10m ago', description: 'CENTCOM maritime component command directing Persian Gulf & Red Sea naval operations.' } },
  { id: 'poi-naval-3', lat: 24.20, lng: 119.80, name: 'PLA Navy Carrier Task Force Shandong', category: 'navalAssets', severity: 'CRITICAL', metadata: { status: 'EXERCISE DEPLOYMENT', subCategory: 'Type 002 Aircraft Carrier', vessels: 8, updatedAgo: '5m ago', description: 'Chinese carrier strike group conducting Taiwan Strait blockade & flight ops.' } },
  { id: 'poi-naval-4', lat: 44.20, lng: 34.80, name: 'Russian Black Sea Fleet Patrol Task Unit', category: 'navalAssets', severity: 'CRITICAL', metadata: { status: 'COMBAT READY', subCategory: 'Kalibr Cruise Missile Frigates', vessels: 5, updatedAgo: '8m ago', description: 'Guided missile frigates & Kilo-class submarines patrolling Crimea approaches.' } },
  { id: 'poi-naval-5', lat: 17.50, lng: 70.20, name: 'Indian Navy Western Fleet INS Vikramaditya', category: 'navalAssets', severity: 'MEDIUM', metadata: { status: 'ARABIAN SEA PATROL', subCategory: 'Carrier Task Group', vessels: 7, updatedAgo: '20m ago', description: 'Indian Navy flagship carrier group providing anti-piracy & escort protection.' } },
  { id: 'poi-naval-6', lat: 12.20, lng: 45.50, name: 'Royal Navy HMS Diamond (Type 45 Destroyer)', category: 'navalAssets', severity: 'HIGH', metadata: { status: 'AIR DEFENSE ESCORT', subCategory: 'Guided Missile Destroyer', vessels: 1, updatedAgo: '15m ago', description: 'UK Royal Navy air defense destroyer intercepting drone attacks in Gulf of Aden.' } },
  { id: 'poi-naval-7', lat: 34.50, lng: 32.80, name: 'French Navy FS Charles de Gaulle Task Force', category: 'navalAssets', severity: 'HIGH', metadata: { status: 'EAST MED OPERATION', subCategory: 'Nuclear Carrier Group', vessels: 6, updatedAgo: '30m ago', description: 'French nuclear-powered aircraft carrier task force operating in Levant waters.' } },
  { id: 'poi-naval-8', lat: 13.10, lng: 82.50, name: 'INS Vikrant Task Squadron', category: 'navalAssets', severity: 'LOW', metadata: { status: 'TRAINING EXERCISE', subCategory: 'Indigenous Aircraft Carrier', vessels: 4, updatedAgo: '1h ago', description: 'India indigenous aircraft carrier conducting flight certification sorties in Bay of Bengal.' } },
  { id: 'poi-naval-9', lat: 29.50, lng: 126.20, name: 'JMSDF Escort Flotilla 2', category: 'navalAssets', severity: 'MEDIUM', metadata: { status: 'SEA LANE PATROL', subCategory: 'Aegis Destroyer Squadron', vessels: 4, updatedAgo: '40m ago', description: 'Japanese Maritime Self-Defense Force Maya-class Aegis destroyers monitoring East China Sea.' } },
  { id: 'poi-naval-10', lat: 16.50, lng: 128.00, name: 'US 7th Fleet Flagship USS Blue Ridge', category: 'navalAssets', severity: 'MEDIUM', metadata: { status: 'JOINT MANEUVERS', subCategory: 'Command Ship', vessels: 3, updatedAgo: '50m ago', description: 'US 7th Fleet command flagship coordinating Indo-Pacific partner exercises.' } },
  { id: 'poi-naval-11', lat: 13.20, lng: 43.10, name: 'Combined Task Force CTF-153 Squadron', category: 'navalAssets', severity: 'CRITICAL', metadata: { status: 'ACTIVE INTERDICT', subCategory: 'Multinational Patrol', vessels: 5, updatedAgo: '2m ago', description: 'Multinational maritime security coalition escorting commercial merchant shipping.' } },
  { id: 'poi-naval-12', lat: -5.90, lng: 105.80, name: 'Royal Australian Navy HMAS Hobart Unit', category: 'navalAssets', severity: 'LOW', metadata: { status: 'REGIONAL DEPLOYMENT', subCategory: 'Air Warfare Destroyer', vessels: 2, updatedAgo: '3h ago', description: 'RAN destroyer conducting Indo-Pacific maritime security presence mission.' } },

  // ── Air Assets & Airbases ──
  { id: 'poi-air-1', lat: 25.11, lng: 51.31, name: 'Al Udeid Air Base (USAF CENTCOM)', category: 'airAssets', severity: 'HIGH', metadata: { status: 'HIGH OPERATIONAL', capacity: 'CAOC Air Operations Command', locationName: 'Doha, Qatar', updatedAgo: '5m ago', description: 'Largest US military base in Middle East housing Combined Air Operations Center.' } },
  { id: 'poi-air-2', lat: 24.06, lng: 47.58, name: 'Prince Sultan Air Base', category: 'airAssets', severity: 'MEDIUM', metadata: { status: 'EXPEDITIONARY', capacity: '378th Air Expeditionary Wing', locationName: 'Al Kharj, Saudi Arabia', updatedAgo: '25m ago', description: 'USAF forward fighter & Patriot missile battery deployment location.' } },
  { id: 'poi-air-3', lat: 37.00, lng: 35.42, name: 'Incirlik Air Base', category: 'airAssets', severity: 'HIGH', metadata: { status: 'ALERT STANDBY', capacity: '39th Air Base Wing', locationName: 'Adana, Turkey', updatedAgo: '12m ago', description: 'NATO strategic airbase supporting Eastern Mediterranean & Levant sorties.' } },
  { id: 'poi-air-4', lat: 49.44, lng: 7.60, name: 'Ramstein Air Base', category: 'airAssets', severity: 'LOW', metadata: { status: 'OPERATIONAL', capacity: 'HQ USAFE-AFAFRICA', locationName: 'Rhineland-Palatinate, Germany', updatedAgo: '45m ago', description: 'Premier NATO air logistics & command hub in Europe.' } },
  { id: 'poi-air-5', lat: 26.35, lng: 127.77, name: 'Kadena Air Base', category: 'airAssets', severity: 'HIGH', metadata: { status: 'TACTICAL ROTATION', capacity: '18th Wing F-15EX / F-35A', locationName: 'Okinawa, Japan', updatedAgo: '18m ago', description: 'Key USAF hub in Pacific hub for tactical air superiority & airborne early warning.' } },
  { id: 'poi-air-6', lat: 13.58, lng: 144.92, name: 'Andersen Air Force Base', category: 'airAssets', severity: 'HIGH', metadata: { status: 'BOMBER PRESENCE', capacity: 'B-52H / B-2 Spirit Bombers', locationName: 'Yigo, Guam', updatedAgo: '10m ago', description: 'USAF strategic bomber forward base projecting power across Indo-Pacific.' } },
  { id: 'poi-air-7', lat: -7.31, lng: 72.41, name: 'Diego Garcia Air Facility', category: 'airAssets', severity: 'MEDIUM', metadata: { status: 'FORWARD SUPPORT', capacity: 'Heavy Bomber & Submarine Base', locationName: 'Chagos Archipelago, BIOT', updatedAgo: '2h ago', description: 'Strategic US-UK joint military base in central Indian Ocean.' } },
  { id: 'poi-air-8', lat: 34.59, lng: 32.98, name: 'RAF Akrotiri Airbase', category: 'airAssets', severity: 'HIGH', metadata: { status: 'STRIKE MISSIONS', capacity: '84 Squadron Typhoon FGR4', locationName: 'Sovereign Base Area, Cyprus', updatedAgo: '15m ago', description: 'UK Royal Air Force principal operational hub for Middle East reconnaissance.' } },
  { id: 'poi-air-9', lat: 30.37, lng: 76.81, name: 'Ambala Air Force Station', category: 'airAssets', severity: 'LOW', metadata: { status: 'OPERATIONAL', capacity: '17 Squadron Rafale Squadron', locationName: 'Haryana, India', updatedAgo: '1h ago', description: 'Indian Air Force frontline airbase housing Rafale multirole fighters.' } },
  { id: 'poi-air-10', lat: 35.41, lng: 35.94, name: 'Khmeimim Air Base', category: 'airAssets', severity: 'CRITICAL', metadata: { status: 'COMBAT OPERATIONS', capacity: 'RuAF Su-35S & Tu-22M3 Hub', locationName: 'Latakia, Syria', updatedAgo: '3m ago', description: 'Russian Air Force primary Mediterranean airbase & missile strike launch station.' } },

  // ── High-Priority Alert Zones ──
  { id: 'poi-alert-1', lat: 12.60, lng: 43.30, name: 'Bab al-Mandab Anti-Ship Threat Zone', category: 'alertZones', severity: 'CRITICAL', metadata: { status: 'ACTIVE FIRE', subCategory: 'KINETIC', updatedAgo: '1m ago', description: 'Anti-ship ballistic missile & uncrewed surface vessel engagement perimeter.' } },
  { id: 'poi-alert-2', lat: 26.60, lng: 56.30, name: 'Strait of Hormuz Interdiction Area', category: 'alertZones', severity: 'CRITICAL', metadata: { status: 'ELEVATED BOARDING', subCategory: 'KINETIC', updatedAgo: '5m ago', description: 'Armed boarding & electronic warfare Spoofing alert perimeter for oil tankers.' } },
  { id: 'poi-alert-3', lat: 54.10, lng: 23.30, name: 'Suwalki Gap Tactical Alert Perimeter', category: 'alertZones', severity: 'HIGH', metadata: { status: 'GARRISON ALERT', subCategory: 'KINETIC', updatedAgo: '15m ago', description: 'Strategic land corridor monitoring garrison buildups & GPS jamming.' } },
  { id: 'poi-alert-4', lat: 13.80, lng: 42.70, name: 'Red Sea Subsea Cable Disruption Point', category: 'alertZones', severity: 'CRITICAL', metadata: { status: 'FIBER CUT', subCategory: 'CYBER', updatedAgo: '3m ago', description: 'Multiple submarine telecommunication cables severed disrupting Asia-Europe traffic.' } },
  { id: 'poi-alert-5', lat: 55.50, lng: 15.80, name: 'Baltic Sea Nord Stream Surveillance Sector', category: 'alertZones', severity: 'HIGH', metadata: { status: 'INFRASTRUCTURE RISK', subCategory: 'CYBER', updatedAgo: '30m ago', description: 'Critical seabed pipeline & energy grid security patrol zone.' } },
  { id: 'poi-alert-6', lat: 45.20, lng: 32.00, name: 'Black Sea Maritime Grain Corridor Risk', category: 'alertZones', severity: 'HIGH', metadata: { status: 'FREIGHT EMBARGO', subCategory: 'ECONOMIC', updatedAgo: '20m ago', description: 'Surged maritime war risk insurance surcharges and drift mine hazard zone.' } },
  { id: 'poi-alert-7', lat: 11.20, lng: 51.50, name: 'Gulf of Aden Cyclone Warning Sector', category: 'alertZones', severity: 'MEDIUM', metadata: { status: 'SEA STATE 7', subCategory: 'NATURAL', updatedAgo: '1h ago', description: 'Severe tropical cyclone wave heights up to 8m impacting container shipping.' } },
  { id: 'poi-alert-8', lat: 23.80, lng: 119.50, name: 'Taiwan Strait ADIZ Sortie Interception Perimeter', category: 'alertZones', severity: 'CRITICAL', metadata: { status: 'AIR INTERCEPT', subCategory: 'KINETIC', updatedAgo: '2m ago', description: 'Daily military aircraft median line crossings & air defense scramble zone.' } },
  { id: 'poi-alert-9', lat: 3.50, lng: 5.80, name: 'Gulf of Guinea Piracy High-Risk Sector', category: 'alertZones', severity: 'HIGH', metadata: { status: 'BOARDING ALERT', subCategory: 'KINETIC', updatedAgo: '40m ago', description: 'Armed maritime kidnapping & vessel hijacking warning zone for commercial tankers.' } },
  { id: 'poi-alert-10', lat: 2.50, lng: 101.50, name: 'Strait of Malacca Congestion & Chokepoint Risk', category: 'alertZones', severity: 'MEDIUM', metadata: { status: 'TRAFFIC DELAY', subCategory: 'ECONOMIC', updatedAgo: '10m ago', description: 'Extreme vessel traffic density & shallow-water navigation hazard area.' } },
];

export function computeActiveCentroid(
  activeLayers: LayerId[]
): { lat: number; lng: number; altitude: number } | null {
  const activePoints = MOCK_GLOBE_POINTS.filter((pt) => activeLayers.includes(pt.category));
  const activePoiPoints = MOCK_POI_DATA.filter((poi) => activeLayers.includes(poi.category as LayerId));
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

  activePoiPoints.forEach((p) => {
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
