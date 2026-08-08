import React, { useState } from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { VerticalProbabilityBars } from '../common/VerticalProbabilityBars';
import { clsx } from 'clsx';
import { useDashboardState } from '../../store/useDashboardState';
import { ForecastCategory, ForecastRegion } from '../../data/mockIntelligence';

type Category = 'ALL' | ForecastCategory;
type Region   = 'ALL' | ForecastRegion;

const CONFIDENCE_CONFIG = {
  HIGH:   { bg: 'var(--success-bg)',  color: 'var(--success)',  border: 'var(--success-border)'  },
  MEDIUM: { bg: 'var(--warning-bg)',  color: 'var(--warning)',  border: 'var(--warning-border)'  },
  LOW:    { bg: 'var(--critical-bg)', color: 'var(--critical)', border: 'var(--critical-border)' },
} as const;

const PROB_COLOR = (p: number) =>
  p >= 80 ? 'var(--critical)' : p >= 60 ? 'var(--warning)' : 'var(--success)';

export const ForecastFeedWidget: React.FC = () => {
  const { isLiveMode, isLoadingIntelligence, intelligenceData } = useDashboardState();
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');
  const [activeRegion,   setActiveRegion]   = useState<Region>('ALL');

  const forecasts = intelligenceData.forecasts;

  const categories: Category[] = ['ALL', 'LOGISTICS', 'COMMODITIES', 'DEFENSE'];
  const regions: Region[]      = ['ALL', 'MIDDLE EAST', 'INDO-PACIFIC', 'EUROPE'];

  const filteredForecasts = forecasts.filter((f) => {
    const matchCat = activeCategory === 'ALL' || f.category === activeCategory;
    const matchReg = activeRegion   === 'ALL' || f.region   === activeRegion;
    return matchCat && matchReg;
  });

  return (
    <WidgetChrome
      title="Predictive Forecasts"
      subtitle="Probabilistic intelligence outlook"
      helpText="Probabilistic intelligence forecasts evaluated using machine learning models and historical escalation benchmarks."
      badgeProps={{
        status: isLiveMode ? 'LIVE' : 'OFFLINE',
        count: filteredForecasts.length,
      }}
      isLoading={isLoadingIntelligence}
      minWidth={280}
    >
      <div className="flex flex-col h-full gap-3">
        {/* ── Filters ── */}
        <div className="space-y-2">
          {/* Category */}
          <div className="flex items-center gap-1 flex-wrap" role="group" aria-label="Filter by category">
            <span className="section-label text-[10px] mr-1">Category</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                aria-pressed={activeCategory === c}
                className={clsx('filter-tab', activeCategory === c && 'active')}
              >
                {c === 'ALL' ? 'All' : c.charAt(0) + c.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Region */}
          <div
            className="flex items-center gap-1 flex-wrap pb-2 border-b border-border-subtle"
            role="group"
            aria-label="Filter by region"
          >
            <span className="section-label text-[10px] mr-1">Region</span>
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                aria-pressed={activeRegion === r}
                className={clsx('filter-tab', activeRegion === r && 'active')}
              >
                {r === 'ALL' ? 'All' : r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ── Forecast List ── */}
        <div
          className="flex-1 overflow-y-auto space-y-2.5 pr-0.5"
          role="list"
          aria-label="Forecast items"
        >
          {filteredForecasts.length === 0 ? (
            <div className="text-center py-8 text-sm text-text-muted">
              No forecasts match the selected filters
            </div>
          ) : (
            filteredForecasts.map((item, idx) => {
              const probColor = PROB_COLOR(item.probability);
              const confCfg   = CONFIDENCE_CONFIG[item.confidence];

              return (
                <article
                  key={item.id}
                  role="listitem"
                  className={clsx(
                    'rounded-xl p-3.5 space-y-2.5 transition-all duration-150 bg-surface-elevated border border-border-subtle hover:border-border-default animate-slide-up',
                    `stagger-${Math.min(idx + 3, 6)}`
                  )}
                >
                  {/* Title + Probability */}
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-xs font-semibold leading-snug flex-1 text-text-primary">
                      {item.title}
                    </h4>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className="font-mono font-bold text-base leading-none"
                        style={{ color: probColor }}
                      >
                        {item.probability}%
                      </span>
                      <span className="text-[10px] text-text-muted">
                        probability
                      </span>
                    </div>
                  </div>

                  {/* Vertical Probability Spectrum Bars */}
                  <div className="flex items-center justify-between pt-1">
                    <VerticalProbabilityBars probability={item.probability} color={probColor} height={28} />
                    <span className="font-mono text-[10px] text-text-muted">
                      Spectrum Density
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{
                          background: confCfg.bg,
                          color: confCfg.color,
                          border: `1px solid ${confCfg.border}`,
                        }}
                      >
                        {item.confidence.charAt(0) + item.confidence.slice(1).toLowerCase()} confidence
                      </span>
                    </div>
                    <span className="text-xs text-text-muted">
                      Horizon: <strong className="text-text-secondary">{item.horizon}</strong>
                    </span>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </WidgetChrome>
  );
};
