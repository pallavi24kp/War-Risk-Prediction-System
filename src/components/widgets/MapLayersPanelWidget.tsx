import React, { useState } from 'react';
import { WidgetChrome } from '../common/WidgetChrome';
import { useDashboardState, LayerId, ALL_LAYERS } from '../../store/useDashboardState';
import { LAYER_METADATA_REGISTRY } from '../globe/DataLayerRegistry';
import { Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { clsx } from 'clsx';

export const MapLayersPanelWidget: React.FC = () => {
  const { layers, toggleLayer, setLayers, isLiveMode } = useDashboardState();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectAll = () => setLayers([...ALL_LAYERS]);
  const handleClearAll  = () => setLayers([]);

  const filteredLayers = ALL_LAYERS.filter((id) => {
    const meta = LAYER_METADATA_REGISTRY[id];
    return (
      meta.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meta.categoryTag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <WidgetChrome
      title="Intelligence Layers"
      subtitle={`${layers.length} of ${ALL_LAYERS.length} active`}
      helpText="Toggle 3D globe telemetry overlays. Each layer renders real-time data from its intelligence source."
      badgeProps={{
        status: isLiveMode ? 'LIVE' : 'OFFLINE',
        sources: `${layers.length}/${ALL_LAYERS.length}`,
      }}
      minWidth={240}
    >
      <div className="flex flex-col h-full gap-3">
        {/* ── Search ── */}
        <div className="relative">
          <Search
            className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter layers…"
            className="input pl-8"
            aria-label="Filter intelligence layers"
          />
        </div>

        {/* ── Bulk Controls ── */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">
            {filteredLayers.length} result{filteredLayers.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="text-xs font-medium transition-colors duration-150 text-brand hover:opacity-75"
            >
              All
            </button>
            <span className="text-border-default">·</span>
            <button
              onClick={handleClearAll}
              className="text-xs font-medium transition-colors duration-150 text-text-muted hover:text-text-secondary"
            >
              None
            </button>
          </div>
        </div>

        {/* ── Layers List ── */}
        <div
          className="flex-1 overflow-y-auto space-y-1 -mx-1 px-1"
          role="list"
          aria-label="Intelligence layer toggles"
        >
          {filteredLayers.map((id) => {
            const meta      = LAYER_METADATA_REGISTRY[id];
            const isChecked = layers.includes(id);

            return (
              <div
                key={id}
                role="listitem"
                onClick={() => toggleLayer(id)}
                className={clsx(
                  'flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all duration-150 select-none group border',
                  isChecked
                    ? 'bg-brand-subtle border-brand-border'
                    : 'bg-transparent border-transparent hover:bg-surface-elevated hover:border-border-subtle'
                )}
                aria-pressed={isChecked}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && toggleLayer(id)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Toggle icon */}
                  <span aria-hidden="true">
                    {isChecked ? (
                      <ToggleRight className="w-4 h-4 shrink-0 text-brand" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 shrink-0 text-text-disabled" />
                    )}
                  </span>

                  <div className="min-w-0">
                    <div className={clsx('text-xs font-medium truncate', isChecked ? 'text-text-primary' : 'text-text-secondary')}>
                      {meta.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted border border-border-subtle">
                        {meta.categoryTag}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {meta.updatedAgo}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={clsx('text-xs font-mono font-medium shrink-0 ml-2', isChecked ? 'text-brand' : 'text-text-muted')}>
                  {meta.count}
                </span>
              </div>
            );
          })}

          {filteredLayers.length === 0 && (
            <div className="text-center py-8 text-sm text-text-muted">
              No layers match "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </WidgetChrome>
  );
};
