import React, { useState } from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { Shield, ChevronDown, Anchor, Radio, ArrowRight, ArrowUp, Zap, Share2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useDashboardState } from '../../store/useDashboardState';

const SEVERITY_CONFIG = {
  CRITICAL: {
    label:  'CRITICAL',
    bg:     'var(--critical-bg)',
    color:  'var(--critical)',
    border: 'var(--critical-border)',
    dot:    'var(--critical)',
  },
  HIGH: {
    label:  'HIGH RISK',
    bg:     'var(--warning-bg)',
    color:  'var(--warning)',
    border: 'var(--warning-border)',
    dot:    'var(--warning)',
  },
} as const;

const ASSET_ICONS = {
  naval: Anchor,
  air: Shield,
  cyber: Radio,
};

const THEATER_COUNTRY_MAP: Record<string, string> = {
  'th-1': 'YEM', // Bab al-Mandab -> Yemen
  'th-2': 'IRN', // Strait of Hormuz -> Iran
  'th-3': 'UKR', // Suwalki Gap -> Ukraine / Eastern Europe
};

export const TheaterWatchWidget: React.FC = () => {
  const {
    isLiveMode,
    isLoadingIntelligence,
    intelligenceData,
    setCascadeSourceCountry,
    cascadeSourceCountry,
    layers,
    setLayers,
    setActiveTab,
    selectCountryPairwise,
  } = useDashboardState();
  const [showLegend, setShowLegend] = useState(false);

  const theaters = intelligenceData.theaters;

  const triggerCascadeView = (theaterId: string, countryCode: string) => {
    setCascadeSourceCountry(countryCode);
    if (!layers.includes('contagionArcs')) {
      setLayers([...layers, 'contagionArcs']);
    }
    selectCountryPairwise(countryCode);
    setActiveTab('globe');
  };

  return (
    <WidgetChrome
      title="Theater Surveillance & Cascade"
      subtitle="Active operational sectors & contagion vectors"
      helpText="Surveillance grid tracking active theaters, military asset deployments, & contagion cascade triggers."
      badgeProps={{
        status: isLiveMode ? 'LIVE' : 'OFFLINE',
        count: theaters.length,
      }}
      isLoading={isLoadingIntelligence}
      minWidth={280}
      headerRightContent={
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold mr-1 bg-status-critical-bg text-status-critical border border-status-critical-border">
          3 New
        </span>
      }
    >
      <div className="flex flex-col h-full gap-3">
        {/* ── Legend ── */}
        <div className="rounded-lg overflow-hidden bg-surface-elevated border border-border-subtle">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors duration-150 text-text-secondary"
            aria-expanded={showLegend}
            aria-controls="theater-legend"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
              Status Legend
            </span>
            <ChevronDown
              className={clsx(
                'w-3.5 h-3.5 transition-transform duration-200',
                showLegend && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </button>

          {showLegend && (
            <div
              id="theater-legend"
              className="px-3 pb-3 pt-1 grid grid-cols-2 gap-2 animate-slide-up border-t border-border-subtle"
            >
              {(['CRITICAL', 'HIGH'] as const).map((sev) => {
                const cfg = SEVERITY_CONFIG[sev];
                return (
                  <div key={sev} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: cfg.dot }}
                      aria-hidden="true"
                    />
                    <span className="text-xs text-text-muted">
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Theater Cards ── */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5" role="list" aria-label="Active military theaters">
          {theaters.map((t) => {
            const cfg          = SEVERITY_CONFIG[t.severity];
            const isEscalating = t.direction.toLowerCase().includes('escalat');
            const countryCode  = THEATER_COUNTRY_MAP[t.id] || 'YEM';
            const isCascadeActive = cascadeSourceCountry === countryCode;

            return (
              <article
                key={t.id}
                role="listitem"
                className={clsx(
                  'rounded-xl p-3.5 space-y-3 transition-all duration-150 border h-fit',
                  isCascadeActive
                    ? 'border-status-critical-border bg-status-critical-bg/20 shadow-md'
                    : 'bg-surface-elevated border-border-subtle hover:border-border-default'
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-0.5"
                      style={{ background: cfg.dot }}
                      aria-hidden="true"
                    />
                    <h4 className="text-sm font-semibold leading-snug text-text-primary">
                      {t.name}
                    </h4>
                  </div>
                  <span
                    className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold shrink-0"
                    style={{
                      background: cfg.bg,
                      color: cfg.color,
                      border: `1px solid ${cfg.border}`,
                    }}
                  >
                    {cfg.label}
                  </span>
                </div>

                {/* Asset counts */}
                <div className="grid grid-cols-3 gap-3 p-2.5 rounded-lg bg-surface-base border border-border-subtle">
                  {t.assets.map((a) => {
                    const Icon = ASSET_ICONS[a.type] || Shield;
                    return (
                      <div key={a.label} className="flex flex-col items-center gap-1">
                        <Icon className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
                        <span className="font-mono font-bold text-sm text-text-primary">
                          {a.count}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          {a.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Status & Cascade Trigger Button */}
                <div className="flex items-center justify-between pt-1 border-t border-border-subtle gap-2">
                  <span className="text-xs text-text-muted truncate">
                    {t.status}
                  </span>
                  
                  {/* Section 3 Entrypoint: Cascade View Trigger */}
                  <button
                    onClick={() => triggerCascadeView(t.id, countryCode)}
                    className={clsx(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all duration-150 shrink-0',
                      isCascadeActive
                        ? 'bg-status-critical text-white shadow-sm'
                        : 'bg-brand/10 text-brand border border-brand/30 hover:bg-brand/20'
                    )}
                    title={`Trigger contagion cascade analysis for ${countryCode}`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>{isCascadeActive ? 'Cascade Active' : 'Cascade View'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </WidgetChrome>
  );
};
