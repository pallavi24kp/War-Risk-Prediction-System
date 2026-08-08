import React from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { MOCK_GOV_ACTIONS } from '../../data/mock/dbPanelsData';
import { GovActionItem } from '../../lib/types';
import { ShieldCheck, Landmark, FileText, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useDashboardState } from '../../store/useDashboardState';

export const GovActionsLogWidget: React.FC = () => {
  const { isLiveMode, isLoadingIntelligence } = useDashboardState();
  const actions: GovActionItem[] = MOCK_GOV_ACTIONS;

  return (
    <WidgetChrome
      title="Government Actions & Policy Log"
      subtitle="Sanctions, Defense Executive Orders & Trade Restrictions"
      helpText="Database log tracking executive orders, treasury sanctions, trade embargoes, and defense mobilization policy enactments."
      badgeProps={{
        status: isLiveMode ? 'LIVE' : 'OFFLINE',
        count: actions.length,
      }}
      isLoading={isLoadingIntelligence}
      minWidth={300}
    >
      <div className="flex flex-col h-full gap-2 overflow-y-auto pr-0.5">
        {actions.map((act) => (
          <div
            key={act.id}
            className="p-3 rounded-xl bg-surface-base border border-border-subtle hover:border-border-default transition-all duration-150 space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-surface-elevated text-text-primary border border-border-subtle">
                  {act.country}
                </span>
                <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-subtle text-brand border border-brand-border uppercase">
                  {act.action_type.replace(/_/g, ' ')}
                </span>
              </div>
              <span
                className={clsx(
                  'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase',
                  act.impact_severity === 'HIGH'
                    ? 'bg-status-critical-bg text-status-critical border border-status-critical-border'
                    : act.impact_severity === 'MEDIUM'
                    ? 'bg-status-warning-bg text-status-warning border border-status-warning-border'
                    : 'bg-surface-elevated text-text-muted border border-border-subtle'
                )}
              >
                {act.impact_severity} Impact
              </span>
            </div>

            <h5 className="text-xs font-semibold text-text-primary leading-snug">
              {act.title}
            </h5>

            <div className="flex items-center justify-between pt-1 border-t border-border-subtle text-[10px] text-text-muted font-mono">
              <span className="truncate max-w-[200px]">{act.issuing_body}</span>
              <span>Effective: {act.effective_date}</span>
            </div>
          </div>
        ))}
      </div>
    </WidgetChrome>
  );
};
