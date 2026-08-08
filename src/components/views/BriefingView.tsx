'use client';

import React, { useState } from 'react';
import { SituationBriefWidget } from '../widgets/SituationBriefWidget';
import { RiskIndexWidget } from '../widgets/RiskIndexWidget';
import { ForecastFeedWidget } from '../widgets/ForecastFeedWidget';
import { EscalationTimelineWidget } from '../widgets/EscalationTimelineWidget';
import { TheaterWatchWidget } from '../widgets/TheaterWatchWidget';
import { SignalFeedWidget } from '../widgets/SignalFeedWidget';
import { InstabilityIndexWidget } from '../widgets/InstabilityIndexWidget';
import { RiskTrendWidget } from '../widgets/RiskTrendWidget';
import { TheaterHeatmapWidget } from '../widgets/TheaterHeatmapWidget';
import { ModelDiagnosticsWidget } from '../widgets/ModelDiagnosticsWidget';
import { BilateralTensionMatrix } from '../widgets/BilateralTensionMatrix';
import { RegionalHeadlinesWidget } from '../widgets/RegionalHeadlinesWidget';
import { GovActionsLogWidget } from '../widgets/GovActionsLogWidget';
import { CommoditiesTickerWidget } from '../widgets/CommoditiesTickerWidget';
import { ShippingRatesWidget } from '../widgets/ShippingRatesWidget';
import { useDashboardState } from '../../store/useDashboardState';
import { Grid, BarChart2, ShieldAlert, TrendingUp, Radio, Activity, Cpu, Grid3X3, Newspaper, Shield, LineChart, Anchor } from 'lucide-react';
import { clsx } from 'clsx';

type AnalyticsCategory =
  | 'risk-forecast'
  | 'signals-theater'
  | 'escalation-metrics'
  | 'model-diagnostics'
  | 'bilateral-matrix'
  | 'db-intelligence';

/* ── Section Header Component ── */
const SectionHeader: React.FC<{ icon: React.ReactNode; label: string; description?: string }> = ({
  icon,
  label,
  description,
}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0 bg-brand-subtle border border-brand-border">
      {icon}
    </div>
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-text-primary">
        {label}
      </h3>
      {description && (
        <p className="text-[11px] mt-0.5 text-text-muted">
          {description}
        </p>
      )}
    </div>
  </div>
);

export const BriefingView: React.FC = () => {
  const activeTab = useDashboardState((s) => s.activeTab);
  const setActiveTab = useDashboardState((s) => s.setActiveTab);
  const [analyticsCategory, setAnalyticsCategory] = useState<AnalyticsCategory>('risk-forecast');

  const isAnalytics = activeTab === 'briefing-analytics';

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] min-h-[720px] gap-4">
      {/* ── Sub-Navigation Segment Switcher ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 shrink-0">
        {/* Tier Switcher */}
        <div className="glass-pill flex items-center p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('briefing-overview')}
            aria-pressed={!isAnalytics}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200',
              !isAnalytics
                ? 'bg-brand/20 text-white shadow-sm border border-brand/40'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <Grid className="w-3.5 h-3.5 text-brand" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('briefing-analytics')}
            aria-pressed={isAnalytics}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200',
              isAnalytics
                ? 'bg-brand/20 text-white shadow-sm border border-brand/40'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <BarChart2 className="w-3.5 h-3.5 text-brand" />
            <span>Deep Analytics</span>
          </button>
        </div>

        {/* Analytics Domain Category Switcher (only visible in Deep Analytics mode) */}
        {isAnalytics && (
          <div className="glass-pill flex items-center p-1 rounded-xl gap-1 animate-slide-down flex-wrap">
            <button
              onClick={() => setAnalyticsCategory('risk-forecast')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                analyticsCategory === 'risk-forecast'
                  ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              )}
            >
              <TrendingUp className="w-3.5 h-3.5 text-brand" />
              <span>Risk & Forecasts</span>
            </button>
            <button
              onClick={() => setAnalyticsCategory('signals-theater')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                analyticsCategory === 'signals-theater'
                  ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              )}
            >
              <Radio className="w-3.5 h-3.5 text-brand" />
              <span>Signal & Surveillance</span>
            </button>
            <button
              onClick={() => setAnalyticsCategory('escalation-metrics')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                analyticsCategory === 'escalation-metrics'
                  ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              )}
            >
              <Activity className="w-3.5 h-3.5 text-brand" />
              <span>Escalation Metrics</span>
            </button>
            <button
              onClick={() => setAnalyticsCategory('model-diagnostics')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                analyticsCategory === 'model-diagnostics'
                  ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              )}
            >
              <Cpu className="w-3.5 h-3.5 text-brand" />
              <span>Model Diagnostics</span>
            </button>
            <button
              onClick={() => setAnalyticsCategory('bilateral-matrix')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                analyticsCategory === 'bilateral-matrix'
                  ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              )}
            >
              <Grid3X3 className="w-3.5 h-3.5 text-brand" />
              <span>Bilateral Matrix</span>
            </button>
            <button
              onClick={() => setAnalyticsCategory('db-intelligence')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                analyticsCategory === 'db-intelligence'
                  ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              )}
            >
              <Newspaper className="w-3.5 h-3.5 text-brand" />
              <span>DB Intelligence</span>
            </button>
          </div>
        )}

        <div className="hidden xl:flex items-center gap-2 text-xs text-text-muted">
          <ShieldAlert className="w-3.5 h-3.5 text-brand" />
          <span>{isAnalytics ? 'Enterprise-Grade Deep Analytics' : 'Executive Intelligence Overview'}</span>
        </div>
      </div>

      {/* ── Tab View Content ── */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {!isAnalytics ? (
          /* ── Overview Dashboard — 2-Column Premium Grid ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full animate-scale-in">
            {/* Featured: AI Executive Synthesis (spans 2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-4 min-w-0 h-full animate-slide-up stagger-1">
              <SectionHeader
                icon={<ShieldAlert className="w-3.5 h-3.5 text-brand" />}
                label="Executive Synthesis"
                description="AI-generated intelligence summary"
              />
              <div className="flex-1 min-h-[360px]">
                <SituationBriefWidget />
              </div>
            </div>

            {/* Right Column: Risk + Theater */}
            <div className="flex flex-col gap-4 min-w-0 h-full">
              <div className="animate-slide-up stagger-2">
                <SectionHeader
                  icon={<TrendingUp className="w-3.5 h-3.5 text-brand" />}
                  label="Global Risk Index"
                />
                <RiskIndexWidget />
              </div>
              <div className="flex-1 min-h-[320px] animate-slide-up stagger-3">
                <SectionHeader
                  icon={<Activity className="w-3.5 h-3.5 text-brand" />}
                  label="Theater Watch"
                />
                <TheaterWatchWidget />
              </div>
            </div>
          </div>
        ) : (
          /* ── Enterprise Categorized Deep Analytics Dashboard ── */
          <div className="h-full" key={analyticsCategory}>
            {analyticsCategory === 'risk-forecast' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full animate-scale-in">
                <div className="xl:col-span-2 flex flex-col min-w-0 animate-slide-up stagger-1">
                  <SectionHeader
                    icon={<TrendingUp className="w-3.5 h-3.5 text-brand" />}
                    label="Predictive Conflict Forecasts"
                    description="ML-driven risk projections across theaters"
                  />
                  <div className="flex-1 min-h-[460px]">
                    <ForecastFeedWidget />
                  </div>
                </div>
                <div className="flex flex-col gap-4 min-w-0">
                  <div className="shrink-0 animate-slide-up stagger-2">
                    <SectionHeader
                      icon={<ShieldAlert className="w-3.5 h-3.5 text-brand" />}
                      label="Regional Risk Comparison"
                      description="Multi-theater risk breakdown & 30d trajectory"
                    />
                    <RiskTrendWidget />
                  </div>
                  <div className="flex-1 min-h-[260px] animate-slide-up stagger-3">
                    <SectionHeader
                      icon={<Activity className="w-3.5 h-3.5 text-brand" />}
                      label="Instability Index"
                    />
                    <InstabilityIndexWidget />
                  </div>
                </div>
              </div>
            )}

            {analyticsCategory === 'signals-theater' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-full animate-scale-in">
                <div className="flex flex-col min-w-0 animate-slide-up stagger-1">
                  <SectionHeader
                    icon={<Radio className="w-3.5 h-3.5 text-brand" />}
                    label="Real-Time NLP Signal Feed"
                    description="Live OSINT and NLP-processed intelligence streams"
                  />
                  <div className="flex-1 min-h-[500px]">
                    <SignalFeedWidget />
                  </div>
                </div>
                <div className="flex flex-col min-w-0 animate-slide-up stagger-2">
                  <SectionHeader
                    icon={<Grid className="w-3.5 h-3.5 text-brand" />}
                    label="Regional Theater Surveillance"
                    description="Expanded 6-theater multi-domain risk intensity matrix"
                  />
                  <div className="flex-1 min-h-[500px]">
                    <TheaterHeatmapWidget />
                  </div>
                </div>
              </div>
            )}

            {analyticsCategory === 'escalation-metrics' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full animate-scale-in">
                <div className="xl:col-span-2 flex flex-col min-w-0 animate-slide-up stagger-1">
                  <SectionHeader
                    icon={<Activity className="w-3.5 h-3.5 text-brand" />}
                    label="Escalation Timeline & Velocity"
                    description="Chronological threat progression & step trajectory"
                  />
                  <div className="flex-1 min-h-[480px]">
                    <EscalationTimelineWidget />
                  </div>
                </div>
                <div className="flex flex-col gap-4 min-w-0 animate-slide-up stagger-2">
                  <SectionHeader
                    icon={<TrendingUp className="w-3.5 h-3.5 text-brand" />}
                    label="Country Instability Breakdown"
                    description="Kinetic, cyber, sanctions & food stress sub-scores"
                  />
                  <div className="flex-1 min-h-[480px]">
                    <InstabilityIndexWidget />
                  </div>
                </div>
              </div>
            )}

            {analyticsCategory === 'model-diagnostics' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-full animate-scale-in">
                <div className="flex flex-col min-w-0 animate-slide-up stagger-1">
                  <SectionHeader
                    icon={<Cpu className="w-3.5 h-3.5 text-brand" />}
                    label="Model Diagnostics & Performance"
                    description="Accuracy, R², RMSE, ROC-AUC metrics and guardrail retrain logs"
                  />
                  <div className="flex-1 min-h-[500px]">
                    <ModelDiagnosticsWidget />
                  </div>
                </div>
                <div className="flex flex-col min-w-0 animate-slide-up stagger-2">
                  <SectionHeader
                    icon={<Activity className="w-3.5 h-3.5 text-brand" />}
                    label="Live 38-Country Leaderboard"
                    description="Live score ranking, 95% confidence intervals, and feature snapshots"
                  />
                  <div className="flex-1 min-h-[500px]">
                    <InstabilityIndexWidget />
                  </div>
                </div>
              </div>
            )}

            {analyticsCategory === 'bilateral-matrix' && (
              <div className="flex flex-col h-full animate-scale-in">
                <SectionHeader
                  icon={<Grid3X3 className="w-3.5 h-3.5 text-brand" />}
                  label="Bilateral Aggression Matrix (38×38)"
                  description="Hostility score intensity mapping across 703 unique pairwise country relations"
                />
                <div className="flex-1 min-h-[520px]">
                  <BilateralTensionMatrix />
                </div>
              </div>
            )}

            {analyticsCategory === 'db-intelligence' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-full animate-scale-in">
                <div className="flex flex-col gap-4 min-w-0">
                  <RegionalHeadlinesWidget />
                  <GovActionsLogWidget />
                </div>
                <div className="flex flex-col gap-4 min-w-0">
                  <CommoditiesTickerWidget />
                  <ShippingRatesWidget />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
