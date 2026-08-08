import React from 'react';

interface RegionRiskItem {
  region: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

interface RiskTrendSparklineProps {
  items?: RegionRiskItem[];
}

const DEFAULT_REGIONS: RegionRiskItem[] = [
  { region: 'Middle East & Red Sea', score: 88.4, trend: 'up', change: '+4.2%' },
  { region: 'Indo-Pacific & Malacca', score: 74.2, trend: 'up', change: '+2.1%' },
  { region: 'Eastern Europe & Black Sea', score: 81.6, trend: 'stable', change: '0.0%' },
  { region: 'Latin America & Caribbean', score: 52.1, trend: 'down', change: '-1.4%' },
  { region: 'West Africa & Gulf of Guinea', score: 63.8, trend: 'up', change: '+1.8%' },
];

export const RiskTrendSparkline: React.FC<RiskTrendSparklineProps> = ({
  items = DEFAULT_REGIONS,
}) => {
  const getColor = (score: number) =>
    score >= 80 ? 'var(--critical)' : score >= 65 ? 'var(--warning)' : 'var(--success)';

  return (
    <div className="space-y-3 select-none">
      {/* 30-Day Historical Trend Line */}
      <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text-secondary">30-Day Global Risk Trajectory</span>
          <span className="font-mono text-status-critical text-[11px] font-bold">+12.4% vs 30d avg</span>
        </div>
        <svg viewBox="0 0 300 45" className="w-full h-10 overflow-visible">
          <defs>
            <linearGradient id="riskSparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--critical)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--critical)" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 35 Q 30 30, 60 32 T 120 22 T 180 26 T 240 12 T 300 8 L 300 45 L 0 45 Z"
            fill="url(#riskSparkGrad)"
          />
          <path
            d="M 0 35 Q 30 30, 60 32 T 120 22 T 180 26 T 240 12 T 300 8"
            fill="none"
            stroke="var(--critical)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="300" cy="8" r="4" fill="var(--critical)" />
        </svg>
      </div>

      {/* Multi-Region Horizontal Comparison Bars */}
      <div className="space-y-2">
        {items.map((item) => {
          const color = getColor(item.score);
          return (
            <div
              key={item.region}
              className="p-2.5 rounded-lg bg-surface-elevated border border-border-subtle space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-text-primary truncate max-w-[200px]">
                  {item.region}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-text-muted">{item.change}</span>
                  <span className="font-mono font-bold text-xs" style={{ color }}>
                    {item.score.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Segmented spectrum bar */}
              <div className="h-1.5 w-full bg-border-subtle rounded-full overflow-hidden flex">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.score}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
