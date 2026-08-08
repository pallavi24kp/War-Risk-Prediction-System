import React from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { MOCK_ML_DIAGNOSTICS } from '../../data/mock/instabilityData';
import { Activity, CheckCircle, Database, GitCommit, Layers, RefreshCw, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

export const ModelDiagnosticsWidget: React.FC = () => {
  const diag = MOCK_ML_DIAGNOSTICS;

  return (
    <WidgetChrome
      title="ML Model Diagnostics & Guardrails"
      subtitle="XGBoost Ensemble Pipeline Performance & Retrain History"
      helpText="Machine learning model diagnostics tracking R², RMSE, ROC-AUC metrics, feature importance weights, and guardrail promotion history."
      badgeProps={{
        status: 'OPERATIONAL',
        sources: 'v2.4.2-PROD',
        timestamp: 'Trained 18:45 UTC',
      }}
      minWidth={360}
    >
      <div className="flex flex-col h-full gap-4 overflow-y-auto pr-0.5">
        {/* ── Stat Tiles ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">R² Score</span>
            <span className="font-mono font-extrabold text-lg text-brand">
              {diag.r2.toFixed(4)}
            </span>
            <span className="text-[9px] text-status-success font-mono mt-0.5">+2.1% vs baseline</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">RMSE Error</span>
            <span className="font-mono font-extrabold text-lg text-status-warning">
              {diag.rmse.toFixed(4)}
            </span>
            <span className="text-[9px] text-text-muted font-mono mt-0.5">Scale 0 - 100</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">ROC-AUC</span>
            <span className="font-mono font-extrabold text-lg text-status-critical">
              {diag.roc_auc.toFixed(4)}
            </span>
            <span className="text-[9px] text-text-muted font-mono mt-0.5">Binary Conflict Driver</span>
          </div>
        </div>

        {/* ── Feature Importance Bar List (Hand-Built SVG) ── */}
        <div className="p-3.5 rounded-xl bg-surface-elevated border border-border-subtle space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand" /> Feature Importance Weights
            </h4>
            <span className="text-[10px] font-mono text-text-muted">6 Core Predictors</span>
          </div>

          <div className="space-y-2.5">
            {diag.feature_importance.map((item) => {
              const percentage = (item.importance_score * 100).toFixed(1);
              return (
                <div key={item.feature_name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-text-primary font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                      {item.feature_name}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-surface-base text-text-muted border border-border-subtle">
                        {item.category}
                      </span>
                      <span className="font-bold text-brand">{percentage}%</span>
                    </div>
                  </div>

                  {/* SVG Bar */}
                  <div className="w-full h-2 rounded-full bg-surface-base overflow-hidden border border-border-subtle">
                    <svg className="w-full h-full">
                      <rect
                        x="0"
                        y="0"
                        width={`${percentage}%`}
                        height="100%"
                        fill="var(--brand)"
                        rx="3"
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Retrain History & Guardrail Promotion Log ── */}
        <div className="p-3.5 rounded-xl bg-surface-elevated border border-border-subtle space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-brand" /> Automated Retrain & Promotion Log
            </h4>
            <span className="text-[10px] font-mono text-status-success font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Guardrails Active
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {diag.retrain_history.map((h) => (
              <div
                key={h.id}
                className={clsx(
                  'p-3 rounded-lg border transition-all duration-150',
                  h.promoted_to_prod
                    ? 'bg-status-success-bg/10 border-status-success-border'
                    : 'bg-surface-base border-border-subtle opacity-75'
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {h.promoted_to_prod ? (
                      <CheckCircle className="w-3.5 h-3.5 text-status-success shrink-0" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    )}
                    <span className="font-bold text-text-primary">{h.model_version}</span>
                  </div>
                  <span className="text-[10px] text-text-muted">{h.timestamp}</span>
                </div>

                <div className="text-[11px] text-text-secondary leading-snug mb-2 font-sans">
                  {h.guardrail_promotion_note}
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-border-subtle text-text-muted">
                  <span>R²: <strong className="text-text-primary">{h.r2.toFixed(4)}</strong></span>
                  <span>RMSE: <strong className="text-text-primary">{h.rmse.toFixed(4)}</strong></span>
                  <span>ROC-AUC: <strong className="text-text-primary">{h.roc_auc.toFixed(4)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetChrome>
  );
};
