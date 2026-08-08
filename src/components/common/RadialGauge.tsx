import React, { useId } from 'react';
import { clsx } from 'clsx';

export interface RadialGaugeProps {
  value: number; // 0 - 100
  label?: string;
  size?: number;
  strokeWidth?: number;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  value,
  label = 'ELEVATED',
  size = 180,
  strokeWidth = 12,
}) => {
  const uid = useId().replace(/:/g, '');
  const gradientId = `gauge-grad-${uid}`;

  const clampedValue = Math.min(100, Math.max(0, value));
  const radius       = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // 240° arc gauge (2/3 of circle)
  const arcFraction   = 0.75;
  const arcLength     = circumference * arcFraction;
  const strokeDashoffset = arcLength - (clampedValue / 100) * arcLength;

  const colorClass =
    clampedValue >= 80
      ? 'text-status-critical'
      : clampedValue >= 55
      ? 'text-status-warning'
      : 'text-status-success';

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="meter"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Risk gauge: ${clampedValue} — ${label}`}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--warning)" />
            <stop offset="100%" stopColor="var(--critical)" />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - arcFraction)}
          strokeLinecap="round"
        />

        {/* Value Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset + circumference * (1 - arcFraction)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="font-mono font-bold leading-none text-text-primary"
          style={{ fontSize: `${Math.round(size * 0.18)}px` }}
        >
          {clampedValue}
        </span>
        <span
          className={clsx(
            'mt-1.5 uppercase font-semibold tracking-[0.06em] text-[10px]',
            colorClass
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
