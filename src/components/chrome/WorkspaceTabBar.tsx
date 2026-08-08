import React, { useState } from 'react';
import { Globe, Grid, BarChart2, Plus, X, Layers } from 'lucide-react';
import { useDashboardState, WorkspaceTab } from '../../store/useDashboardState';
import { clsx } from 'clsx';

export const WorkspaceTabBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    workspaceTabs,
    addWorkspaceTab,
    removeWorkspaceTab,
  } = useDashboardState();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [newTabType, setNewTabType] = useState<'briefing-overview' | 'briefing-analytics'>('briefing-overview');

  const handleAddTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTabName.trim()) return;
    addWorkspaceTab(newTabName.trim(), newTabType);
    setNewTabName('');
    setShowAddModal(false);
  };

  return (
    <div className="flex items-center justify-between select-none px-4 bg-[#080a0e]/70 backdrop-blur-md border-b border-white/5 h-[36px]">
      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 h-full overflow-x-auto no-scrollbar">
        {workspaceTabs.map((tab) => {
          const isActive = activeTab === tab.type;
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.type)}
              className={clsx(
                'relative flex items-center gap-2 px-3 h-[30px] rounded-lg cursor-pointer group transition-all duration-150 shrink-0 text-xs font-medium border',
                isActive
                  ? 'bg-brand/15 border-brand/30 text-white'
                  : 'bg-transparent border-transparent text-text-muted hover:text-text-secondary'
              )}
            >
              {tab.type === 'globe' && <Globe className="w-3.5 h-3.5 shrink-0 text-brand" />}
              {tab.type === 'briefing-overview' && <Grid className="w-3.5 h-3.5 shrink-0 text-brand" />}
              {tab.type === 'briefing-analytics' && <BarChart2 className="w-3.5 h-3.5 shrink-0 text-brand" />}
              <span className="text-xs font-medium">{tab.name}</span>

              {workspaceTabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWorkspaceTab(tab.id);
                  }}
                  aria-label={`Close ${tab.name} tab`}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all duration-150 text-text-muted hover:text-status-critical"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Tab Button */}
        <button
          onClick={() => setShowAddModal(true)}
          aria-label="Add new workspace tab"
          className="flex items-center justify-center w-7 h-7 rounded-md ml-1 transition-all duration-150 text-text-muted border border-dashed border-border-default hover:text-text-primary hover:bg-surface-elevated"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Right Info ── */}
      <div className="hidden md:flex items-center gap-1.5 text-text-muted">
        <Layers className="w-3.5 h-3.5" />
        <span className="text-xs">
          12 intelligence layers active
        </span>
      </div>

      {/* ── Add Tab Modal ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-tab-title"
        >
          <form
            onSubmit={handleAddTab}
            className="max-w-sm w-full rounded-xl p-5 space-y-4 animate-slide-up bg-surface-panel border border-border-default shadow-[0_24px_64px_rgba(0,0,0,0.7)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3
                id="add-tab-title"
                className="text-sm font-semibold text-text-primary"
              >
                New Workspace Tab
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-icon"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">
                Tab Name
              </label>
              <input
                type="text"
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                placeholder="e.g. Briefing Overview"
                className="input"
                autoFocus
              />
            </div>

            {/* View Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">
                View Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['briefing-overview', 'briefing-analytics'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewTabType(type)}
                    className={clsx(
                      'flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border text-xs font-medium transition-all duration-150',
                      newTabType === type
                        ? 'bg-brand-subtle border-brand-border text-brand'
                        : 'bg-surface-elevated border-border-default text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {type === 'briefing-overview' && <Grid className="w-4 h-4" />}
                    {type === 'briefing-analytics' && <BarChart2 className="w-4 h-4" />}
                    <span>{type === 'briefing-overview' ? 'Overview' : 'Analytics'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-ghost btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary btn-sm"
              >
                Create Tab
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
