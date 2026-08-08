import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { IngestionHealthStatus } from '../../lib/types';

export interface StatusBadgeProps {
  status?: IngestionHealthStatus | 'LIVE' | 'CACHED' | 'OFFLINE';
  sources?: string;
  count?: number;
  trend?: 'up' | 'down' | 'stable';
  timestamp?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'OPERATIONAL',
  sources,
  count,
  trend,
  timestamp,
  size = 'sm',
}) => {
  const statusTheme = {
    OPERATIONAL: {
      badge: 'bg-status-success-bg border-status-success-border text-status-success',
      dot: 'bg-status-success',
      label: 'OPERATIONAL',
    },
    LIVE: {
      badge: 'bg-status-success-bg border-status-success-border text-status-success',
      dot: 'bg-status-success',
      label: 'LIVE',
    },
    DEGRADED: {
      badge: 'bg-status-warning-bg border-status-warning-border text-status-warning',
      dot: 'bg-status-warning',
      label: 'DEGRADED',
    },
    CACHED: {
      badge: 'bg-status-warning-bg border-status-warning-border text-status-warning',
      dot: 'bg-status-warning',
      label: 'CACHED',
    },
    OFFLINE: {
      badge: 'bg-status-critical-bg border-status-critical-border text-status-critical',
      dot: 'bg-status-critical',
      label: 'OFFLINE',
    },
  }[status];

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md border font-medium transition-all duration-150',
        size === 'sm' ? 'px-2 py-[2px] text-[10px]' : 'px-[10px] py-[4px] text-[11px]',
        statusTheme.badge
      )}
      role="status"
      aria-label={`System Status: ${statusTheme.label}`}
    >
      {/* Dot */}
      <span className="relative flex w-[6px] h-[6px]" aria-hidden="true">
        {(status === 'LIVE' || status === 'OPERATIONAL') && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-status-success" />
        )}
        <span className={clsx('relative inline-flex rounded-full w-[6px] h-[6px]', statusTheme.dot)} />
      </span>

      <span className="uppercase tracking-[0.04em] font-mono font-bold">
        {statusTheme.label}
      </span>

      {sources && (
        <>
          <span className="opacity-30 hidden sm:inline">·</span>
          <span className="hidden sm:inline text-text-muted">
            {sources}
          </span>
        </>
      )}

      {count !== undefined && (
        <>
          <span className="opacity-30">·</span>
          <span className="text-text-primary font-semibold">{count}</span>
        </>
      )}

      {trend && (
        <span className="ml-0.5" aria-label={`Trend: ${trend}`}>
          {trend === 'up'     && <ArrowUpRight className="w-3 h-3 text-status-critical" />}
          {trend === 'down'   && <ArrowDownRight className="w-3 h-3 text-status-success" />}
          {trend === 'stable' && <Minus className="w-3 h-3 text-text-muted" />}
        </span>
      )}

      {timestamp && (
        <span className="hidden md:inline pl-1.5 normal-case text-[9px] text-text-muted border-l border-border-subtle font-sans font-normal">
          {timestamp}
        </span>
      )}
    </div>
  );
};
