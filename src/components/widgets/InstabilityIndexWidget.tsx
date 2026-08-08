import React, { useState } from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { Bookmark, ArrowUpRight, ArrowDownRight, Minus, Search, Activity, Sliders } from 'lucide-react';
import { clsx } from 'clsx';
import { useDashboardState } from '../../store/useDashboardState';
import { MOCK_38_COUNTRIES_CII } from '../../data/mock/instabilityData';
import { CountryInstabilityEntry } from '../../lib/types';

export const InstabilityIndexWidget: React.FC = () => {
  const { isLiveMode, isLoadingIntelligence } = useDashboardState();
  const [bookmarked, setBookmarked] = useState<string[]>(['YEM', 'UKR', 'TWN']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCountry, setExpandedCountry] = useState<string | null>('YEM');

  const leaderboard: CountryInstabilityEntry[] = MOCK_38_COUNTRIES_CII;

  const filtered = leaderboard.filter(
    (item) =>
      item.country_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBookmark = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const scoreColor = (score: number) =>
    score >= 75 ? 'var(--critical)' : score >= 50 ? 'var(--warning)' : 'var(--success)';

  return (
    <WidgetChrome
      title="Country Instability Index (CII)"
      subtitle="38-Country ML Risk Leaderboard"
      helpText="Live Country Instability Index computed via GDELT NLP sentiment, kinetic event density, & macro trade concentration features."
      badgeProps={{
        status: isLiveMode ? 'LIVE' : 'OFFLINE',
        count: leaderboard.length,
        timestamp: '1m ago',
      }}
      isLoading={isLoadingIntelligence}
      minWidth={320}
    >
      <div className="flex flex-col h-full gap-2.5">
        {/* ── Search & Filter ── */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter 38 countries by name or ISO3..."
            className="input pl-8 py-1.5 text-xs w-full"
          />
        </div>

        {/* ── Column Headers ── */}
        <div className="grid grid-cols-[28px_1fr_64px_76px_24px_24px] gap-2 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border-subtle items-center">
          <span className="text-[10px] font-mono uppercase font-semibold text-text-muted">#</span>
          <span className="text-[10px] font-mono uppercase font-semibold text-text-muted">Country</span>
          <span className="text-[10px] font-mono uppercase font-semibold text-text-muted text-right">Score</span>
          <span className="text-[10px] font-mono uppercase font-semibold text-text-muted text-center">95% CI</span>
          <span className="text-[10px] font-mono uppercase font-semibold text-text-muted text-center">Tr</span>
          <span className="text-[10px] font-mono uppercase font-semibold text-text-muted text-center"></span>
        </div>

        {/* ── 38 Country Rows ── */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5" role="list" aria-label="Country instability rankings">
          {filtered.map((item) => {
            const isBookmarked = bookmarked.includes(item.country_code);
            const isExpanded = expandedCountry === item.country_code;
            const color = scoreColor(item.score);

            return (
              <div
                key={item.country_code}
                role="listitem"
                onClick={() => setExpandedCountry(isExpanded ? null : item.country_code)}
                className={clsx(
                  'rounded-xl overflow-hidden transition-all duration-150 border cursor-pointer select-none',
                  isExpanded
                    ? 'border-brand-border bg-surface-elevated shadow-md'
                    : isBookmarked
                    ? 'border-border-default bg-surface-elevated/70'
                    : 'border-border-subtle bg-surface-base hover:bg-surface-elevated/40'
                )}
              >
                {/* Main Row */}
                <div className="grid grid-cols-[28px_1fr_64px_76px_24px_24px] items-center gap-2 px-3 py-2">
                  {/* Rank */}
                  <span className="text-xs font-mono font-bold text-text-muted">
                    {item.rank}
                  </span>

                  {/* Flag + Name */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base leading-none shrink-0" aria-hidden="true">
                      {item.flag}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-text-primary">
                        {item.country_name}
                      </div>
                      <div className="font-mono text-[10px] text-text-muted">
                        {item.country_code}
                      </div>
                    </div>
                  </div>

                  {/* Score (0-100) */}
                  <span className="font-mono font-bold text-sm text-right" style={{ color }}>
                    {item.score.toFixed(1)}
                  </span>

                  {/* Confidence Interval (low - high) */}
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-mono text-[10px] text-text-secondary bg-surface-base px-1.5 py-0.5 rounded border border-border-subtle">
                      [{item.confidence_low.toFixed(1)}, {item.confidence_high.toFixed(1)}]
                    </span>
                  </div>

                  {/* Trend Icon */}
                  <span className="flex items-center justify-center" aria-label={`Trend: ${item.trend}`}>
                    {item.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-status-critical" />}
                    {item.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-status-success" />}
                    {item.trend === 'stable' && <Minus className="w-3.5 h-3.5 text-text-muted" />}
                  </span>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleBookmark(item.country_code, e)}
                    aria-label={isBookmarked ? `Remove ${item.country_name} bookmark` : `Bookmark ${item.country_name}`}
                    className={clsx('btn-icon w-5 h-5 justify-self-center', isBookmarked ? 'text-brand' : 'text-text-muted')}
                  >
                    <Bookmark className={clsx('w-3 h-3', isBookmarked && 'fill-current')} />
                  </button>
                </div>

                {/* Expanded Feature Snapshot & SVG Bar */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-border-subtle bg-surface-base/80 space-y-2.5 animate-slide-down">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-brand font-semibold flex items-center gap-1">
                        <Sliders className="w-3 h-3" /> Feature Snapshot Telemetry
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">
                        CII Score Confidence Band: ±{(item.confidence_high - item.confidence_low).toFixed(1)}
                      </span>
                    </div>

                    {/* SVG Progress Bar for Score & Confidence Span */}
                    <div className="relative w-full h-3 bg-surface-elevated rounded-full overflow-hidden border border-border-subtle">
                      {/* Confidence Span Band */}
                      <div
                        className="absolute top-0 bottom-0 bg-brand/30 rounded-full"
                        style={{
                          left: `${item.confidence_low}%`,
                          width: `${Math.max(2, item.confidence_high - item.confidence_low)}%`,
                        }}
                      />
                      {/* Score Indicator */}
                      <div
                        className="absolute top-0 bottom-0 rounded-full transition-all duration-300"
                        style={{
                          left: 0,
                          width: `${item.score}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {Object.entries(item.feature_snapshot).map(([key, val]) => (
                        <div key={key} className="p-1.5 rounded-lg bg-surface-elevated border border-border-subtle text-[10px]">
                          <span className="text-text-muted block truncate font-mono">{key}</span>
                          <span className="font-mono font-bold text-text-primary">{val.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-6 text-xs text-text-muted">
              No country matches "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </WidgetChrome>
  );
};
