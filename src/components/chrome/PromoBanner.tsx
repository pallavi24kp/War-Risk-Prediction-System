import React, { useEffect } from 'react';
import { X, Zap, ArrowRight } from 'lucide-react';
import { useDashboardState } from '../../store/useDashboardState';

export const PromoBanner: React.FC = () => {
  const [isMounted, setIsMounted] = React.useState(false);
  const { isPromoBannerDismissed, setPromoBannerDismissed } = useDashboardState();

  useEffect(() => {
    setIsMounted(true);
    const dismissed = localStorage.getItem('aetheria_promo_dismissed');
    if (dismissed === 'true') {
      setPromoBannerDismissed(true);
    }
  }, [setPromoBannerDismissed]);

  const handleDismiss = () => {
    setPromoBannerDismissed(true);
    localStorage.setItem('aetheria_promo_dismissed', 'true');
  };

  if (isMounted && isPromoBannerDismissed) return null;

  return (
    <div
      className="glass-pill flex items-center justify-between select-none animate-fade-in my-1 mx-3 px-3 py-1.5 rounded-lg border border-brand/30 bg-brand/10 backdrop-blur-md"
      role="banner"
      aria-label="Intel update banner"
    >
      <div className="flex items-center gap-3">
        {/* Label */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-brand text-white">
          <Zap className="w-3 h-3" aria-hidden="true" />
          Update
        </span>

        {/* Copy */}
        <span className="text-xs hidden sm:inline text-text-secondary">
          Live Maritime Trade Chokepoint Telemetry v2.4 now active across Malacca, Hormuz & Suez.
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => alert('Launching Maritime Intelligence Telemetry...')}
          className="flex items-center gap-1 text-xs font-medium transition-all duration-150 text-brand hover:opacity-80"
        >
          View Stream
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        <button
          onClick={handleDismiss}
          className="btn-icon"
          title="Dismiss permanently"
          aria-label="Dismiss this banner permanently"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
