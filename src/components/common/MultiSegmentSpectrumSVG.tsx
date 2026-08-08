import React, { useId } from 'react';

export interface Segment {
  key: string;
  value: number; // 0 - 100
  label: string;
  color: string;
}

export interface MultiSegmentSpectrumSVGProps {
  segments: Segment[];
  height?: number;
}

export const MultiSegmentSpectrumSVG: React.FC<MultiSegmentSpectrumSVGProps> = ({
  segments,
  height = 8,
}) => {
  const uid = useId().replace(/:/g, '');
  const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;

  let currentX = 0;

  return (
    <div className="w-full select-none" style={{ height }}>
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className="w-full h-full rounded-full overflow-hidden"
        role="img"
        aria-label="Multi-segment sub-score spectrum"
      >
        <rect x="0" y="0" width="100" height="10" fill="var(--border-subtle)" rx="5" />
        {segments.map((seg, idx) => {
          const widthPercent = (seg.value / total) * 100;
          const x = currentX;
          currentX += widthPercent;

          if (widthPercent <= 0) return null;

          return (
            <rect
              key={seg.key || idx}
              x={x}
              y="0"
              width={Math.max(0, widthPercent - 0.4)}
              height="10"
              fill={seg.color}
              rx={idx === 0 ? 5 : idx === segments.length - 1 ? 5 : 1}
              style={{ transition: 'all 0.4s ease' }}
            >
              <title>{`${seg.label}: ${seg.value}`}</title>
            </rect>
          );
        })}
      </svg>
    </div>
  );
};
