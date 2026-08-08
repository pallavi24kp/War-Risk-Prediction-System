import React from 'react';

interface TimelineDataPoint {
  label: string;
  value: number;
  isCritical?: boolean;
}

interface TimelineStepChartProps {
  data?: TimelineDataPoint[];
  height?: number;
}

const DEFAULT_DATA: TimelineDataPoint[] = [
  { label: 'D-6', value: 4.2 },
  { label: 'D-5', value: 5.1 },
  { label: 'D-4', value: 4.8 },
  { label: 'D-3', value: 6.5 },
  { label: 'D-2', value: 7.2, isCritical: true },
  { label: 'D-1', value: 7.8, isCritical: true },
  { label: 'Today', value: 8.6, isCritical: true },
];

export const TimelineStepChart: React.FC<TimelineStepChartProps> = ({
  data = DEFAULT_DATA,
  height = 140,
}) => {
  const width = 400;
  const paddingX = 30;
  const paddingTop = 25;
  const paddingBottom = 25;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxValue = 10;
  const minValue = 0;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.value - minValue) / (maxValue - minValue)) * chartHeight;
    return { ...d, x, y };
  });

  // True horizontal step line path: L nextX currentY -> L nextX nextY
  const stepPathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    return `${acc} L ${p.x} ${prev.y} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${stepPathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  return (
    <div className="w-full relative select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        aria-label="Escalation timeline horizontal step chart"
        role="img"
      >
        <defs>
          <linearGradient id="timelineStepGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--critical)" stopOpacity="0.30" />
            <stop offset="100%" stopColor="var(--critical)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.5, 1].map((ratio) => {
          const y = paddingTop + chartHeight * (1 - ratio);
          return (
            <line
              key={ratio}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="var(--border-subtle)"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
          );
        })}

        {/* Filled Step Area */}
        <path d={areaD} fill="url(#timelineStepGradient)" />

        {/* Step Line Path */}
        <path
          d={stepPathD}
          fill="none"
          stroke="var(--critical)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Nodes & Time Axis Labels */}
        {points.map((p, i) => {
          const color = p.isCritical ? 'var(--critical)' : 'var(--warning)';
          return (
            <g key={i}>
              {/* Vertical guideline */}
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x}
                y2={height - paddingBottom}
                stroke={color}
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.35"
              />

              {/* Node Outer Ring */}
              <circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity="0.5"
              />

              {/* Glowing Node Dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill={color}
                stroke="var(--surface-base)"
                strokeWidth="1.5"
              />

              {/* Value tag above node */}
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                className="font-mono text-[10px] font-semibold"
                fill={color}
              >
                {p.value.toFixed(1)}
              </text>

              {/* X-axis label */}
              <text
                x={p.x}
                y={height - 6}
                textAnchor="middle"
                className="font-mono text-[9px] font-medium"
                fill="var(--text-muted)"
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
