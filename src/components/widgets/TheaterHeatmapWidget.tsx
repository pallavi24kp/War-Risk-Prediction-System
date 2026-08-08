import React from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { useDashboardState } from '../../store/useDashboardState';
import { ShieldAlert, AlertTriangle, CheckCircle, Radio } from 'lucide-react';
import { clsx } from 'clsx';

interface HeatmapTheater {
  id: string;
  name: string;
  region: string;
  kineticLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW';
  navalPresence: 'HEAVY' | 'MODERATE' | 'STANDARD';
  airspaceRisk: 'CLOSED' | 'RESTRICTED' | 'NORMAL';
  cyberThreat: 'ACTIVE' | 'MODERATE' | 'LOW';
  score: number;
}

const HEATMAP_THEATERS: HeatmapTheater[] = [
  {
    id: 'RED',
    name: 'Red Sea & Bab-el-Mandeb',
    region: 'Middle East',
    kineticLevel: 'CRITICAL',
    navalPresence: 'HEAVY',
    airspaceRisk: 'RESTRICTED',
    cyberThreat: 'ACTIVE',
    score: 92.4,
  },
  {
    id: 'HOR',
    name: 'Strait of Hormuz',
    region: 'Persian Gulf',
    kineticLevel: 'HIGH',
    navalPresence: 'HEAVY',
    airspaceRisk: 'RESTRICTED',
    cyberThreat: 'ACTIVE',
    score: 86.1,
  },
  {
    id: 'TBN',
    name: 'Taiwan Strait & Bashi',
    region: 'Indo-Pacific',
    kineticLevel: 'HIGH',
    navalPresence: 'HEAVY',
    airspaceRisk: 'RESTRICTED',
    cyberThreat: 'ACTIVE',
    score: 79.8,
  },
  {
    id: 'BLK',
    name: 'Black Sea Maritime Zone',
    region: 'Eastern Europe',
    kineticLevel: 'CRITICAL',
    navalPresence: 'MODERATE',
    airspaceRisk: 'CLOSED',
    cyberThreat: 'ACTIVE',
    score: 88.7,
  },
  {
    id: 'BAL',
    name: 'Baltic Undersea Cables',
    region: 'Northern Europe',
    kineticLevel: 'ELEVATED',
    navalPresence: 'MODERATE',
    airspaceRisk: 'NORMAL',
    cyberThreat: 'ACTIVE',
    score: 68.3,
  },
  {
    id: 'KOR',
    name: 'Korean Peninsula Maritime',
    region: 'East Asia',
    kineticLevel: 'ELEVATED',
    navalPresence: 'MODERATE',
    airspaceRisk: 'NORMAL',
    cyberThreat: 'MODERATE',
    score: 64.9,
  },
];

export const TheaterHeatmapWidget: React.FC = () => {
  const { isLiveMode, isLoadingIntelligence } = useDashboardState();

  const getHeatmapColor = (score: number) => {
    if (score >= 85) return 'rgba(239, 68, 68, 0.25)'; // Critical Red
    if (score >= 75) return 'rgba(245, 158, 11, 0.25)'; // Warning Orange
    return 'rgba(59, 130, 246, 0.25)'; // Info Blue
  };

  const getBorderColor = (score: number) => {
    if (score >= 85) return 'rgba(239, 68, 68, 0.5)';
    if (score >= 75) return 'rgba(245, 158, 11, 0.5)';
    return 'rgba(59, 130, 246, 0.5)';
  };

  const getTextColor = (score: number) => {
    if (score >= 85) return 'var(--critical)';
    if (score >= 75) return 'var(--warning)';
    return 'var(--brand)';
  };

  return (
    <WidgetChrome
      title="Regional Theater Surveillance"
      subtitle="Expanded 6-theater threat matrix"
      helpText="Multi-domain operational risk intensity matrix evaluating kinetic events, naval density, airspace restrictions, and cyber posture."
      badgeProps={{
        status: isLiveMode ? 'LIVE' : 'OFFLINE',
        count: HEATMAP_THEATERS.length,
      }}
      isLoading={isLoadingIntelligence}
      minWidth={320}
    >
      <div className="flex flex-col h-full gap-3">
        {/* Heatmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-y-auto pr-0.5 content-start items-start">
          {HEATMAP_THEATERS.map((t) => {
            const bg = getHeatmapColor(t.score);
            const border = getBorderColor(t.score);
            const color = getTextColor(t.score);

            return (
              <div
                key={t.id}
                className="p-3.5 rounded-xl border space-y-3 transition-all duration-200 hover:scale-[1.01] h-fit"
                style={{
                  backgroundColor: bg,
                  borderColor: border,
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">{t.name}</h4>
                    <span className="font-mono text-[10px] text-text-muted">{t.region}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-sm font-extrabold" style={{ color }}>
                      {t.score.toFixed(1)}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color }}>
                      {t.kineticLevel}
                    </span>
                  </div>
                </div>

                {/* Sub-Metrics Grid */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-white/10 text-[10px] font-mono">
                  <div className="p-1.5 rounded bg-black/20 text-center">
                    <div className="text-[9px] text-text-muted">NAVAL</div>
                    <div className="font-semibold text-text-primary mt-0.5">{t.navalPresence}</div>
                  </div>
                  <div className="p-1.5 rounded bg-black/20 text-center">
                    <div className="text-[9px] text-text-muted">AIRSPACE</div>
                    <div className="font-semibold text-text-primary mt-0.5">{t.airspaceRisk}</div>
                  </div>
                  <div className="p-1.5 rounded bg-black/20 text-center">
                    <div className="text-[9px] text-text-muted">CYBER</div>
                    <div className="font-semibold text-text-primary mt-0.5">{t.cyberThreat}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetChrome>
  );
};
