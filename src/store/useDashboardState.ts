import { create } from 'zustand';
import { IntelligenceData, MOCK_INTELLIGENCE_DATA } from '../data/mockIntelligence';
import { api } from '../lib/api';

export type ViewMode = 'global' | 'regional' | 'country';
export type TimeRange = '24h' | '7d' | '30d';

export const ALL_LAYERS = [
  'conflicts',
  'bases',
  'hotspots',
  'nuclear',
  'sanctions',
  'weather',
  'economic',
  'waterways',
  'outages',
  'military',
  'natural',
  'tradeRoutes',
  'contagionArcs',
  'chokepoints',
  'indiaTradeRoutes',
  'protests',
  'nuclearPlants',
  'seaports',
  'navalAssets',
  'airAssets',
  'alertZones',
] as const;

export type LayerId = typeof ALL_LAYERS[number];

export interface WorkspaceTab {
  id: string;
  name: string;
  type: 'globe' | 'briefing-overview' | 'briefing-analytics';
}

export interface DashboardState {
  // Camera state
  lat: number;
  lon: number;
  zoom: number;
  view: ViewMode;
  timeRange: TimeRange;
  layers: LayerId[];
  selectedRegion: string;

  // App UI State
  activeTab: 'globe' | 'briefing-overview' | 'briefing-analytics';
  workspaceTabs: WorkspaceTab[];
  isPromoBannerDismissed: boolean;
  autoRotate: boolean;
  selectedEntity: any | null;

  // Pairwise Bilateral Globe Selection State
  selectedCountryA: string | null;
  selectedCountryB: string | null;
  cascadeSourceCountry: string | null;

  // Real-Time Intelligence & Connection State
  isLiveMode: boolean;
  isLoadingIntelligence: boolean;
  intelligenceError: string | null;
  intelligenceData: IntelligenceData;

  // Actions
  setCamera: (lat: number, lon: number, zoom: number) => void;
  setView: (view: ViewMode) => void;
  setTimeRange: (range: TimeRange) => void;
  toggleLayer: (layerId: LayerId) => void;
  setLayers: (layers: LayerId[]) => void;
  setSelectedRegion: (region: string) => void;
  setActiveTab: (tab: 'globe' | 'briefing-overview' | 'briefing-analytics') => void;
  addWorkspaceTab: (name: string, type: 'globe' | 'briefing-overview' | 'briefing-analytics') => void;
  removeWorkspaceTab: (id: string) => void;
  setPromoBannerDismissed: (dismissed: boolean) => void;
  setAutoRotate: (rotate: boolean) => void;
  setSelectedEntity: (entity: any | null) => void;

  // Pairwise & Cascade Actions
  selectCountryPairwise: (countryCode: string) => void;
  clearPairwiseCountries: () => void;
  setCascadeSourceCountry: (countryCode: string | null) => void;

  // Connection & Intelligence Actions
  setIsLiveMode: (isLiveMode: boolean) => void;
  fetchIntelligenceData: () => Promise<void>;

  // Sync methods
  hydrateFromSearchParams: (params: { get: (key: string) => string | null }) => void;
  toQueryString: () => string;
}

export const useDashboardState = create<DashboardState>((set, get) => ({
  lat: 5.1844,
  lon: 1.0573,
  zoom: 2.69,
  view: 'global',
  timeRange: '7d',
  layers: ['nuclearPlants', 'seaports', 'tradeRoutes', 'chokepoints', 'conflicts'],
  selectedRegion: 'Global',

  activeTab: 'globe',
  workspaceTabs: [
    { id: 'tab-1', name: 'Globe Telemetry', type: 'globe' },
    { id: 'tab-2', name: 'Briefing Overview', type: 'briefing-overview' },
    { id: 'tab-3', name: 'Deep Analytics', type: 'briefing-analytics' },
  ],
  isPromoBannerDismissed: false,
  autoRotate: true,
  selectedEntity: null,

  selectedCountryA: 'YEM',
  selectedCountryB: 'SAU',
  cascadeSourceCountry: 'YEM',

  isLiveMode: false,
  isLoadingIntelligence: false,
  intelligenceError: null,
  intelligenceData: MOCK_INTELLIGENCE_DATA,

  setCamera: (lat, lon, zoom) => set({ lat, lon, zoom }),
  setView: (view) => set({ view }),
  setTimeRange: (timeRange) => set({ timeRange }),
  toggleLayer: (layerId) =>
    set((state) => ({
      layers: state.layers.includes(layerId)
        ? state.layers.filter((l) => l !== layerId)
        : [...state.layers, layerId],
    })),
  setLayers: (layers) => set({ layers }),
  setSelectedRegion: (selectedRegion) => set({ selectedRegion }),
  setActiveTab: (activeTab) => set({ activeTab }),
  addWorkspaceTab: (name, type) =>
    set((state) => ({
      workspaceTabs: [
        ...state.workspaceTabs,
        { id: `tab-${Date.now()}`, name, type },
      ],
      activeTab: type,
    })),
  removeWorkspaceTab: (id) =>
    set((state) => ({
      workspaceTabs: state.workspaceTabs.filter((t) => t.id !== id),
    })),
  setPromoBannerDismissed: (isPromoBannerDismissed) =>
    set({ isPromoBannerDismissed }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setSelectedEntity: (selectedEntity) => set({ selectedEntity }),

  selectCountryPairwise: (countryCode) => {
    const { selectedCountryA, selectedCountryB } = get();
    if (!selectedCountryA || (selectedCountryA && selectedCountryB)) {
      set({ selectedCountryA: countryCode, selectedCountryB: null });
    } else {
      if (selectedCountryA !== countryCode) {
        set({ selectedCountryB: countryCode });
      }
    }
  },
  clearPairwiseCountries: () => set({ selectedCountryA: null, selectedCountryB: null }),
  setCascadeSourceCountry: (cascadeSourceCountry) => set({ cascadeSourceCountry }),

  setIsLiveMode: (isLiveMode) => set({ isLiveMode }),
  fetchIntelligenceData: async () => {
    const { isLiveMode } = get();
    set({ isLoadingIntelligence: true, intelligenceError: null });

    if (!isLiveMode) {
      set({
        intelligenceData: MOCK_INTELLIGENCE_DATA,
        isLoadingIntelligence: false,
      });
      return;
    }

    try {
      // Parallel request to live endpoints
      const [ciiScores, liveFeed] = await Promise.allSettled([
        api.getCIILatest(),
        api.getLiveFeed('middle_east'),
      ]);

      const updatedData = { ...MOCK_INTELLIGENCE_DATA };

      // Map live CII scores to instability leaderboard if available
      if (ciiScores.status === 'fulfilled' && ciiScores.value && ciiScores.value.length > 0) {
        const countryCodeMap: Record<string, string> = {
          YEM: 'Yemen', UKR: 'Ukraine', SDN: 'Sudan', TWN: 'Taiwan', IRN: 'Iran', SYR: 'Syria',
          ISR: 'Israel', RUS: 'Russia', CHN: 'China', USA: 'United States', PRK: 'North Korea',
        };
        const countryFlagMap: Record<string, string> = {
          YEM: '🇾🇪', UKR: '🇺🇦', SDN: '🇸🇩', TWN: '🇹🇼', IRN: '🇮🇷', SYR: '🇸🇾',
          ISR: '🇮🇱', RUS: '🇷🇺', CHN: '🇨🇳', USA: '🇺🇸', PRK: '🇰🇵',
        };

        updatedData.instabilityLeaderboard = ciiScores.value.slice(0, 10).map((score, index) => ({
          rank: index + 1,
          code: score.country_code,
          flag: countryFlagMap[score.country_code] || '🌐',
          name: countryCodeMap[score.country_code] || score.country_code,
          score: Math.round(score.cii_score * 10) / 10,
          trend: score.cii_score > 75 ? 'up' : 'stable',
          u: String(Math.round(score.confidence_interval_high)),
          c: String(Math.round(score.cii_score)),
          s: String(Math.round(score.confidence_interval_low)),
          f: String(Math.round(score.cii_score * 0.9)),
        }));
      }

      // Map live feed items to signals if available
      if (liveFeed.status === 'fulfilled' && liveFeed.value && liveFeed.value.items?.length > 0) {
        updatedData.signals = liveFeed.value.items.slice(0, 8).map((item, idx) => ({
          id: `live-${item.global_event_id || idx}`,
          source: 'GDELT 2.0 Live',
          category: 'KINETIC' as const,
          status: item.event_severity <= -2 ? 'High Severity' : 'Monitored',
          headline: item.article_text
            ? item.article_text.slice(0, 120) + '...'
            : `Event code ${item.event_code || 'GDELT'} reported between ${item.actor1_code || 'Actor1'} and ${item.actor2_code || 'Actor2'}`,
          time: item.event_date ? `${item.event_date}` : 'Recently',
        }));
      }

      set({
        intelligenceData: updatedData,
        isLoadingIntelligence: false,
      });
    } catch (err) {
      console.warn('Backend API connection offline — using cached fallback intelligence', err);
      set({
        intelligenceData: MOCK_INTELLIGENCE_DATA,
        isLoadingIntelligence: false,
        intelligenceError: 'Backend API offline — running on fallback telemetry',
      });
    }
  },

  hydrateFromSearchParams: (params) => {
    const lat = parseFloat(params.get('lat') || '');
    const lon = parseFloat(params.get('lon') || '');
    const zoom = parseFloat(params.get('zoom') || '');
    const view = params.get('view') as ViewMode | null;
    const timeRange = params.get('timeRange') as TimeRange | null;
    const layersParam = params.get('layers');

    const updates: Partial<DashboardState> = {};
    if (!isNaN(lat)) updates.lat = lat;
    if (!isNaN(lon)) updates.lon = lon;
    if (!isNaN(zoom)) updates.zoom = zoom;
    if (view && ['global', 'regional', 'country'].includes(view)) updates.view = view;
    if (timeRange && ['24h', '7d', '30d'].includes(timeRange)) updates.timeRange = timeRange;
    if (layersParam) {
      const parsedLayers = layersParam.split(',').filter((l) => ALL_LAYERS.includes(l as LayerId)) as LayerId[];
      if (parsedLayers.length > 0) updates.layers = parsedLayers;
    }

    set(updates);
  },

  toQueryString: () => {
    const { lat, lon, zoom, view, timeRange, layers } = get();
    const params = new URLSearchParams({
      lat: lat.toFixed(4),
      lon: lon.toFixed(4),
      zoom: zoom.toFixed(2),
      view,
      timeRange,
      layers: layers.join(','),
    });
    return params.toString();
  },
}));
