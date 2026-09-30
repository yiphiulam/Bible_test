import React, { useState } from 'react';
import { BIBLE_66_BOOKS, BibleBookInfo } from '../data/bibleCanon';
import { BookOpen, Search, Filter, Layers, Check, ExternalLink, X, BookMarked, Sparkles } from 'lucide-react';
import { SourceChunk } from '../types/theology';

interface BibleCanonBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBookChunk: (book: BibleBookInfo) => void;
  activeSources: SourceChunk[];
}

export const BibleCanonBrowserModal: React.FC<BibleCanonBrowserModalProps> = ({
  isOpen,
  onClose,
  onSelectBookChunk,
  activeSources,
}) => {
  const [activeTestament, setActiveTestament] = useState<'ALL' | 'OT' | 'NT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<BibleBookInfo | null>(BIBLE_66_BOOKS[0]);

  if (!isOpen) return null;

  const filteredBooks = BIBLE_66_BOOKS.filter((b) => {
    const matchesTestament = activeTestament === 'ALL' || b.testament === activeTestament;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTestament && matchesSearch;
  });

  const activeBookSources = selectedBook
    ? activeSources.filter((s) => s.id.startsWith(selectedBook.id) || (s.book && s.book.includes(selectedBook.name)))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col text-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-950/80 border border-amber-600/40 rounded-xl text-amber-400">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold font-serif text-stone-100">
                  聖經六十六卷正典神聖經綸全書索引庫
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  舊約 39 卷 + 新約 27 卷
                </span>
              </div>
              <p className="text-xs text-stone-400">
                覆蓋整本聖經之書卷主題、章節規模、神聖經綸演進與對應恢復本樞紐切片
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-stone-800 bg-stone-950/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="flex bg-stone-950 p-0.5 rounded-lg border border-stone-800 text-[11px]">
              <button
                onClick={() => setActiveTestament('ALL')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTestament === 'ALL'
                    ? 'bg-amber-600 text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                全本聖經 (66卷)
              </button>
              <button
                onClick={() => setActiveTestament('OT')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTestament === 'OT'
                    ? 'bg-amber-600 text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                舊約 (39卷)
              </button>
              <button
                onClick={() => setActiveTestament('NT')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTestament === 'NT'
                    ? 'bg-amber-600 text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                新約 (27卷)
              </button>
            </div>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋卷名、簡稱、主題或體裁..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Content Splitter */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Book Grid/List */}
          <div className="md:w-1/2 lg:w-5/12 border-r border-stone-800 overflow-y-auto p-4 space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredBooks.map((b) => {
                const isSelected = selectedBook?.id === b.id;
                const hasSources = activeSources.some(
                  (s) => s.id.startsWith(b.id) || (s.book && s.book.includes(b.name))
                );

                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBook(b)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-950/80 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-stone-950/60 hover:bg-stone-800/80 border-stone-800 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-amber-400/90 font-bold">
                        {b.id}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {b.totalChapters}章
                      </span>
                    </div>

                    <div className="font-serif font-bold text-xs text-stone-200 mb-1">
                      {b.name}
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-stone-400 bg-stone-900 px-1 rounded">
                        {b.category}
                      </span>
                      {hasSources && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" title="語料庫已收錄此卷核心切片" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Book Detail & Grounded Source Explorer */}
          <div className="md:w-1/2 lg:w-7/12 p-5 overflow-y-auto space-y-5 bg-stone-950/40">
            {selectedBook ? (
              <div className="space-y-4">
                {/* Book Header Card */}
                <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                        {selectedBook.testament === 'OT' ? '舊約聖經' : '新約聖經'} · {selectedBook.category}
                      </span>
                      <span className="font-mono text-xs text-stone-400">
                        全卷共有 {selectedBook.totalChapters} 章
                      </span>
                    </div>

                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {selectedBook.id} / {selectedBook.shortName}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-stone-100 mb-2">
                    《{selectedBook.name}》
                  </h3>

                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                      職事神聖經綸主題啟示：
                    </span>
                    <p className="text-xs text-stone-300 leading-relaxed font-serif">
                      {selectedBook.theme}
                    </p>
                  </div>
                </div>

                {/* Grounded Source Chunks in Active Package */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center">
                      <Layers className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                      <span>本卷收錄之階層檢索語料切片 ({activeBookSources.length} 條)</span>
                    </h4>
                  </div>

                  {activeBookSources.length === 0 ? (
                    <div className="p-5 bg-stone-900/60 border border-dashed border-stone-800 rounded-xl text-center text-stone-500 text-xs">
                      本卷書之核心神聖經綸已登錄於全書索引庫綱目，點擊右上方「自定義注入」可擴充本卷更多具體經節或註解切片。
                    </div>
                  ) : (
                    activeBookSources.map((src) => (
                      <div
                        key={src.id}
                        className="p-3.5 bg-stone-900 border border-stone-800 rounded-xl space-y-2 hover:border-amber-700/60 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-amber-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                              {src.id}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-300">
                              {src.type}
                            </span>
                            <span className="text-xs font-semibold text-stone-200">
                              {src.reference}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs font-serif font-bold text-stone-100">
                          {src.title}
                        </div>

                        <p className="p-2.5 bg-stone-950 rounded-lg text-xs font-serif leading-relaxed text-stone-300">
                          {src.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-stone-500 text-xs">
                請在左側選擇任一聖經書卷以檢視經緯與語料切片
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/80 flex justify-between items-center text-xs">
          <span className="text-stone-400">
            全本聖經正典 66 卷已完備索引並連通神聖經綸綱目與終極總結新耶路撒冷
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors cursor-pointer"
          >
            關閉檢視
          </button>
        </div>
      </div>
    </div>
  );
};
