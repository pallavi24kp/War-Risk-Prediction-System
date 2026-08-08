import React, { useState } from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { Download, Star, Tag, ExternalLink, Radio, ChevronDown, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { useDashboardState } from '../../store/useDashboardState';
import { MOCK_REGIONAL_SIGNALS } from '../../data/mock/signalsData';
import { RegionalSignalItem, SignalRegion } from '../../lib/types';

const CATEGORY_CONFIG: Record<
  string,
  { label: string; bg: string; color: string; border: string }
> = {
  KINETIC:  { label: 'Kinetic',  bg: 'var(--critical-bg)',  color: 'var(--critical)',  border: 'var(--critical-border)'  },
  NATURAL:  { label: 'Natural',  bg: 'var(--warning-bg)',   color: 'var(--warning)',   border: 'var(--warning-border)'   },
  ECONOMIC: { label: 'Economic', bg: 'var(--info-bg)',      color: 'var(--info)',      border: 'var(--info-border)'      },
  CYBER:    { label: 'Cyber',    bg: 'var(--brand-subtle)', color: 'var(--brand)',     border: 'var(--brand-border)'     },
};

const REGION_LABELS: Record<SignalRegion | 'ALL', string> = {
  ALL: 'All Regions',
  INDIA: 'India / South Asia',
  USA: 'United States',
  EUROPE: 'Europe / Baltic',
  MIDDLE_EAST: 'Middle East',
  INDO_PACIFIC: 'Indo-Pacific',
  GLOBAL: 'Global / Multi-Region',
};

export const SignalFeedWidget: React.FC = () => {
  const { isLiveMode, isLoadingIntelligence } = useDashboardState();
  const [highlighted, setHighlighted] = useState<string[]>(['sig-me-1', 'sig-ind-1']);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<SignalRegion | 'ALL'>('ALL');

  const allSignals: RegionalSignalItem[] = MOCK_REGIONAL_SIGNALS;

  // Filter signals client-side by region field
  const filteredSignals = selectedRegionFilter === 'ALL'
    ? allSignals
    : allSignals.filter((sig) => sig.region === selectedRegionFilter);

  const toggleHighlight = (id: string) => {
    setHighlighted((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <WidgetChrome
      title="Live Escalation Signal Feed"
      subtitle="Region-Filtered OSINT & Telemetry Stream"
      helpText="High-velocity intelligence signals filtered by geopolitical region (India, USA, Europe, Middle East, Indo-Pacific)."
      badgeProps={{
        status: isLiveMode ? 'LIVE' : 'OFFLINE',
        count: filteredSignals.length,
      }}
      isLoading={isLoadingIntelligence}
      minWidth={320}
      headerRightContent={
        <div className="flex items-center gap-1 mr-1">
          <span className={clsx(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold',
            isLiveMode
              ? 'animate-pulse bg-status-success-bg text-status-success border border-status-success-border'
              : 'bg-status-critical-bg text-status-critical border border-status-critical-border'
          )}>
            <Radio className="w-3 h-3" aria-hidden="true" />
            {isLiveMode ? 'Live' : 'Offline'}
          </span>
          <button
            className="btn-icon"
            title="Download feed as JSON"
            aria-label="Download signal feed"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      <div className="flex flex-col h-full gap-2.5">
        {/* ── Region Filter Dropdown ── */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-surface-elevated border border-border-subtle">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Filter className="w-3.5 h-3.5 text-brand" />
            <span className="font-mono text-[10px] uppercase font-semibold">Region Filter:</span>
          </div>

          <div className="relative">
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value as SignalRegion | 'ALL')}
              className="glass-pill bg-surface-base text-xs font-semibold text-text-primary px-3 py-1 pr-7 rounded-lg border border-border-default focus:border-brand outline-none cursor-pointer appearance-none"
              aria-label="Filter signals by region"
            >
              {(Object.keys(REGION_LABELS) as (SignalRegion | 'ALL')[]).map((rKey) => (
                <option key={rKey} value={rKey} className="bg-surface-panel text-white">
                  {REGION_LABELS[rKey]}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* ── Signal List ── */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-0.5" role="feed" aria-label="Signal feed">
          {filteredSignals.map((sig) => {
            const isStar = highlighted.includes(sig.id);
            const catCfg = CATEGORY_CONFIG[sig.category] ?? CATEGORY_CONFIG.KINETIC;

            return (
              <article
                key={sig.id}
                className={clsx(
                  'rounded-xl p-3 space-y-2.5 transition-all duration-150 border',
                  isStar
                    ? 'bg-surface-elevated border-border-default shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                    : 'bg-surface-base border-border-subtle shadow-none hover:bg-surface-elevated/50'
                )}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Category badge */}
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
                      style={{
                        background: catCfg.bg,
                        color: catCfg.color,
                        border: `1px solid ${catCfg.border}`,
                      }}
                    >
                      {catCfg.label}
                    </span>
                    {/* Region Tag */}
                    <span className="font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded bg-brand-subtle text-brand border border-brand-border uppercase">
                      {sig.region.replace('_', ' ')}
                    </span>
                    {/* Source */}
                    <span className="font-mono text-[10px] font-medium text-text-muted">
                      {sig.source}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-text-muted font-mono">
                      {sig.time}
                    </span>
                    <button
                      onClick={() => toggleHighlight(sig.id)}
                      aria-label={isStar ? 'Remove from highlights' : 'Add to highlights'}
                      aria-pressed={isStar}
                      className={clsx(
                        'btn-icon w-5 h-5',
                        isStar ? 'text-status-warning' : 'text-text-muted'
                      )}
                    >
                      <Star
                        className={clsx('w-3.5 h-3.5', isStar && 'fill-current')}
                      />
                    </button>
                  </div>
                </div>

                {/* Status + Headline */}
                <div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.05em] mb-1 block"
                    style={{ color: catCfg.color }}
                  >
                    {sig.status} · Severity {sig.severity_score}/100
                  </span>
                  <p className="text-xs font-medium leading-snug text-text-primary">
                    {sig.headline}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1.5 border-t border-border-subtle">
                  <span className="flex items-center gap-1 text-[10px] text-text-muted">
                    <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                    {sig.category}
                  </span>
                  <button
                    className="flex items-center gap-1 text-[10px] font-medium transition-colors duration-150 text-brand"
                    aria-label={`View full signal details for: ${sig.headline}`}
                  >
                    Details
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}

          {filteredSignals.length === 0 && (
            <div className="text-center py-8 text-xs text-text-muted">
              No active escalation signals found for {REGION_LABELS[selectedRegionFilter]}
            </div>
          )}
        </div>
      </div>
    </WidgetChrome>
  );
};
