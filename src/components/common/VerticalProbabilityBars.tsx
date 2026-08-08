import React from 'react';

interface VerticalProbabilityBarsProps {
  probability: number; // 0 - 100
  color?: string;
  height?: number;
}

export const VerticalProbabilityBars: React.FC<VerticalProbabilityBarsProps> = ({
  probability,
  color = 'var(--brand)',
  height = 28,
}) => {
  const totalBars = 10;
  const activeBars = Math.round((probability / 100) * totalBars);
  const barWidth = 4;
  const barGap = 3;
  const svgWidth = totalBars * barWidth + (totalBars - 1) * barGap;

  return (
    <svg
      width={svgWidth}
      height={height}
      viewBox={`0 0 ${svgWidth} ${height}`}
      className="overflow-visible select-none shrink-0"
      role="meter"
      aria-valuenow={probability}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Probability sparkline: ${probability}%`}
    >
      {Array.from({ length: totalBars }).map((_, i) => {
        const isActive = i < activeBars;
        const barHeight = Math.max(4, (height * (30 + ((i + 1) / totalBars) * 70)) / 100);
        const x = i * (barWidth + barGap);
        const y = height - barHeight;

        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={1.5}
            fill={isActive ? color : 'var(--border-subtle)'}
            opacity={isActive ? 0.4 + (i / totalBars) * 0.6 : 0.25}
            style={{ transition: 'all 0.3s ease' }}
          />
        );
      })}
    </svg>
  );
};
