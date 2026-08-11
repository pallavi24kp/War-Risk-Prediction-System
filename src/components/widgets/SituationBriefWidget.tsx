import React, { useState } from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { FileText, Sparkles, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useDashboardState } from '../../store/useDashboardState';
import { useSynthesisQuery } from '../../lib/useApiQueries';

export const SituationBriefWidget: React.FC = () => {
  const { isLiveMode, isLoadingIntelligence, intelligenceData, selectedRegion } = useDashboardState();
  const [selectedCitation, setSelectedCitation] = useState<number | null>(null);

  // Normalize region code for synthesis endpoint
  const regionKey = (selectedRegion || 'Middle East').toLowerCase().replace(/\s+/g, '_');
  const { data: liveSynthesis, isLoading: isSynthesisLoading, isError } = useSynthesisQuery(regionKey);

  const fallback = intelligenceData.situationBrief;

  const riskScore = liveSynthesis ? liveSynthesis.risk_score : fallback.riskScore;
  const riskDelta = liveSynthesis ? liveSynthesis.risk_delta : fallback.riskDelta;
  const synthesisText = liveSynthesis ? liveSynthesis.summary : fallback.synthesisText;
  const citations = liveSynthesis ? liveSynthesis.citations : fallback.citations;
  const threatVectors = liveSynthesis
    ? liveSynthesis.threat_vectors.map((tv) => ({
        id: tv.id,
        severity: tv.severity,
        title: tv.title,
        detail: tv.detail,
        citationId: tv.citationId,
      }))
    : fallback.threatVectors;

  const updatedAt = liveSynthesis
    ? `${Math.max(1, Math.floor((Date.now() - new Date(liveSynthesis.generated_at).getTime()) / 60000))}m ago`
    : fallback.updatedAt;

  return (
    <WidgetChrome
      title="Situation Brief"
      subtitle="AI-synthesized executive intelligence"
      helpText="Automated executive intelligence synthesis derived from GDELT 2.0, USGS, & maritime telemetry streams."
      badgeProps={{
        status: isLiveMode && !isError ? 'LIVE' : 'OFFLINE',
        sources: `${citations.length}/${citations.length}`,
        timestamp: updatedAt,
      }}
      isLoading={isLoadingIntelligence || isSynthesisLoading}
      minWidth={280}
    >
      <div className="flex flex-col h-full gap-4 text-sm">
        {/* ── AI Synthesis Block ── */}
        <div className="rounded-lg p-3.5 relative bg-brand-subtle border border-brand-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.05em] text-brand">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              AI Executive Synthesis
            </div>
            {liveSynthesis?.model_version && (
              <span className="text-[10px] font-mono text-brand opacity-80">
                {liveSynthesis.model_version}
              </span>
            )}
            {!isLiveMode && (
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-status-warning-bg text-status-warning border border-status-warning-border">
                Offline Fallback
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            {synthesisText.includes(`${riskScore.toFixed(1)} (+${riskDelta.toFixed(1)})`) ? (
              <>
                {synthesisText.split(`${riskScore.toFixed(1)} (+${riskDelta.toFixed(1)})`)[0]}
                <strong className="font-mono font-bold text-status-critical">
                  {riskScore.toFixed(1)} (+{riskDelta.toFixed(1)})
                </strong>
                {synthesisText.split(`${riskScore.toFixed(1)} (+${riskDelta.toFixed(1)})`)[1] || ''}
              </>
            ) : (
              <>
                {synthesisText}{' '}
                <strong className="font-mono font-bold text-status-critical ml-1">
                  [{riskScore.toFixed(1)} (+{riskDelta.toFixed(1)})]
                </strong>
              </>
            )}
          </p>
        </div>

        {/* ── Threat Vectors ── */}
        <div className="space-y-2">
          <h4 className="section-label">Key Threat Vectors</h4>
          {/* Suppressed: browser extensions (e.g. Grammarly/LastPass) inject DOM nodes into list elements before hydration; this is a known false-positive, see SuppressExtensionErrors.tsx */}
          <ul className="space-y-2" role="list" suppressHydrationWarning>
            {threatVectors.map((tv, idx) => (
              <ThreatItem
                key={tv.id}
                severity={tv.severity}
                className={clsx('animate-slide-up', `stagger-${Math.min(idx + 4, 6)}`)}
                text={
                  <>
                    <strong className="text-text-primary">{tv.title}:</strong>{' '}
                    {tv.detail}{' '}
                    <CitationButton
                      id={tv.citationId}
                      active={selectedCitation === tv.citationId}
                      onClick={() =>
                        setSelectedCitation(selectedCitation === tv.citationId ? null : tv.citationId)
                      }
                    />
                  </>
                }
              />
            ))}
          </ul>
        </div>

        {/* ── Citation Panel ── */}
        {selectedCitation !== null && (() => {
          const c = citations.find((x) => x.id === selectedCitation);
          if (!c) return null;
          return (
            <div
              className="rounded-lg p-3 animate-slide-up bg-surface-elevated border border-border-default"
              role="region"
              aria-label={`Citation ${selectedCitation} details`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-brand">
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  Source [{c.id}]
                </span>
                <button
                  onClick={() => setSelectedCitation(null)}
                  className="btn-icon w-5 h-5"
                  aria-label="Close citation"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs font-medium leading-snug mb-2 text-text-primary">
                {c.title}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  {c.source}
                </span>
                <span className="font-mono text-xs text-text-muted">
                  {c.timestamp}
                </span>
              </div>
            </div>
          );
        })()}
      </div>
    </WidgetChrome>
  );
};

/* ── Internal sub-components ── */
function CitationButton({
  id,
  active,
  onClick,
}: {
  id: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`View citation ${id}`}
      aria-pressed={active}
      className={clsx(
        'inline-flex items-center justify-center font-mono font-semibold rounded transition-all duration-150 text-[10px] px-1.5 py-[1px] align-middle border',
        active
          ? 'bg-brand border-brand text-white'
          : 'bg-brand-subtle border-brand-border text-brand'
      )}
    >
      [{id}]
    </button>
  );
}

function ThreatItem({
  severity,
  text,
  className,
}: {
  severity: 'critical' | 'warning';
  text: React.ReactNode;
  className?: string;
}) {
  const dotBg = severity === 'critical' ? 'bg-status-critical' : 'bg-status-warning';
  return (
    <li
      className={clsx(
        'flex items-start gap-2.5 p-2.5 rounded-lg text-xs leading-relaxed bg-surface-elevated border border-border-subtle text-text-secondary',
        className
      )}
    >
      <span
        className={clsx('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', dotBg)}
        aria-hidden="true"
      />
      <span className="flex-1">{text}</span>
    </li>
  );
}
