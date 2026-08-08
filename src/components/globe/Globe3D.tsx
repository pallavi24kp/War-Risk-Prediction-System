'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useDashboardState } from '../../store/useDashboardState';
import { MOCK_GLOBE_POINTS, MOCK_TRADE_ROUTES } from './DataLayerRegistry';
import { MOCK_BILATERAL_TENSION_PAIRS } from '../../data/mock/bilateralMatrixData';
import { MOCK_38_COUNTRIES_CII } from '../../data/mock/instabilityData';
import { X, Ship, Info, ShieldAlert, Zap, Globe, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

// Dynamic import of Globe with explicit .default extraction for Next.js 14 App Router
const GlobeComponent = dynamic(
  () => import('react-globe.gl').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-cyber-bg font-mono text-xs text-neon-cyan animate-pulse">
        [ INITIALIZING WAR RISK PREDICTION SYSTEM 3D GLOBE ENGINE ... ]
      </div>
    ),
  }
);

function computeActiveBoundingCenter(
  points: any[],
  arcs: any[]
): { lat: number; lng: number } | null {
  const coords: { lat: number; lng: number }[] = [];

  points.forEach((p) => {
    if (typeof p.lat === 'number' && typeof p.lng === 'number') {
      coords.push({ lat: p.lat, lng: p.lng });
    }
  });

  arcs.forEach((a) => {
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
  };
}

export const Globe3D: React.FC = () => {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialMountRef = useRef(true);

  const lat = useDashboardState((s) => s.lat);
  const lon = useDashboardState((s) => s.lon);
  const zoom = useDashboardState((s) => s.zoom);
  const layers = useDashboardState((s) => s.layers);
  const setCamera = useDashboardState((s) => s.setCamera);
  const autoRotate = useDashboardState((s) => s.autoRotate);
  const setSelectedEntity = useDashboardState((s) => s.setSelectedEntity);
  const selectedEntity = useDashboardState((s) => s.selectedEntity);

  const selectedCountryA = useDashboardState((s) => s.selectedCountryA);
  const selectedCountryB = useDashboardState((s) => s.selectedCountryB);
  const selectCountryPairwise = useDashboardState((s) => s.selectCountryPairwise);
  const clearPairwiseCountries = useDashboardState((s) => s.clearPairwiseCountries);
  const cascadeSourceCountry = useDashboardState((s) => s.cascadeSourceCountry);

  const lastReportedCamera = useRef({ lat, lon, zoom });
  const lastCameraUpdateRef = useRef(0);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredObject, setHoveredObject] = useState<any | null>(null);

  // ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Camera pointOfView sync
  useEffect(() => {
    const last = lastReportedCamera.current;
    const isEcho =
      Math.abs(last.lat - lat) < 0.01 &&
      Math.abs(last.lon - lon) < 0.01 &&
      Math.abs(last.zoom - zoom) < 0.01;
    if (globeRef.current && !isEcho) {
      globeRef.current.pointOfView({ lat, lng: lon, altitude: zoom }, 1000);
    }
  }, [lat, lon, zoom]);

  // Filter Points based on active layers (conflicts, bases, hotspots, nuclear, outages, natural, chokepoints, protests)
  const activePoints = useMemo(() => {
    return MOCK_GLOBE_POINTS.filter((pt) => layers.includes(pt.category));
  }, [layers]);

  // Filter Arcs based on active layers (tradeRoutes, contagionArcs, indiaTradeRoutes)
  const activeArcs = useMemo(() => {
    return MOCK_TRADE_ROUTES.filter((arc) => {
      if ((arc.category === 'trade' || arc.category === 'military') && layers.includes('tradeRoutes')) return true;
      if (arc.category === 'contagion' && layers.includes('contagionArcs')) {
        if (!cascadeSourceCountry) return true;
        return arc.id.includes(cascadeSourceCountry.toLowerCase());
      }
      if (arc.category === 'indiaTrade' && layers.includes('indiaTradeRoutes')) return true;
      return false;
    });
  }, [layers, cascadeSourceCountry]);

  // Pairwise Tension Score Lookup
  const pairwiseTension = useMemo(() => {
    if (!selectedCountryA || !selectedCountryB) return null;
    const pair = MOCK_BILATERAL_TENSION_PAIRS.find(
      (p) =>
        (p.country_a === selectedCountryA && p.country_b === selectedCountryB) ||
        (p.country_a === selectedCountryB && p.country_b === selectedCountryA)
    );

    const cA = MOCK_38_COUNTRIES_CII.find((c) => c.country_code === selectedCountryA);
    const cB = MOCK_38_COUNTRIES_CII.find((c) => c.country_code === selectedCountryB);

    return {
      pair,
      cA,
      cB,
      score: pair ? pair.score : 45,
      driver: pair?.primary_conflict_driver || 'Geopolitical border friction',
    };
  }, [selectedCountryA, selectedCountryB]);

  // Auto-frame camera
  useEffect(() => {
    const center = computeActiveBoundingCenter(activePoints, activeArcs);
    if (!center) return;
    const targetAltitude = 2.3;

    const autoFrame = () => {
      if (globeRef.current) {
        const controls = globeRef.current.controls?.();
        const isUserDragging =
          controls?.state === 0 || controls?.state === 1 || controls?.state === 2;

        if (!isUserDragging) {
          globeRef.current.pointOfView(
            { lat: center.lat, lng: center.lng, altitude: targetAltitude },
            1200
          );
          setCamera(center.lat, center.lng, targetAltitude);
        }
      }
    };

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      const timer = setTimeout(autoFrame, 300);
      return () => clearTimeout(timer);
    } else {
      autoFrame();
    }
  }, [activePoints, activeArcs, setCamera]);

  // Orbit controls
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const configureControls = () => {
      if (globeRef.current) {
        const controls = globeRef.current.controls?.();
        if (controls) {
          controls.enableRotate = true;
          controls.enableZoom = true;
          controls.enablePan = true;
          controls.rotateSpeed = 1.0;
          controls.zoomSpeed = 1.0;
          controls.enableDamping = true;
          controls.dampingFactor = 0.05;
          controls.minAzimuthAngle = -Infinity;
          controls.maxAzimuthAngle = Infinity;
          controls.minPolarAngle = 0.01;
          controls.maxPolarAngle = Math.PI - 0.01;
          controls.autoRotate = autoRotate;
          controls.autoRotateSpeed = 1.2;
          return true;
        }
      }
      return false;
    };

    if (!configureControls()) {
      let attempts = 0;
      timer = setInterval(() => {
        attempts++;
        if (configureControls() || attempts > 50) {
          clearInterval(timer);
        }
      }, 100);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoRotate]);

  const handlePointerDown = () => {
    if (globeRef.current) {
      const controls = globeRef.current.controls?.();
      if (controls) controls.autoRotate = false;
    }
  };

  const handlePointerUp = () => {
    if (globeRef.current) {
      const controls = globeRef.current.controls?.();
      if (controls) controls.autoRotate = autoRotate;
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="w-full h-full relative overflow-hidden bg-cyber-bg select-none touch-none cursor-grab active:cursor-grabbing animate-scale-in"
    >
      <GlobeComponent
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        showGraticules={true}
        showAtmosphere={true}
        atmosphereColor="#00f0ff"
        atmosphereAltitude={0.2}
        animateIn={true}

        // Arcs Rendering (Trade routes + Contagion Arcs + India Trade Routes)
        arcsData={activeArcs}
        arcStartLat={(d: any) => d.startLat}
        arcStartLng={(d: any) => d.startLng}
        arcEndLat={(d: any) => d.endLat}
        arcEndLng={(d: any) => d.endLng}
        arcColor={(d: any) => d.color}
        arcAltitude={(d: any) => d.altitude}
        arcStroke={(d: any) => (d.category === 'contagion' ? 2.5 : 2)}
        arcDashLength={(d: any) => (d.category === 'contagion' ? 0.2 : 0.4)}
        arcDashGap={(d: any) => (d.category === 'contagion' ? 0.1 : 0.2)}
        arcDashAnimateTime={(d: any) => (d.category === 'contagion' ? 1200 : 2200)}
        onArcHover={(arc: any) => setHoveredObject(arc)}
        onArcClick={(arc: any) => setSelectedEntity(arc)}

        // Points Rendering
        pointsData={activePoints}
        pointLat={(d: any) => d.lat}
        pointLng={(d: any) => d.lng}
        pointColor={(d: any) => d.color}
        pointRadius={(d: any) => d.size * 0.5}
        pointAltitude={0.03}
        pointResolution={20}
        onPointHover={(point: any) => setHoveredObject(point)}
        onPointClick={(point: any) => {
          setSelectedEntity(point);
          if (globeRef.current) {
            globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 0.8 }, 1200);
          }
        }}

        // Camera control updates
        onZoom={({ lat, lng, altitude }) => {
          lastReportedCamera.current = { lat, lon: lng, zoom: altitude };
          const now = Date.now();
          if (now - lastCameraUpdateRef.current > 50) {
            lastCameraUpdateRef.current = now;
            setCamera(lat, lng, altitude);
          }
        }}
      />

      {/* ── Section 2: Pairwise Hostility Popover HUD Overlay ── */}
      {selectedCountryA && (
        <div className="absolute top-4 left-4 max-w-xs w-full glass-panel p-3.5 rounded-xl z-40 space-y-2 border border-brand-border animate-slide-down">
          <div className="flex items-center justify-between border-b border-border-subtle pb-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-brand flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Bilateral Pair Selection
            </span>
            <button onClick={clearPairwiseCountries} className="btn-icon w-4 h-4">
              <X className="w-3 h-3 text-text-muted" />
            </button>
          </div>

          <div className="text-xs text-text-secondary">
            {!selectedCountryB ? (
              <div className="p-2 rounded bg-surface-elevated text-center font-mono">
                <span className="text-brand font-bold">1st Selected: {selectedCountryA}</span>
                <p className="text-[10px] text-text-muted mt-0.5">Click a 2nd country in Bilateral Matrix or Theater Watch to pair!</p>
              </div>
            ) : (
              pairwiseTension && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-surface-elevated font-mono">
                    <span className="font-bold text-text-primary">{pairwiseTension.cA?.flag} {selectedCountryA}</span>
                    <div className="text-center">
                      <span className="text-[9px] text-text-muted block">HOSTILITY</span>
                      <span className="font-extrabold text-sm text-status-critical">{pairwiseTension.score}/100</span>
                    </div>
                    <span className="font-bold text-text-primary">{pairwiseTension.cB?.flag} {selectedCountryB}</span>
                  </div>
                  <p className="text-[10px] font-sans text-text-muted leading-tight">
                    <strong className="text-text-primary">Driver:</strong> {pairwiseTension.driver}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ── Section 3: Cascade View Active Source Indicator ── */}
      {cascadeSourceCountry && layers.includes('contagionArcs') && (
        <div className="absolute bottom-4 right-4 glass-panel px-3 py-2 rounded-xl z-40 border border-status-critical-border flex items-center gap-2 text-xs font-mono text-white animate-pulse">
          <Zap className="w-4 h-4 text-status-critical" />
          <span>Active Contagion Cascade Source: <strong>{cascadeSourceCountry}</strong></span>
          <button
            onClick={() => useDashboardState.getState().setCascadeSourceCountry(null)}
            className="btn-icon w-4 h-4 text-text-muted hover:text-white ml-2"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Hover Quick Tooltip */}
      {hoveredObject && !selectedEntity && (
        <div className="absolute bottom-4 left-4 bg-cyber-panel/90 backdrop-blur-md border border-neon-cyan/50 px-3 py-2 rounded-lg font-mono text-xs text-white z-30 shadow-xl pointer-events-none">
          <div className="text-neon-cyan font-bold flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            {hoveredObject.name || hoveredObject.label}
          </div>
          {hoveredObject.cargoType && (
            <div className="text-[11px] text-cyber-textMuted mt-0.5">
              Cargo / Vector: {hoveredObject.cargoType}
            </div>
          )}
        </div>
      )}

      {/* Selected Entity Popover Card */}
      {selectedEntity && (
        <div className="absolute top-4 right-4 max-w-sm w-full bg-cyber-panel/95 backdrop-blur-md border border-neon-cyan/60 rounded-xl p-4 z-40 shadow-2xl font-mono text-xs space-y-3">
          <div className="flex items-start justify-between border-b border-cyber-border pb-2">
            <div>
              <span className="text-[9px] uppercase px-1.5 py-0.5 bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan font-bold rounded">
                {selectedEntity.category || 'ROUTE TELEMETRY'}
              </span>
              <h4 className="text-sm font-bold text-white mt-1">
                {selectedEntity.name || selectedEntity.label}
              </h4>
            </div>
            <button
              onClick={() => setSelectedEntity(null)}
              className="text-cyber-textMuted hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Route Details */}
          {selectedEntity.cargoType && (
            <div className="space-y-2 text-cyber-textMain">
              <div className="flex items-center justify-between">
                <span className="text-cyber-textMuted flex items-center gap-1">
                  <Ship className="w-3.5 h-3.5 text-neon-cyan" /> Vessel / Vessel Class:
                </span>
                <span className="font-semibold text-white">{selectedEntity.vesselType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyber-textMuted">Cargo / Asset / Vector:</span>
                <span className="font-semibold text-neon-cyan">{selectedEntity.cargoType}</span>
              </div>
              {selectedEntity.chokepoints && (
                <div>
                  <span className="text-cyber-textMuted block mb-1">Chokepoint Dependencies:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedEntity.chokepoints?.map((c: string) => (
                      <span key={c} className="px-2 py-0.5 bg-cyber-bg border border-cyber-border rounded text-[10px] text-neon-amber font-bold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2 border-t border-cyber-border flex items-center justify-between">
                <span className="text-cyber-textMuted">Status:</span>
                <span className="px-2 py-0.5 bg-neon-coral/20 border border-neon-coral/40 text-neon-coral font-extrabold rounded">
                  {selectedEntity.status}
                </span>
              </div>
            </div>
          )}

          {/* Point Details */}
          {selectedEntity.details && (
            <div className="space-y-1.5 text-cyber-textMain">
              <div className="flex justify-between">
                <span className="text-cyber-textMuted">Severity / Status:</span>
                <span className="font-bold text-neon-coral">{selectedEntity.details.severity}</span>
              </div>
              {selectedEntity.details.description && (
                <div className="text-[11px] text-cyber-textMain pt-1 border-t border-cyber-border">
                  {selectedEntity.details.description}
                </div>
              )}
              <div className="flex justify-between text-[10px]">
                <span className="text-cyber-textMuted">Telemetry Age:</span>
                <span className="text-cyber-textMuted">{selectedEntity.details.updatedAgo}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setSelectedEntity(null)}
            className="w-full py-1.5 bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold rounded hover:bg-neon-cyan/30 transition-all text-center block"
          >
            Close Telemetry Panel
          </button>
        </div>
      )}
    </div>
  );
};
