import React, { useState, useEffect, useRef } from 'react';
import { ContextPackage, SourceChunk, SourceType } from '../types/theology';
import {
  Layers,
  Search,
  BookOpen,
  Filter,
  CheckCircle,
  FileText,
  Plus,
  ExternalLink,
  Tag,
  Bookmark,
} from 'lucide-react';

interface ContextPackageViewerProps {
  contextPackage: ContextPackage;
  activeSourceId: string | null;
  activeClaimSourceId?: string | null;
  citedSourceIds: string[];
  onSelectSource: (sourceId: string) => void;
  onOpenCustomPackage: () => void;
}

export const ContextPackageViewer: React.FC<ContextPackageViewerProps> = ({
  contextPackage,
  activeSourceId,
  activeClaimSourceId,
  citedSourceIds,
  onSelectSource,
  onOpenCustomPackage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const sourceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const targetActiveId = activeClaimSourceId || activeSourceId;

  // Auto-scroll to selected source
  useEffect(() => {
    if (targetActiveId && sourceRefs.current[targetActiveId]) {
      sourceRefs.current[targetActiveId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [targetActiveId]);

  const filteredSources = contextPackage.sources.filter((src) => {
    const matchesSearch =
      src.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (src.reference && src.reference.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || src.type === selectedType;

    return matchesSearch && matchesType;
  });

  const getTypeStyle = (type: SourceType) => {
    switch (type) {
      case 'verse':
        return {
          label: '經文 Verse',
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
          indicator: 'bg-emerald-500',
        };
      case 'footnote':
        return {
          label: '註解 Footnote',
          badge: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
          indicator: 'bg-sky-500',
        };
      case 'outline':
        return {
          label: '綱目 Outline',
          badge: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
          indicator: 'bg-purple-500',
        };
      case 'lifestudy':
        return {
          label: '生命讀經 Life-Study',
          badge: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
          indicator: 'bg-amber-500',
        };
      default:
        return {
          label: '職事語料',
          badge: 'bg-stone-800 text-stone-300 border-stone-700',
          indicator: 'bg-stone-500',
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-900/90 border border-stone-800 rounded-xl overflow-hidden shadow-lg">
      {/* Panel Header */}
      <div className="p-4 border-b border-stone-800 bg-stone-950/70">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-950/80 rounded-lg border border-amber-700/50 text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-stone-100 flex items-center gap-1.5">
                <span>階層語境包（父文檔上下文）</span>
              </h2>
              <p className="text-[11px] text-stone-400 font-sans">
                RAG 模組注入原生經文、恢復本註釋、綱目與職事文集切片
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCustomPackage}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-800/40 hover:border-amber-700 transition-colors cursor-pointer shrink-0"
            title="編輯或自定義注入語境"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>自定義注入</span>
          </button>
        </div>

        {/* Current Package Meta */}
        <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-800 text-xs">
          <div className="flex items-center justify-between text-stone-300 mb-1">
            <span className="font-semibold text-amber-200 truncate">{contextPackage.title}</span>
            <span className="text-[10px] text-stone-400 bg-stone-800 px-1.5 py-0.5 rounded font-mono">
              {contextPackage.sources.length} 條語料
            </span>
          </div>
          <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed font-sans">
            {contextPackage.description}
          </p>

          {contextPackage.crossReferences && contextPackage.crossReferences.length > 0 && (
            <div className="mt-2 pt-2 border-t border-stone-800 space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                拓撲交叉關聯 (Cross References):
              </span>
              {contextPackage.crossReferences.map((ref, idx) => (
                <div
                  key={idx}
                  className="font-mono text-[10px] text-stone-300 bg-stone-950/80 px-2 py-0.5 rounded border border-stone-800 truncate"
                >
                  {ref}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-3 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋語料 ID、經節關鍵字或父文檔..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-950/80 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-600/70"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {[
              { id: 'all', label: '全部' },
              { id: 'verse', label: '經文' },
              { id: 'footnote', label: '註解' },
              { id: 'outline', label: '綱目' },
              { id: 'lifestudy', label: '生命讀經' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  selectedType === tab.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {filteredSources.length === 0 ? (
          <div className="py-12 text-center text-stone-500 text-xs font-sans">
            無符合條件的語境切片
          </div>
        ) : (
          filteredSources.map((source) => {
            const isTarget = targetActiveId === source.id;
            const isCited = citedSourceIds.includes(source.id);
            const style = getTypeStyle(source.type);

            return (
              <div
                key={source.id}
                ref={(el) => {
                  sourceRefs.current[source.id] = el;
                }}
                onClick={() => onSelectSource(source.id)}
                className={`relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isTarget
                    ? 'bg-amber-950/50 border-amber-500 shadow-lg shadow-amber-950/50 ring-2 ring-amber-500/60'
                    : isCited
                    ? 'bg-stone-900/90 border-stone-700/80 hover:border-amber-700/60'
                    : 'bg-stone-950/60 border-stone-800/80 hover:border-stone-700'
                }`}
              >
                {/* Active Indicator Bar */}
                {isTarget && (
                  <div className="absolute -left-1 top-3 bottom-3 w-1.5 bg-amber-500 rounded-full" />
                )}

                {/* Source Header */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2 font-sans">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                      {source.id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium border ${style.badge}`}
                    >
                      {style.label}
                    </span>
                    {source.reference && (
                      <span className="text-xs font-semibold text-stone-200">
                        {source.reference}
                      </span>
                    )}
                  </div>

                  {isCited && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-medium inline-flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      已引用於解答
                    </span>
                  )}
                </div>

                {/* Parent Document Context (階層父文檔上下文) */}
                {source.parentContext && (
                  <div className="mb-2.5 px-2.5 py-1 rounded bg-stone-950/80 border border-stone-800/90 text-[11px] text-stone-400 font-sans flex items-center space-x-1.5">
                    <Bookmark className="w-3 h-3 text-amber-400/80 shrink-0" />
                    <span className="text-stone-300 truncate">{source.parentContext}</span>
                  </div>
                )}

                {/* Source Title */}
                <h4 className="text-xs font-bold text-stone-200 font-serif mb-2">
                  {source.title}
                </h4>

                {/* Content Block */}
                <div className="p-3 bg-stone-950/70 rounded-lg border border-stone-800/60 text-stone-300 text-xs font-serif leading-relaxed">
                  {source.content}
                </div>

                {/* Tags & Metadata */}
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-sans text-stone-500">
                  <div className="flex flex-wrap gap-1">
                    {source.author && (
                      <span className="text-stone-400">職事作者: {source.author}</span>
                    )}
                  </div>

                  <span className="text-stone-400 group-hover:text-amber-400 transition-colors">
                    點擊反向高亮關聯斷言
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
