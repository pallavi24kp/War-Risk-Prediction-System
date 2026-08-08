import React, { useState } from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { MOCK_REGIONAL_HEADLINES } from '../../data/mock/dbPanelsData';
import { RegionalHeadlineItem } from '../../lib/types';
import { Newspaper, ExternalLink, Globe, Flag } from 'lucide-react';
import { clsx } from 'clsx';
import { useDashboardState } from '../../store/useDashboardState';

export const RegionalHeadlinesWidget: React.FC = () => {
  const { isLiveMode, isLoadingIntelligence } = useDashboardState();
  const [activeRegionTab, setActiveRegionTab] = useState<'TOP10' | 'INDIA' | 'USA'>('TOP10');

  const headlines: RegionalHeadlineItem[] = MOCK_REGIONAL_HEADLINES;

  const filteredHeadlines = activeRegionTab === 'TOP10'
    ? headlines.slice(0, 10)
    : headlines.filter((h) => h.region === activeRegionTab);

  return (
    <WidgetChrome
      title="Regional Headlines & Intel Stream"
      subtitle="Top 10 Headlines with India & USA Dedicated Panels"
      helpText="Database-backed regional news & intelligence headlines aggregated from global press wires & local media."
      badgeProps={{
        status: isLiveMode ? 'LIVE' : 'OFFLINE',
        count: filteredHeadlines.length,
      }}
      isLoading={isLoadingIntelligence}
      minWidth={300}
    >
      <div className="flex flex-col h-full gap-2.5">
        {/* ── Dedicated Tabs (Top 10 / India / USA) ── */}
        <div className="glass-pill flex items-center p-1 rounded-xl gap-1 shrink-0 bg-surface-elevated border border-border-subtle">
          <button
            onClick={() => setActiveRegionTab('TOP10')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-semibold transition-all duration-150',
              activeRegionTab === 'TOP10'
                ? 'bg-brand text-white shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <Globe className="w-3 h-3" />
            <span>Top 10 Overall</span>
          </button>

          <button
            onClick={() => setActiveRegionTab('INDIA')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-semibold transition-all duration-150',
              activeRegionTab === 'INDIA'
                ? 'bg-brand text-white shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <span>🇮🇳 India Panel</span>
          </button>

          <button
            onClick={() => setActiveRegionTab('USA')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-semibold transition-all duration-150',
              activeRegionTab === 'USA'
                ? 'bg-brand text-white shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <span>🇺🇸 USA Panel</span>
          </button>
        </div>

        {/* ── Headlines List ── */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
          {filteredHeadlines.map((h) => (
            <article
              key={h.id}
              className="p-3 rounded-xl bg-surface-base border border-border-subtle hover:border-border-default transition-all duration-150 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-subtle text-brand border border-brand-border uppercase">
                    {h.region}
                  </span>
                  <span className="font-mono text-[10px] text-text-muted">
                    {h.source}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted font-mono">
                  {h.timestamp}
                </span>
              </div>

              <h5 className="text-xs font-semibold text-text-primary leading-snug">
                {h.title}
              </h5>

              <p className="text-[11px] text-text-secondary leading-snug">
                {h.summary}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-border-subtle text-[10px]">
                <span className="text-text-muted font-mono">Relevance Score: {(h.relevance_score * 100).toFixed(0)}%</span>
                <button className="flex items-center gap-1 text-brand font-medium hover:underline">
                  Read Wire <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </WidgetChrome>
  );
};
