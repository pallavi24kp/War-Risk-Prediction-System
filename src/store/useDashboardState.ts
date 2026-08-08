import { create } from 'zustand';
import { IntelligenceData, MOCK_INTELLIGENCE_DATA } from '../data/mockIntelligence';

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
  layers: [...ALL_LAYERS],
  selectedRegion: 'Global',

  activeTab: 'globe',
  workspaceTabs: [
    { id: 'tab-1', name: 'Globe Telemetry', type: 'globe' },
    { id: 'tab-2', name: 'Briefing Overview', type: 'briefing-overview' },
    { id: 'tab-3', name: 'Deep Analytics', type: 'briefing-analytics' },
  ],
  isPromoBannerDismissed: false,
  autoRotate: false,
  selectedEntity: null,

  selectedCountryA: 'YEM',
  selectedCountryB: 'SAU',
  cascadeSourceCountry: 'YEM',

  isLiveMode: true,
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
    set({ isLoadingIntelligence: true, intelligenceError: null });
    try {
      // Simulate network request latency (e.g. 500ms)
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({
        intelligenceData: MOCK_INTELLIGENCE_DATA,
        isLoadingIntelligence: false,
      });
    } catch (err) {
      set({
        intelligenceError: 'Failed to fetch intelligence telemetry',
        isLoadingIntelligence: false,
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
