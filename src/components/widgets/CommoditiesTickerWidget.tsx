import React, { useState } from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { MOCK_COMMODITY_TICKERS, MOCK_COMMODITY_NEWS } from '../../data/mock/dbPanelsData';
import { CommodityTickerItem, CommodityNewsItem } from '../../lib/types';
import { TrendingUp, TrendingDown, DollarSign, Newspaper, Flame, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { useDashboardState } from '../../store/useDashboardState';

export const CommoditiesTickerWidget: React.FC = () => {
  const { isLiveMode, isLoadingIntelligence } = useDashboardState();
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'ENERGY' | 'METALS' | 'AGRICULTURE'>('ALL');

  const tickers: CommodityTickerItem[] = MOCK_COMMODITY_TICKERS;
  const news: CommodityNewsItem[] = MOCK_COMMODITY_NEWS;

  const filteredTickers = selectedCategory === 'ALL'
    ? tickers
    : tickers.filter((t) => t.category === selectedCategory);

  return (
    <WidgetChrome
      title="Tracked Commodities Ticker & News"
      subtitle="Real-Time Energy, Metals & Agriculture Spot Prices"
      helpText="Live commodity price ticker & market news impact stream for crude oil, natural gas, precious metals, and agricultural futures."
      badgeProps={{
        status: isLiveMode ? 'LIVE' : 'OFFLINE',
        count: tickers.length,
      }}
      isLoading={isLoadingIntelligence}
      minWidth={300}
    >
      <div className="flex flex-col h-full gap-3 overflow-y-auto pr-0.5">
        {/* ── Category Pill Switcher ── */}
        <div className="glass-pill flex items-center p-1 rounded-xl gap-1 shrink-0 bg-surface-elevated border border-border-subtle">
          {(['ALL', 'ENERGY', 'METALS', 'AGRICULTURE'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                'flex-1 py-1 px-1.5 text-[10px] font-mono font-bold rounded-lg transition-all duration-150 text-center uppercase',
                selectedCategory === cat
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Commodities Price Ticker Cards ── */}
        <div className="grid grid-cols-2 gap-2">
          {filteredTickers.map((tick) => {
            const isPos = tick.change_24h_percent >= 0;
            return (
              <div
                key={tick.symbol}
                className="p-2.5 rounded-xl bg-surface-base border border-border-subtle hover:border-border-default transition-all duration-150 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-text-primary">{tick.symbol}</span>
                  <span className="text-[9px] font-mono text-text-muted">{tick.unit}</span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-sm font-bold text-text-primary">
                    ${tick.price_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span
                    className={clsx(
                      'font-mono text-[10px] font-bold flex items-center gap-0.5',
                      isPos ? 'text-status-critical' : 'text-status-success'
                    )}
                  >
                    {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPos ? '+' : ''}{tick.change_24h_percent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Commodity News Stream ── */}
        <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle space-y-2">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-semibold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5 text-brand" /> Commodity Impact News
            </h5>
            <span className="text-[10px] font-mono text-text-muted">4 Bulletins</span>
          </div>

          <div className="space-y-2">
            {news.map((item) => (
              <div key={item.id} className="p-2 rounded-lg bg-surface-base border border-border-subtle space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-brand">{item.commodity_symbol}</span>
                  <span
                    className={clsx(
                      'font-mono font-bold px-1.5 py-0.2 rounded text-[9px] uppercase',
                      item.impact === 'BULLISH' ? 'bg-status-critical-bg text-status-critical' : 'bg-status-success-bg text-status-success'
                    )}
                  >
                    {item.impact}
                  </span>
                </div>
                <p className="text-xs text-text-primary font-medium leading-snug">
                  {item.headline}
                </p>
                <div className="flex items-center justify-between text-[9px] text-text-muted font-mono pt-0.5">
                  <span>{item.source}</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetChrome>
  );
};
