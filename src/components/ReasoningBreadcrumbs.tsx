import React from 'react';
import { ReasoningBreadcrumb, SourceChunk } from '../types/theology';
import { GitCommit, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';

interface ReasoningBreadcrumbsProps {
  breadcrumbs: ReasoningBreadcrumb[];
  sources: SourceChunk[];
  activeSourceId: string | null;
  onSelectSource: (sourceId: string) => void;
}

export const ReasoningBreadcrumbsView: React.FC<ReasoningBreadcrumbsProps> = ({
  breadcrumbs,
  sources,
  activeSourceId,
  onSelectSource,
}) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 shadow-sm mb-5">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-800/80">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-amber-950/80 rounded border border-amber-600/40 text-amber-400">
            <GitCommit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider font-mono">
              推理鏈微地圖 (Reasoning Breadcrumbs)
            </h3>
            <p className="text-[11px] text-stone-400">
              跨卷與跨註解之神學推論節點流向（點擊節點可直接錨定溯源語境）
            </p>
          </div>
        </div>
        <span className="text-[10px] text-stone-400 font-mono px-2 py-0.5 rounded bg-stone-800 border border-stone-700">
          {breadcrumbs.length} 階推論步階
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {breadcrumbs.map((step, idx) => {
          const matchedSource = sources.find((s) => s.id === step.source_id);
          const isSelected = activeSourceId === step.source_id;

          return (
            <React.Fragment key={`step-${step.order}-${idx}`}>
              <button
                onClick={() => onSelectSource(step.source_id)}
                className={`group flex items-center space-x-2 px-3 py-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-950/80 border-amber-500/80 text-amber-100 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-stone-950/60 hover:bg-stone-800/80 border-stone-800 hover:border-stone-700 text-stone-300'
                }`}
                title={matchedSource ? `點擊錨定語料：${matchedSource.title}` : `語料編號: ${step.source_id}`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-800 text-stone-400 group-hover:bg-stone-700 group-hover:text-amber-300'
                  }`}
                >
                  {step.order}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-stone-200 group-hover:text-amber-200">
                      {step.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-[10px] font-mono text-amber-400/90 bg-amber-950/50 px-1 rounded border border-amber-800/40">
                      {step.source_id || 'GENERAL'}
                    </span>
                    {matchedSource && (
                      <span className="text-[10px] text-stone-400 truncate max-w-[120px]">
                        {matchedSource.reference || matchedSource.book}
                      </span>
                    )}
                  </div>
                </div>

                <ExternalLink className="w-3 h-3 text-stone-500 group-hover:text-amber-400 ml-1 opacity-60 group-hover:opacity-100" />
              </button>

              {idx < breadcrumbs.length - 1 && (
                <div className="text-stone-600 flex items-center px-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
