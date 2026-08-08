import React, { useState, useMemo } from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { MOCK_BILATERAL_TENSION_PAIRS } from '../../data/mock/bilateralMatrixData';
import { MOCK_38_COUNTRIES_CII } from '../../data/mock/instabilityData';
import { BilateralTensionPair } from '../../lib/types';
import { Search, ShieldAlert, Zap, Info, Filter } from 'lucide-react';
import { clsx } from 'clsx';

export const BilateralTensionMatrix: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<BilateralTensionPair | null>(
    MOCK_BILATERAL_TENSION_PAIRS.find((p) => (p.country_a === 'UKR' && p.country_b === 'RUS') || (p.country_a === 'RUS' && p.country_b === 'UKR')) || null
  );
  const [filterQuery, setFilterQuery] = useState('');
  const [minHostilityThreshold, setMinHostilityThreshold] = useState(0);

  const countries = useMemo(() => {
    return MOCK_38_COUNTRIES_CII.map((c) => ({
      code: c.country_code,
      name: c.country_name,
      flag: c.flag,
    }));
  }, []);

  // Map pairs into a fast lookup key
  const pairMap = useMemo(() => {
    const map = new Map<string, BilateralTensionPair>();
    MOCK_BILATERAL_TENSION_PAIRS.forEach((p) => {
      map.set(`${p.country_a}-${p.country_b}`, p);
      map.set(`${p.country_b}-${p.country_a}`, p);
    });
    return map;
  }, []);

  const getScore = (codeA: string, codeB: string): number => {
    if (codeA === codeB) return 0;
    const p = pairMap.get(`${codeA}-${codeB}`);
    return p ? p.score : 0;
  };

  const getCellColor = (score: number, isSelected: boolean) => {
    if (score === 0) return 'rgba(255, 255, 255, 0.03)';
    if (isSelected) return 'var(--brand)';
    if (score >= 75) return `rgba(244, 63, 94, ${0.3 + (score / 100) * 0.7})`;
    if (score >= 50) return `rgba(245, 158, 11, ${0.3 + (score / 100) * 0.6})`;
    return `rgba(16, 185, 129, ${0.15 + (score / 100) * 0.4})`;
  };

  const filteredCountries = useMemo(() => {
    if (!filterQuery) return countries;
    return countries.filter(
      (c) =>
        c.code.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [countries, filterQuery]);

  return (
    <WidgetChrome
      title="Bilateral Aggression & Hostility Matrix (38×38)"
      subtitle="703 Pairwise State-on-State Tension Scores"
      helpText="Heatmap grid mapping pairwise bilateral hostility scores (0-100) between 38 countries using OSINT GDELT Goldstein scale and kinetic event frequency."
      badgeProps={{
        status: 'LIVE',
        count: MOCK_BILATERAL_TENSION_PAIRS.length,
        timestamp: 'Updated 4m ago',
      }}
      minWidth={360}
    >
      <div className="flex flex-col h-full gap-3 overflow-hidden">
        {/* ── Controls & Filter Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-surface-elevated border border-border-subtle shrink-0">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Highlight country in matrix..."
              className="input pl-8 py-1 text-xs w-full"
            />
          </div>

          {/* Min Hostility Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-brand" />
            <span className="text-[10px] text-text-muted font-mono uppercase">Min Score:</span>
            <input
              type="range"
              min="0"
              max="80"
              step="10"
              value={minHostilityThreshold}
              onChange={(e) => setMinHostilityThreshold(Number(e.target.value))}
              className="w-24 accent-brand cursor-pointer"
            />
            <span className="font-mono text-xs font-bold text-brand">{minHostilityThreshold}+</span>
          </div>
        </div>

        {/* ── Matrix Heatmap View Container ── */}
        <div className="flex-1 min-h-0 flex flex-col xl:flex-row gap-3">
          {/* Heatmap Grid (Scrollable SVG/CSS Grid) */}
          <div className="flex-1 overflow-auto rounded-xl border border-border-subtle bg-surface-base p-3 relative">
            <div className="inline-block min-w-max">
              {/* Top X Header */}
              <div className="flex ml-12 mb-1">
                {filteredCountries.map((c) => (
                  <div
                    key={`top-${c.code}`}
                    className="w-7 text-[9px] font-mono text-text-muted text-center transform -rotate-45 origin-bottom-left truncate"
                    title={`${c.flag} ${c.name} (${c.code})`}
                  >
                    {c.code}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {filteredCountries.map((rowC) => (
                <div key={`row-${rowC.code}`} className="flex items-center mb-0.5">
                  {/* Row Y Label */}
                  <span
                    className="w-12 text-[10px] font-mono font-bold text-text-muted pr-2 text-right truncate shrink-0"
                    title={`${rowC.flag} ${rowC.name}`}
                  >
                    {rowC.code}
                  </span>

                  {/* Grid Cells */}
                  {filteredCountries.map((colC) => {
                    const score = getScore(rowC.code, colC.code);
                    const isSelf = rowC.code === colC.code;
                    const isSelected =
                      selectedPair !== null &&
                      ((selectedPair.country_a === rowC.code && selectedPair.country_b === colC.code) ||
                        (selectedPair.country_a === colC.code && selectedPair.country_b === rowC.code));
                    const isBelowThreshold = score < minHostilityThreshold && score > 0;

                    return (
                      <button
                        key={`${rowC.code}-${colC.code}`}
                        disabled={isSelf}
                        onClick={() => {
                          const pair = pairMap.get(`${rowC.code}-${colC.code}`);
                          if (pair) setSelectedPair(pair);
                        }}
                        title={
                          isSelf
                            ? `${rowC.name} (Self)`
                            : `${rowC.code} ↔ ${colC.code}: Hostility Score ${score}/100`
                        }
                        className={clsx(
                          'w-6 h-6 m-[1px] rounded flex items-center justify-center text-[9px] font-mono transition-all duration-150 relative border',
                          isSelf ? 'border-transparent bg-white/5 cursor-default' : 'border-border-subtle hover:scale-110 hover:z-10',
                          isSelected && 'ring-2 ring-brand z-20 shadow-lg'
                        )}
                        style={{
                          backgroundColor: isSelf
                            ? 'rgba(255,255,255,0.02)'
                            : isBelowThreshold
                            ? 'rgba(255,255,255,0.03)'
                            : getCellColor(score, isSelected),
                        }}
                      >
                        {!isSelf && score > 0 && (
                          <span
                            className={clsx(
                              'text-[8px] font-bold',
                              score >= 75 ? 'text-white' : score >= 50 ? 'text-text-primary' : 'text-text-muted'
                            )}
                          >
                            {score}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Pair Details Drawer Card */}
          {selectedPair && (
            <div className="w-full xl:w-80 shrink-0 p-4 rounded-xl bg-surface-elevated border border-border-default space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-brand flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Pairwise Tension Detail
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">703-Pair Matrix</span>
                </div>

                {/* Country A vs Country B Header */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-border-subtle">
                  <div className="text-center">
                    <span className="text-xl block">
                      {MOCK_38_COUNTRIES_CII.find((c) => c.country_code === selectedPair.country_a)?.flag || '🌐'}
                    </span>
                    <span className="font-mono font-extrabold text-sm text-text-primary block mt-0.5">
                      {selectedPair.country_a}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-text-muted uppercase">Hostility</span>
                    <span
                      className="font-mono font-black text-xl"
                      style={{
                        color:
                          selectedPair.score >= 75
                            ? 'var(--critical)'
                            : selectedPair.score >= 50
                            ? 'var(--warning)'
                            : 'var(--success)',
                      }}
                    >
                      {selectedPair.score}
                    </span>
                    <span className="text-[9px] font-mono text-text-muted">/ 100</span>
                  </div>

                  <div className="text-center">
                    <span className="text-xl block">
                      {MOCK_38_COUNTRIES_CII.find((c) => c.country_code === selectedPair.country_b)?.flag || '🌐'}
                    </span>
                    <span className="font-mono font-extrabold text-sm text-text-primary block mt-0.5">
                      {selectedPair.country_b}
                    </span>
                  </div>
                </div>

                {/* Driver */}
                <div className="p-3 rounded-lg bg-surface-base border border-border-subtle space-y-1">
                  <span className="text-[10px] uppercase font-mono text-text-muted flex items-center gap-1">
                    <Zap className="w-3 h-3 text-status-warning" /> Conflict Vector Driver
                  </span>
                  <p className="text-xs text-text-primary font-medium leading-snug">
                    {selectedPair.primary_conflict_driver || 'Geopolitical friction'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] text-text-muted font-mono">
                <span>Updated: {selectedPair.last_updated}</span>
                <span className="text-brand font-semibold">Live Model Signal</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </WidgetChrome>
  );
};
