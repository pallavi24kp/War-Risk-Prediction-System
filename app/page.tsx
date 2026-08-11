'use client';

import React, { useEffect, Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TopNav } from '../src/components/chrome/TopNav';
import { PromoBanner } from '../src/components/chrome/PromoBanner';
import { WorkspaceTabBar } from '../src/components/chrome/WorkspaceTabBar';
import { Globe3D } from '../src/components/globe/Globe3D';
import { MapLayersPanelWidget } from '../src/components/widgets/MapLayersPanelWidget';
import { SituationBriefWidget } from '../src/components/widgets/SituationBriefWidget';
import { ForecastFeedWidget } from '../src/components/widgets/ForecastFeedWidget';
import { BriefingView } from '../src/components/views/BriefingView';
import { useDashboardState } from '../src/store/useDashboardState';
import { LAYER_METADATA_REGISTRY, computeActiveCentroid } from '../src/components/globe/DataLayerRegistry';
import { RotateCcw, MapPin, Layers, Clock, Navigation, Maximize2, Target, Radiation, Anchor, Ship, Plane, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

function DashboardViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const activeTab = useDashboardState((s) => s.activeTab);
  const hydrateFromSearchParams = useDashboardState((s) => s.hydrateFromSearchParams);
  const toQueryString = useDashboardState((s) => s.toQueryString);
  const lat = useDashboardState((s) => s.lat);
  const lon = useDashboardState((s) => s.lon);
  const zoom = useDashboardState((s) => s.zoom);
  const layers = useDashboardState((s) => s.layers);
  const autoRotate = useDashboardState((s) => s.autoRotate);
  const setAutoRotate = useDashboardState((s) => s.setAutoRotate);
  const setCamera = useDashboardState((s) => s.setCamera);

  const centroid = computeActiveCentroid(layers);
  const isOffScreen = (() => {
    if (!centroid || layers.length === 0) return false;
    let diff = Math.abs(lon - centroid.lng) % 360;
    if (diff > 180) diff = 360 - diff;
    return diff > 60;
  })();

  const handleFitGlobe = () => {
    const c = computeActiveCentroid(layers);
    if (c) {
      setCamera(c.lat, c.lng, c.altitude);
    } else {
      setCamera(5.1844, 1.0573, 2.69);
    }
  };

  const handleResetView = () => {
    setCamera(5.1844, 1.0573, 2.69);
  };

  // Hydrate state from URL search params on mount
  useEffect(() => {
    if (searchParams) {
      hydrateFromSearchParams(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync state back to URL query parameters smoothly without re-triggering App Router re-renders
  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof window !== 'undefined') window.history.replaceState(null, '', `/?${toQueryString()}`);
    }, 400);
    return () => clearTimeout(t);
  }, [lat, lon, zoom, layers, toQueryString]);

  return (
    <main className="flex-1 min-h-0 relative flex flex-col px-3 py-2 overflow-hidden animate-fade-in">
      {activeTab === 'briefing-overview' || activeTab === 'briefing-analytics' ? (
        <BriefingView />
      ) : (
        <div className="relative flex-1 min-h-0 h-full flex flex-col lg:grid lg:grid-cols-[270px_1fr_310px] gap-2.5 items-stretch">

          {/* Mobile Drawer Toggles */}
          <div className="lg:hidden absolute top-2 left-2 z-40 flex items-center gap-2">
            <button
              onClick={() => setIsLeftDrawerOpen(!isLeftDrawerOpen)}
              className="glass-hud flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
            >
              <Layers className="w-3.5 h-3.5 text-brand" />
              Layers {isLeftDrawerOpen ? '✕' : ''}
            </button>
            <button
              onClick={() => setIsRightDrawerOpen(!isRightDrawerOpen)}
              className="glass-hud flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
            >
              <Clock className="w-3.5 h-3.5 text-brand" />
              Intel {isRightDrawerOpen ? '✕' : ''}
            </button>
          </div>

          {/* ── Left Column: Map Layers Telemetry Panel ── */}
          <div
            className={clsx(
              'h-full min-h-0 flex flex-col transition-all duration-300 z-30 animate-slide-up stagger-1',
              'lg:static lg:block',
              isLeftDrawerOpen
                ? 'fixed inset-y-16 left-3 w-72 block animate-slide-up'
                : 'hidden lg:block'
            )}
          >
            <MapLayersPanelWidget />
          </div>

          {/* ── Center Column: Large Centered 3D Globe Viewport (Hero Focal Point) ── */}
          <div
            className="h-full min-h-0 flex-1 flex flex-col items-center justify-center rounded-2xl overflow-hidden relative group"
            onMouseDown={() => setIsInteracting(true)}
            onMouseUp={() => setIsInteracting(false)}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
            style={{
              background: 'rgba(8, 10, 14, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 48px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
            }}
          >
            {/* Ambient Radial Glow */}
            <div className="globe-glow animate-globe-glow" />

            {/* Top-Left Telemetry Coordinates HUD */}
            <div
              className={clsx(
                "absolute top-3.5 left-4 z-30 flex items-center gap-2 opacity-40 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none",
                isInteracting && "!opacity-100"
              )}
            >
              <div className="glass-hud flex items-center gap-2 px-3 py-1.5 rounded-xl pointer-events-auto">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--brand)' }} />
                <span
                  className="font-mono text-xs font-semibold tracking-wide"
                  style={{ color: 'var(--brand)' }}
                >
                  LAT: {lat.toFixed(2)}° &nbsp;|&nbsp; LON: {lon.toFixed(2)}° &nbsp;|&nbsp; ZOOM: {zoom.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Top-Right Control Overlay */}
            <div
              className={clsx(
                "absolute top-3.5 right-4 z-30 flex items-center gap-2 opacity-40 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none",
                isInteracting && "!opacity-100"
              )}
            >
              {/* Fit Globe Button */}
              <button
                onClick={handleFitGlobe}
                title="Fit 3D globe to active route data"
                aria-label="Fit 3D globe to active telemetry and trade routes"
                className="glass-hud flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:bg-brand/20 hover:border-brand/40 pointer-events-auto"
              >
                <Maximize2 className="w-3.5 h-3.5 text-brand" />
                <span>Fit Globe</span>
              </button>

              {/* Auto-Rotate Toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                title={autoRotate ? 'Disable auto-rotate' : 'Enable auto-rotate'}
                aria-label={autoRotate ? 'Disable auto-rotate' : 'Enable auto-rotate'}
                aria-pressed={autoRotate}
                className="glass-hud flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 pointer-events-auto"
                style={{
                  background: autoRotate ? 'rgba(59, 130, 246, 0.25)' : undefined,
                  borderColor: autoRotate ? 'rgba(59, 130, 246, 0.5)' : undefined,
                  color: autoRotate ? '#fff' : 'var(--text-secondary)',
                }}
              >
                <Navigation className={clsx('w-3.5 h-3.5 text-brand', autoRotate && 'animate-spin-slow')} />
                <span className="hidden sm:inline">
                  {autoRotate ? 'ROTATE ON' : 'ROTATE OFF'}
                </span>
              </button>

              {/* Reset View */}
              <button
                onClick={handleResetView}
                title="Reset globe view"
                aria-label="Reset globe to standard global view"
                className="glass-hud flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150 hover:text-white pointer-events-auto"
                style={{ color: 'var(--text-muted)' }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom-Left Layer Count Indicator & Legend */}
            <div
              className={clsx(
                "absolute bottom-3.5 left-4 z-30 hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-hud opacity-40 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-auto",
                (isInteracting || isOffScreen) && "!opacity-100"
              )}
            >
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" style={{ color: 'var(--brand)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {layers.length} layers active
                </span>
              </div>

              {isOffScreen && (
                <button
                  onClick={handleFitGlobe}
                  title="Active routes/points are off-screen — Click to recenter camera"
                  aria-label="Recenter active routes in view"
                  className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-lg bg-brand/20 border border-brand/40 text-brand font-semibold hover:bg-brand/30 transition-all duration-150 animate-fade-in cursor-pointer"
                >
                  <Target className="w-3 h-3 text-brand" />
                  <span>Recenter Routes</span>
                </button>
              )}

              {layers.length > 0 && (
                <>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-2.5 flex-wrap max-w-xl">
                    {layers.slice(0, 5).map((layerId) => {
                      const meta = LAYER_METADATA_REGISTRY[layerId];
                      if (!meta) return null;
                      
                      const POI_ICONS: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
                        nuclearPlants: Radiation,
                        seaports: Anchor,
                        navalAssets: Ship,
                        airAssets: Plane,
                        alertZones: ShieldAlert,
                      };
                      const PoiIcon = POI_ICONS[layerId];

                      return (
                        <span key={layerId} className="inline-flex items-center gap-1.5 text-[11px] font-mono text-text-secondary">
                          {PoiIcon ? (
                            <PoiIcon className="w-3.5 h-3.5 shrink-0" style={{ color: meta.color }} />
                          ) : (
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: meta.color, boxShadow: `0 0 6px ${meta.color}80` }}
                            />
                          )}
                          <span className="whitespace-nowrap">{meta.shortName || meta.name}</span>
                        </span>
                      );
                    })}
                    {layers.length > 5 && (
                      <span className="text-[10px] text-text-muted font-mono">
                        +{layers.length - 5} more
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* 3D Canvas Globe Viewport (World Monitor Replicated Globe) */}
            <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center pointer-events-auto">
              <Globe3D />
            </div>
          </div>

          {/* ── Right Column: Executive Intelligence Panel ── */}
          <div
            className={clsx(
              'h-full min-h-0 flex flex-col gap-2.5 transition-all duration-300 z-30',
              'lg:static lg:flex',
              isRightDrawerOpen
                ? 'fixed inset-y-16 right-3 w-72 flex animate-slide-up'
                : 'hidden lg:flex'
            )}
          >
            {/* Situation Brief — Primary Executive Synthesis */}
            <div className="flex-1 min-h-0 animate-slide-up stagger-2">
              <SituationBriefWidget />
            </div>

            {/* Forecasts Radar */}
            <div className="flex-1 min-h-0 animate-slide-up stagger-3">
              <ForecastFeedWidget />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <div
      className="h-screen max-h-screen flex flex-col font-sans select-none overflow-hidden"
      style={{ background: 'var(--surface-base)' }}
    >
      <TopNav />
      <PromoBanner />
      <WorkspaceTabBar />
      <Suspense
        fallback={
          <div
            className="flex-1 flex flex-col items-center justify-center gap-3"
            aria-busy="true"
          >
            <div className="space-y-2 w-64">
              <div className="skeleton-line h-3 w-full rounded" />
              <div className="skeleton-line h-3 w-4/5 rounded" />
              <div className="skeleton-line h-3 w-3/5 rounded" />
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Loading intelligence platform…
            </p>
          </div>
        }
      >
        <DashboardViewContent />
      </Suspense>
    </div>
  );
}
