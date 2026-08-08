import React, { useState } from 'react';
import { HelpCircle, MoreVertical, Maximize2, Minimize2, X } from 'lucide-react';
import { StatusBadge, StatusBadgeProps } from './StatusBadge';
import { clsx } from 'clsx';

export interface WidgetChromeProps {
  title: string;
  subtitle?: string;
  helpText?: string;
  badgeProps?: StatusBadgeProps;
  isLoading?: boolean;
  minWidth?: number;
  children: React.ReactNode;
  className?: string;
  headerRightContent?: React.ReactNode;
  /** Card hierarchy tier */
  variant?: 'primary' | 'secondary' | 'flat';
}

export const WidgetChrome: React.FC<WidgetChromeProps> = ({
  title,
  subtitle,
  helpText,
  badgeProps,
  isLoading = false,
  minWidth,
  children,
  className,
  headerRightContent,
  variant = 'secondary',
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const variantClass = {
    primary: 'card-primary',
    secondary: 'card-secondary',
    flat: 'card-flat',
  }[variant];

  return (
    <div
      style={minWidth ? { minWidth: `${minWidth}px` } : undefined}
      className={clsx(
        'flex flex-col h-full rounded-xl overflow-hidden transition-all duration-200',
        isExpanded ? 'widget-expanded' : variantClass,
        className
      )}
    >
      {/* ── Widget Header ── */}
      <div className="widget-header flex items-center justify-between px-3.5 py-2.5 select-none shrink-0">
        {/* Left: Title + Help */}
        <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-[0.05em] truncate text-text-secondary">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs mt-0.5 truncate text-text-muted">
                {subtitle}
              </p>
            )}
          </div>
          {helpText && (
            <button
              onClick={() => setShowHelp(!showHelp)}
              title={helpText}
              aria-label="Show help"
              className="btn-icon shrink-0 w-5 h-5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {headerRightContent}
          {badgeProps && <StatusBadge {...badgeProps} />}
          <div className="flex items-center gap-0.5 pl-1.5 border-l border-border-subtle">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn-icon w-6 h-6"
              title={isExpanded ? 'Minimize' : 'Expand'}
              aria-label={isExpanded ? 'Minimize widget' : 'Expand widget'}
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              className="btn-icon w-6 h-6"
              title="Widget Options"
              aria-label="Widget options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Help Banner ── */}
      {showHelp && helpText && (
        <div className="px-4 py-2.5 flex items-start gap-2 text-xs animate-slide-up bg-status-info-bg border-b border-status-info-border text-status-info">
          <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          <span className="flex-1 leading-relaxed">{helpText}</span>
          <button
            onClick={() => setShowHelp(false)}
            className="shrink-0"
            aria-label="Dismiss help"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Content Area ── */}
      <div className="flex-1 overflow-auto p-4 relative">
        {/* Skeleton Loading Layer */}
        <div
          aria-label="Loading content"
          aria-busy={isLoading}
          aria-hidden={!isLoading}
          className={clsx(
            'space-y-3 transition-opacity duration-300 ease-in-out',
            isLoading
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none absolute inset-4'
          )}
        >
          <div className="skeleton-line h-3 w-3/4 rounded" />
          <div className="skeleton-line h-16 w-full rounded-lg" />
          <div className="skeleton-line h-3 w-1/2 rounded" />
          <div className="skeleton-line h-10 w-full rounded-lg" />
        </div>

        {/* Real Content Layer */}
        <div
          className={clsx(
            'transition-opacity duration-300 ease-in-out h-full min-h-0',
            isLoading
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100 pointer-events-auto'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
