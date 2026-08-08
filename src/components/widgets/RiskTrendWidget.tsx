import React from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { RiskTrendSparkline } from '../common/RiskTrendSparkline';
import { useDashboardState } from '../../store/useDashboardState';

export const RiskTrendWidget: React.FC = () => {
  const { isLiveMode, isLoadingIntelligence } = useDashboardState();

  return (
    <WidgetChrome
      title="Regional Risk Comparison"
      subtitle="Multi-theater risk matrix"
      helpText="Comparative risk breakdown and 30-day velocity trends across major global geopolitical maritime theaters."
      badgeProps={{
        status: isLiveMode ? 'LIVE' : 'OFFLINE',
        count: 5,
      }}
      isLoading={isLoadingIntelligence}
      minWidth={280}
    >
      <div className="flex flex-col h-full gap-2">
        <RiskTrendSparkline />
      </div>
    </WidgetChrome>
  );
};
