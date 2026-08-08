import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Grid,
  BarChart2,
  ShieldAlert,
  Github,
  Search,
  Share2,
  Maximize,
  Settings,
  Info,
  Code,
  ChevronDown,
  Bell,
  Activity,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { useDashboardState } from '../../store/useDashboardState';
import { StatusBadge } from '../common/StatusBadge';
import { MOCK_INGESTION_HEALTH } from '../../data/mock/healthData';
import { clsx } from 'clsx';

function useAnimatedNumber(targetValue: number, duration: number = 500) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const prevValueRef = React.useRef(targetValue);
  const animationFrameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = targetValue;
    if (startValue === endValue) return;

    const startTime = performance.now();

    const updateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      const current = startValue + (endValue - startValue) * easedProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateNumber);
      } else {
        prevValueRef.current = endValue;
        setDisplayValue(endValue);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateNumber);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration]);

  return displayValue;
}

export const TopNav: React.FC = () => {
  const {
    selectedRegion,
    setSelectedRegion,
    view,
    setView,
    activeTab,
    setActiveTab,
    isLiveMode,
    setIsLiveMode,
    intelligenceData,
  } = useDashboardState();

  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);

  // Refs for accessibility & focus management
  const regionTriggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const aboutTriggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const { riskScore, riskDelta } = intelligenceData.situationBrief;
  const animatedRiskScore = useAnimatedNumber(riskScore, 600);

  const regions = [
    'Global',
    'North America',
    'Europe & UK',
    'Middle East',
    'Indo-Pacific',
    'Latin America',
    'Sub-Saharan Africa',
  ];

  // Handle Region Dropdown opening/focusing
  useEffect(() => {
    if (showRegionDropdown) {
      const idx = regions.indexOf(selectedRegion);
      const initialIdx = idx >= 0 ? idx : 0;
      setFocusedOptionIndex(initialIdx);
      setTimeout(() => {
        optionRefs.current[initialIdx]?.focus();
      }, 30);
    }
  }, [showRegionDropdown]);

  // Handle focusing option when focusedOptionIndex changes
  useEffect(() => {
    if (showRegionDropdown && focusedOptionIndex >= 0 && focusedOptionIndex < regions.length) {
      optionRefs.current[focusedOptionIndex]?.focus();
    }
  }, [focusedOptionIndex, showRegionDropdown]);

  // Keyboard navigation for Region trigger button
  const handleRegionTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowRegionDropdown(true);
    }
  };

  // Keyboard navigation inside Region dropdown menu
  const handleOptionKeyDown = (e: React.KeyboardEvent, region: string) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedOptionIndex((prev) => (prev + 1) % regions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedOptionIndex((prev) => (prev - 1 + regions.length) % regions.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedRegion(region);
      setShowRegionDropdown(false);
      regionTriggerRef.current?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowRegionDropdown(false);
      regionTriggerRef.current?.focus();
    }
  };

  // Focus trap for About modal
  useEffect(() => {
    if (showAboutModal) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      const timer = setTimeout(() => {
        if (modalRef.current) {
          const focusables = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length > 0) {
            focusables[0].focus();
          }
        }
      }, 50);

      const handleModalKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setShowAboutModal(false);
          return;
        }

        if (e.key === 'Tab' && modalRef.current) {
          const focusables = Array.from(
            modalRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          );

          if (focusables.length === 0) return;

          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first || !modalRef.current.contains(document.activeElement)) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last || !modalRef.current.contains(document.activeElement)) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleModalKeyDown);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleModalKeyDown);
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [showAboutModal]);

  return (
    <>
      <header className="glass-header h-[52px] flex items-center justify-between select-none z-40 sticky top-0 px-4">
        {/* ── Left: Brand + View Switcher ── */}
        <div className="flex items-center gap-4">
          {/* Brand Mark */}
          <div className="flex items-center gap-2.5 pr-4 border-r border-border-subtle">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-subtle border border-brand-border">
              <ShieldAlert className="w-4 h-4 text-brand" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-text-primary">
                  WAR RISK PREDICTION
                </span>
                <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded text-brand bg-brand-subtle border border-brand-border">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-text-muted font-medium hidden sm:block">
                War Risk & Geopolitical Intelligence Radar
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="glass-pill flex items-center p-0.5 rounded-lg gap-0.5">
            {([
              { tab: 'globe' as const, icon: <Globe className="w-3.5 h-3.5" />, label: 'Globe', view: 'global' as const },
              { tab: 'briefing-overview' as const, icon: <Grid className="w-3.5 h-3.5" />, label: 'Overview', view: 'regional' as const },
              { tab: 'briefing-analytics' as const, icon: <BarChart2 className="w-3.5 h-3.5" />, label: 'Analytics', view: 'regional' as const },
            ] as const).map(({ tab, icon, label, view: viewMode }) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => { setView(viewMode); setActiveTab(tab); }}
                  aria-label={label}
                  aria-pressed={isActive}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                    isActive
                      ? 'bg-brand/20 text-white shadow-[0_1px_4px_rgba(0,0,0,0.4)]'
                      : 'text-text-muted hover:text-text-primary bg-transparent'
                  )}
                >
                  {icon}
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Center: Region + Risk ── */}
        <div className="flex items-center gap-3">
          {/* Region Selector */}
          <div className="relative">
            <button
              ref={regionTriggerRef}
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              onKeyDown={handleRegionTriggerKeyDown}
              aria-haspopup="listbox"
              aria-expanded={showRegionDropdown}
              className="glass-pill flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 hover:border-white/20 text-text-secondary"
            >
              <span className="text-text-muted">Region:</span>
              <span className="font-semibold text-white">
                {selectedRegion}
              </span>
              <ChevronDown
                className={clsx(
                  'w-3.5 h-3.5 transition-transform duration-200 ml-0.5',
                  showRegionDropdown && 'rotate-180'
                )}
              />
            </button>

            {showRegionDropdown && (
              <div
                className="glass-panel absolute top-full mt-1.5 left-0 w-48 rounded-xl py-1 z-50 animate-fade-in"
                role="listbox"
                aria-label="Select intelligence region"
              >
                {regions.map((r, index) => (
                  <button
                    key={r}
                    ref={(el) => { optionRefs.current[index] = el; }}
                    role="option"
                    aria-selected={selectedRegion === r}
                    onClick={() => {
                      setSelectedRegion(r);
                      setShowRegionDropdown(false);
                      regionTriggerRef.current?.focus();
                    }}
                    onKeyDown={(e) => handleOptionKeyDown(e, r)}
                    className={clsx(
                      'w-full text-left px-3 py-2 text-xs transition-colors duration-100 outline-none focus:bg-brand-subtle focus:text-brand focus:font-semibold',
                      selectedRegion === r
                        ? 'text-brand bg-brand-subtle font-semibold'
                        : 'text-text-secondary hover:bg-white/5'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Risk Level */}
          <div className={clsx(
            'flex items-center gap-2.5 px-3 py-1.5 rounded-lg border',
            isLiveMode
              ? 'bg-status-critical-bg border-status-critical-border'
              : 'bg-status-warning-bg border-status-warning-border'
          )}>
            <ShieldAlert className={clsx('w-3.5 h-3.5', isLiveMode ? 'text-status-critical' : 'text-status-warning')} />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-muted">{isLiveMode ? 'Risk' : 'Risk (Stale)'}</span>
              <span className={clsx('font-mono font-bold text-sm', isLiveMode ? 'text-status-critical' : 'text-status-warning')}>
                {animatedRiskScore.toFixed(1)}
              </span>
              <span className={clsx('flex items-center text-xs font-medium', isLiveMode ? 'text-status-critical' : 'text-status-warning')}>
                <ArrowUpRight className="w-3 h-3" />
                {riskDelta.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              aria-label="Notifications (5 unread)"
              className="btn-icon relative"
            >
              <Bell className="w-4 h-4" />
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold text-white bg-status-critical rounded-full flex items-center justify-center"
                aria-label="5 notifications"
              >
                5
              </span>
            </button>
          </div>
        </div>

        {/* ── Right: Connection + Ingestion Health + Utilities + Auth ── */}
        <div className="flex items-center gap-2">
          {/* Ingestion / Source Health Indicator (Section 5) */}
          <div className="hidden sm:flex items-center" title={`Ingestion Sources Health: ${MOCK_INGESTION_HEALTH.active_sources_count}/${MOCK_INGESTION_HEALTH.total_sources_count} operational`}>
            <StatusBadge
              status={MOCK_INGESTION_HEALTH.overall_status}
              sources={`${MOCK_INGESTION_HEALTH.active_sources_count}/${MOCK_INGESTION_HEALTH.total_sources_count}`}
              size="sm"
            />
          </div>

          {/* Connection Status */}
          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            title={isLiveMode ? 'Live WebSocket Active' : 'Offline — Click to reconnect'}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 bg-surface-elevated border',
              isLiveMode
                ? 'border-status-success-border text-status-success'
                : 'border-status-critical-border text-status-critical'
            )}
          >
            <span
              className="relative flex h-2 w-2"
              aria-hidden="true"
            >
              {isLiveMode && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-status-success" />
              )}
              <span
                className={clsx(
                  'relative inline-flex rounded-full h-2 w-2',
                  isLiveMode ? 'bg-status-success' : 'bg-status-critical'
                )}
              />
            </span>
            {isLiveMode ? 'Live' : 'Offline'}
          </button>

          {/* Utility Icons */}
          <div className="hidden lg:flex items-center gap-0.5 pl-2 border-l border-border-subtle">
            <button
              className="btn-icon"
              title="Search — ⌘K"
              aria-label="Open command palette"
            >
              <Search className="w-4 h-4" />
            </button>
            <button className="btn-icon" title="Share View" aria-label="Share current view">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="btn-icon" title="Embed Widget" aria-label="Embed widget">
              <Code className="w-4 h-4" />
            </button>
            <button className="btn-icon" title="Fullscreen" aria-label="Toggle fullscreen">
              <Maximize className="w-4 h-4" />
            </button>
            <button className="btn-icon" title="Settings" aria-label="Open settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* GitHub */}
          <a
            href="https://github.com/warimpact_v2"
            target="_blank"
            rel="noreferrer"
            className="btn-icon"
            title="GitHub Repository"
            aria-label="View source on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* About */}
          <button
            ref={aboutTriggerRef}
            onClick={() => setShowAboutModal(true)}
            className="btn-icon"
            title="About"
            aria-label="About this platform"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Auth */}
          <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
            <button className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 text-text-secondary hover:text-text-primary">
              Sign In
            </button>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 bg-brand text-white hover:opacity-90">
              Get Access
            </button>
          </div>
        </div>
      </header>

      {/* ── About Modal ── */}
      {showAboutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in bg-black/70 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-title"
        >
          <div
            ref={modalRef}
            className="max-w-md w-full rounded-2xl p-6 animate-slide-up bg-surface-panel border border-border-default shadow-[0_24px_64px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-subtle border border-brand-border">
                  <Activity className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <h2
                    id="about-title"
                    className="text-sm font-semibold text-text-primary"
                  >
                    WAR RISK PREDICTION
                  </h2>
                  <p className="text-xs text-text-muted">
                    Intelligence Platform v2.4.0
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="btn-icon"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <p className="text-sm leading-relaxed mb-4 text-text-secondary">
              Real-time global geopolitical instability, trade disruption, and conflict monitoring
              engine. Combining high-frequency spatial telemetry, NLP signal feeds, and predictive
              risk scoring across 12 intelligence layers.
            </p>

            {/* Metadata */}
            <div className="rounded-lg p-4 space-y-2 mb-5 bg-surface-elevated border border-border-subtle">
              {[
                ['Version', 'v2.4.0-INTEL'],
                ['Pipeline', 'GDELT 2.0 · USGS · OpenFDA · Maritime'],
                ['Engine',   'Next.js · Three.js · Zustand'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">{label}</span>
                  <span className="font-mono text-xs font-medium text-text-primary">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 bg-brand text-white hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
