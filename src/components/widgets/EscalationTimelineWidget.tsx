import React from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { TimelineStepChart } from '../common/TimelineStepChart';
import { Flame, Clock, TrendingUp } from 'lucide-react';
import { useDashboardState } from '../../store/useDashboardState';

export const EscalationTimelineWidget: React.FC = () => {
  const { isLiveMode, isLoadingIntelligence, intelligenceData } = useDashboardState();
  const {
    criticalEventsCount,
    criticalEventsDelta,
    activeEscalationDays,
    eventVelocityPercent,
    last7DaysAvg,
    prior7DaysAvg,
  } = intelligenceData.escalationTimeline;

  const stats = [
    {
      label:    'Critical / High Events',
      value:    `${criticalEventsCount}`,
      unit:     'events',
      delta:    criticalEventsDelta,
      icon:     Flame,
      color:    'var(--critical)',
      bg:       'var(--critical-bg)',
      border:   'var(--critical-border)',
    },
    {
      label:    'Active Escalation',
      value:    `${activeEscalationDays}`,
      unit:     'days',
      delta:    'Continuous elevated state',
      icon:     Clock,
      color:    'var(--warning)',
      bg:       'var(--warning-bg)',
      border:   'var(--warning-border)',
    },
  ];

  return (
    <WidgetChrome
      title="Escalation Timeline"
      subtitle="Trailing 30-day window"
      helpText="High-frequency telemetry tracking active escalation days, critical events, and historical velocity trends."
      badgeProps={{
        status: isLiveMode ? 'LIVE' : 'OFFLINE',
        count: criticalEventsCount,
      }}
      isLoading={isLoadingIntelligence}
      minWidth={260}
    >
      <div className="flex flex-col h-full gap-3">
        {/* ── Stat Tiles ── */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-xl p-3 space-y-2"
                style={{
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-medium uppercase tracking-wider"
                    style={{ color: s.color, opacity: 0.8, letterSpacing: '0.05em' }}
                  >
                    {s.label}
                  </span>
                  <Icon className="w-3.5 h-3.5" style={{ color: s.color }} aria-hidden="true" />
                </div>
                <div>
                  <div
                    className="font-mono font-bold leading-none"
                    style={{ fontSize: '22px', color: s.color }}
                  >
                    {s.value}
                    <span
                      className="text-sm font-normal ml-1"
                      style={{ color: s.color, opacity: 0.7 }}
                    >
                      {s.unit}
                    </span>
                  </div>
                  {s.delta && (
                    <div
                      className="text-[10px] mt-1.5"
                      style={{ color: s.color, opacity: 0.7 }}
                    >
                      {s.delta}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Velocity & Step Line Chart ── */}
        <div className="rounded-xl p-3.5 space-y-3 flex-1 bg-surface-elevated border border-border-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-status-critical" aria-hidden="true" />
              <span className="text-xs font-semibold text-text-secondary">
                Velocity Trajectory (Events/Day)
              </span>
            </div>
            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-status-critical-bg text-status-critical border border-status-critical-border">
              +{eventVelocityPercent}% velocity
            </span>
          </div>

          {/* Chronological Step Line Timeline Chart */}
          <div className="pt-1">
            <TimelineStepChart />
          </div>
        </div>
      </div>
    </WidgetChrome>
  );
};
