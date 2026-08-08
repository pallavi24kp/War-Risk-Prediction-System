import React from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { RadialGauge } from '../common/RadialGauge';
import { useDashboardState } from '../../store/useDashboardState';

export const RiskIndexWidget: React.FC = () => {
  const { isLiveMode, isLoadingIntelligence, intelligenceData } = useDashboardState();
  const { score, label, delta24h, submetrics, sourcesCount, updatedAt } =
    intelligenceData.riskIndex;

  return (
    <WidgetChrome
      title="Global Risk Index"
      subtitle="Aggregate geopolitical risk score"
      helpText="Quantitative aggregate risk score combining kinetic conflict, cyber outages, maritime chokepoint stress, & macro shocks."
      badgeProps={{
        status: isLiveMode ? 'CACHED' : 'OFFLINE',
        timestamp: updatedAt,
        sources: sourcesCount,
      }}
      isLoading={isLoadingIntelligence}
      minWidth={260}
      variant="primary"
    >
      <div className="flex flex-col items-center justify-between h-full py-2 gap-4">
        {/* ── Radial Gauge ── */}
        <div className="flex-1 flex items-center justify-center">
          <RadialGauge value={score} label={label} size={160} strokeWidth={12} />
        </div>

        {/* ── Trend Summary ── */}
        <div className="w-full rounded-xl p-3.5 space-y-3 bg-surface-elevated border border-border-subtle">
          {/* 24h Delta */}
          <div className="flex items-center justify-between">
            <span className="text-xs flex items-center gap-1.5 text-text-muted">
              <TrendingUp className="w-3.5 h-3.5 text-status-critical" aria-hidden="true" />
              24h Trend Delta
            </span>
            <span className="font-mono font-bold text-sm flex items-center gap-0.5 text-status-critical">
              +{delta24h.toFixed(1)} pts
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </div>

          {/* Sub-metrics */}
          <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-border-subtle">
            {[
              { label: 'Kinetic Risk',     value: submetrics.kineticRisk.toFixed(1), colorClass: 'text-status-critical' },
              { label: 'Trade Chokepoint', value: submetrics.tradeChokepoint.toFixed(1), colorClass: 'text-status-warning'  },
            ].map(({ label: subLabel, value, colorClass }) => (
              <div key={subLabel} className="p-2.5 rounded-lg bg-surface-base border border-border-subtle">
                <span className="text-[10px] block mb-1 text-text-muted">
                  {subLabel}
                </span>
                <span className={`font-mono font-bold text-sm ${colorClass}`}>
                  {value}
                  <span className="text-[10px] font-normal ml-0.5 text-text-muted">
                    /100
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetChrome>
  );
};
