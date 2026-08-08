import React from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { MOCK_SHIPPING_RATES } from '../../data/mock/dbPanelsData';
import { ShippingRateItem } from '../../lib/types';
import { Ship, TrendingUp, TrendingDown, Anchor, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { useDashboardState } from '../../store/useDashboardState';

export const ShippingRatesWidget: React.FC = () => {
  const { isLiveMode, isLoadingIntelligence } = useDashboardState();
  const rates: ShippingRateItem[] = MOCK_SHIPPING_RATES;

  return (
    <WidgetChrome
      title="Global Shipping & Container Freight Rates"
      subtitle="FBX Baltic Container & Dirty Tanker Index Tickers"
      helpText="Maritime shipping rates index tracking spot container freight charges (USD/FEU) & tanker charter rates across strategic trade corridors."
      badgeProps={{
        status: isLiveMode ? 'LIVE' : 'OFFLINE',
        count: rates.length,
      }}
      isLoading={isLoadingIntelligence}
      minWidth={300}
    >
      <div className="flex flex-col h-full gap-2 overflow-y-auto pr-0.5">
        {rates.map((r) => {
          const isSurging = r.status === 'SURGING';
          const isDeclining = r.status === 'DECLINING';
          return (
            <div
              key={r.route_id}
              className="p-3 rounded-xl bg-surface-base border border-border-subtle hover:border-border-default transition-all duration-150 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-brand-subtle text-brand border border-brand-border">
                    {r.route_id}
                  </span>
                  <span className="font-mono text-[10px] text-text-muted">
                    {r.index_name}
                  </span>
                </div>
                <span
                  className={clsx(
                    'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase',
                    isSurging
                      ? 'bg-status-critical-bg text-status-critical border border-status-critical-border'
                      : isDeclining
                      ? 'bg-status-success-bg text-status-success border border-status-success-border'
                      : 'bg-surface-elevated text-text-muted border border-border-subtle'
                  )}
                >
                  {r.status}
                </span>
              </div>

              <h5 className="text-xs font-semibold text-text-primary leading-snug">
                {r.route_name}
              </h5>

              <div className="flex items-center justify-between pt-1 border-t border-border-subtle font-mono text-xs">
                <span className="text-text-muted font-sans text-[11px]">Spot Freight Rate:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary">
                    ${r.rate_usd_per_feu.toLocaleString()}
                  </span>
                  <span
                    className={clsx(
                      'text-[11px] font-bold flex items-center gap-0.5',
                      r.change_7d_percent >= 0 ? 'text-status-critical' : 'text-status-success'
                    )}
                  >
                    {r.change_7d_percent >= 0 ? '+' : ''}{r.change_7d_percent.toFixed(1)}% (7d)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetChrome>
  );
};
