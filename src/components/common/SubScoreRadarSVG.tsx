import React from 'react';

export interface RadarData {
  u: number; // Unrest
  c: number; // Cyber
  s: number; // Sanctions
  f: number; // Food
}

export const SubScoreRadarSVG: React.FC<{ data: RadarData; size?: number }> = ({
  data,
  size = 48,
}) => {
  const center = size / 2;
  const radius = size * 0.4;

  // Normalized values (0 to 1)
  const nu = Math.min(1, Math.max(0, data.u / 100));
  const nc = Math.min(1, Math.max(0, data.c / 100));
  const ns = Math.min(1, Math.max(0, data.s / 100));
  const nf = Math.min(1, Math.max(0, data.f / 100));

  // Points: top (u), right (c), bottom (s), left (f)
  const pU = [center, center - nu * radius];
  const pC = [center + nc * radius, center];
  const pS = [center, center + ns * radius];
  const pF = [center - nf * radius, center];

  const pointsD = `${pU[0]},${pU[1]} ${pC[0]},${pC[1]} ${pS[0]},${pS[1]} ${pF[0]},${pF[1]}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="overflow-visible select-none shrink-0"
      role="img"
      aria-label="Country sub-score radar chart"
    >
      {/* Outer Web */}
      <polygon
        points={`${center},${center - radius} ${center + radius},${center} ${center},${center + radius} ${center - radius},${center}`}
        fill="none"
        stroke="var(--border-subtle)"
        strokeWidth="1"
      />
      {/* Inner Web */}
      <polygon
        points={`${center},${center - radius * 0.5} ${center + radius * 0.5},${center} ${center},${center + radius * 0.5} ${center - radius * 0.5},${center}`}
        fill="none"
        stroke="var(--border-subtle)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />

      {/* Axes */}
      <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="var(--border-subtle)" strokeWidth="1" />
      <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="var(--border-subtle)" strokeWidth="1" />

      {/* Data Polygon */}
      <polygon
        points={pointsD}
        fill="rgba(59, 130, 246, 0.25)"
        stroke="var(--brand)"
        strokeWidth="1.5"
      />

      {/* Node Dots */}
      <circle cx={pU[0]} cy={pU[1]} r="1.75" fill="var(--critical)" />
      <circle cx={pC[0]} cy={pC[1]} r="1.75" fill="var(--warning)" />
      <circle cx={pS[0]} cy={pS[1]} r="1.75" fill="var(--brand)" />
      <circle cx={pF[0]} cy={pF[1]} r="1.75" fill="var(--success)" />
    </svg>
  );
};
