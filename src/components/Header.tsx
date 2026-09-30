import React from 'react';
import { BookOpen, ShieldCheck, Sparkles, HelpCircle, Layers, FileCode, Columns, Github } from 'lucide-react';

interface HeaderProps {
  onOpenProtocol: () => void;
  onOpenBatchQuery: () => void;
  onOpenBibleCanon: () => void;
  onOpenBackup: () => void;
  activePackageTitle: string;
  sourceCount: number;
  batchCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProtocol,
  onOpenBatchQuery,
  onOpenBibleCanon,
  onOpenBackup,
  activePackageTitle,
  sourceCount,
  batchCount = 0,
}) => {
  return (
    <header className="border-b border-stone-800 bg-stone-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-lg shadow-amber-950/50 border border-amber-500/30">
            <BookOpen className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold font-serif text-stone-100 tracking-wide">
                恢復本聖經與職事神學問答引導引擎
              </h1>
              <span className="text-[10px] px-2 py-0.5 font-sans font-semibold rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 uppercase tracking-wider">
                RAG 檢索增強
              </span>
            </div>
            <p className="text-xs text-stone-400 font-sans hidden sm:block">
              嚴格階層語境包約束 · 微斷言原子化溯源 · 雙向高亮渲染 · 零臆測防幻覺
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="hidden lg:flex items-center px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700/50 text-stone-300">
            <Layers className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <span className="text-stone-400 mr-1">當前語境包:</span>
            <span className="text-stone-200 font-medium truncate max-w-[160px]">
              {activePackageTitle}
            </span>
            <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-stone-700 text-amber-200 rounded">
              {sourceCount} 條語料
            </span>
          </div>

          <div className="flex items-center px-2 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" />
            <span>防幻覺契約</span>
          </div>

          <button
            onClick={onOpenBibleCanon}
            className="flex items-center px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 border border-amber-600/40 text-amber-200 transition-colors text-xs font-semibold cursor-pointer shadow-sm shadow-amber-950"
            title="開啟聖經六十六卷正典全書索引庫"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1 text-amber-400" />
            <span>全本聖經正典庫 (66卷)</span>
          </button>

          <button
            onClick={onOpenBackup}
            className="flex items-center px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 hover:text-amber-300 transition-colors text-xs font-semibold cursor-pointer shadow-sm shadow-stone-950"
            title="備份與同步專案程式碼至 GitHub"
          >
            <Github className="w-3.5 h-3.5 mr-1 text-stone-300" />
            <span>GitHub 同步</span>
          </button>

          <button
            onClick={onOpenBatchQuery}
            className="flex items-center px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-500 text-white transition-colors text-xs font-semibold cursor-pointer shadow-sm shadow-amber-950"
            title="開啟批次查經問題分析與橫向比對"
          >
            <Columns className="w-3.5 h-3.5 mr-1" />
            <span>批次比對模式</span>
            {batchCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-amber-900 text-amber-200 rounded-full font-mono">
                {batchCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenProtocol}
            className="flex items-center px-2.5 py-1 rounded-md bg-amber-900/30 hover:bg-amber-800/50 border border-amber-700/50 text-amber-200 hover:text-amber-100 transition-colors text-xs font-medium cursor-pointer"
            title="查看渲染契約與標籤規範"
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            <span>契約規範</span>
          </button>
        </div>
      </div>
    </header>
  );
};
