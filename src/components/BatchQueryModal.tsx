import React, { useState } from 'react';
import { BatchQueryItem, ContextPackage } from '../types/theology';
import {
  ListPlus,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Upload,
  FileText,
  X,
  Plus,
  Trash2,
  Sparkles,
  Columns,
  Maximize2,
  Copy,
  Check
} from 'lucide-react';
import { ClaimRenderer } from './ClaimRenderer';
import { ReasoningBreadcrumbsView } from './ReasoningBreadcrumbs';
import { KnowledgeBoundaryCard } from './KnowledgeBoundaryCard';

interface BatchQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePackage: ContextPackage;
  onBatchRun: (queries: string[]) => Promise<void>;
  batchItems: BatchQueryItem[];
  isBatchRunning: boolean;
  onClearBatch: () => void;
  onSelectClaimAcrossBatch?: (claimId: string, sourceId: string) => void;
  activeSourceId: string | null;
  onSelectSource: (sourceId: string) => void;
}

export const BatchQueryModal: React.FC<BatchQueryModalProps> = ({
  isOpen,
  onClose,
  activePackage,
  onBatchRun,
  batchItems,
  isBatchRunning,
  onClearBatch,
  onSelectClaimAcrossBatch,
  activeSourceId,
  onSelectSource,
}) => {
  const [inputText, setInputText] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImportSampleQuestions = () => {
    const questions = activePackage.sampleQuestions.join('\n\n');
    setInputText(questions);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText((prev) => (prev ? `${prev}\n\n${content}` : content));
      }
    };
    reader.readAsText(file);
  };

  const handleStartRun = () => {
    // Split by newlines or numbered patterns (e.g., 1. 2. or double newlines)
    const rawLines = inputText
      .split(/\n{2,}|\r\n{2,}|\n(?=\d+[\.、\)])/)
      .map((q) => q.replace(/^\d+[\.、\)]\s*/, '').trim())
      .filter((q) => q.length > 3);

    if (rawLines.length === 0) {
      alert('請先輸入或上傳至少一個有效的查經問題');
      return;
    }

    onBatchRun(rawLines);
  };

  const handleCopyXml = (id: string, xml: string) => {
    navigator.clipboard.writeText(xml);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl max-w-7xl w-full h-[94vh] flex flex-col text-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-950/80 border border-amber-600/40 rounded-xl text-amber-400">
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold font-serif text-stone-100">
                  批次查經問題分析與橫向比對引擎 (Batch Query & Cross-Comparison)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  獨立 &lt;response&gt; 生成
                </span>
              </div>
              <p className="text-xs text-stone-400">
                一次貼入或上傳多道神學疑難，依序由階層語境包推導，生成微斷言並支援多視角橫向教義比對
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Input & Execution Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/40">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-stone-300 font-medium flex items-center space-x-1.5">
                  <ListPlus className="w-4 h-4 text-amber-400" />
                  <span>批次問題輸入框（每行一題，或以空行/序號分隔）：</span>
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleImportSampleQuestions}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    載入語境包預設問題
                  </button>
                  <label className="text-[11px] text-stone-400 hover:text-stone-200 cursor-pointer flex items-center space-x-1 bg-stone-800 px-2 py-0.5 rounded border border-stone-700">
                    <Upload className="w-3 h-3" />
                    <span>上傳文字檔 (.txt)</span>
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="例如：&#10;1. 羅馬書五章十節中，『藉著神兒子的死得與神和好』如何解決消極的罪案？&#10;2. 『在祂的生命裡得救』包含哪些主觀台階？&#10;3. 《神的經綸》第六章如何說明終極完成的靈將生命分賜到三部分人裡？"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-serif leading-relaxed"
              />
            </div>

            <div className="flex flex-row lg:flex-col justify-end lg:justify-center gap-2 lg:w-48 shrink-0">
              <button
                type="button"
                onClick={handleStartRun}
                disabled={isBatchRunning || !inputText.trim()}
                className="flex-1 lg:flex-none bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-2.5 text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
              >
                {isBatchRunning ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>批次推論中...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>開始批次生成</span>
                  </>
                )}
              </button>

              {batchItems.length > 0 && (
                <button
                  type="button"
                  onClick={onClearBatch}
                  disabled={isBatchRunning}
                  className="px-3 py-1.5 text-xs text-stone-400 hover:text-rose-400 bg-stone-800/80 hover:bg-stone-800 rounded-xl border border-stone-700/60 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>清除結果</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* View Switcher Bar */}
        <div className="px-6 py-2.5 border-b border-stone-800 bg-stone-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <span className="text-stone-400 font-mono">
              分析列表（共 {batchItems.length} 項分析結果）：
            </span>
            <div className="flex bg-stone-900 p-0.5 rounded-lg border border-stone-800 text-[11px]">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center space-x-1 ${
                  viewMode === 'grid'
                    ? 'bg-amber-600 text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Columns className="w-3 h-3" />
                <span>卡片橫向比對模式</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center space-x-1 ${
                  viewMode === 'table'
                    ? 'bg-amber-600 text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>精要斷言總表</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-stone-400 font-mono">
            <span className="flex items-center text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              實線: 高充分性
            </span>
            <span className="flex items-center text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
              虛線: 綜合推論
            </span>
          </div>
        </div>

        {/* Batch Results View Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-950/50">
          {batchItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl text-amber-400">
                <Columns className="w-8 h-8 opacity-60" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-serif text-stone-200">尚未執行批次神學推論</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-md">
                  在上方輸入多個查經問題或點選「載入語境包預設問題」，系統將為每道問題各自生成遵循 XML 契約的獨立分析報告並提供橫向比對。
                </p>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            /* Multi-column Grid Comparison */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
              {batchItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-stone-900/90 border border-stone-800 rounded-2xl flex flex-col overflow-hidden shadow-lg transition-all"
                >
                  {/* Item Header */}
                  <div className="p-3.5 border-b border-stone-800 bg-stone-950/70 flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-2">
                      <span className="w-5 h-5 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px] font-mono font-bold text-amber-400 shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-serif font-bold text-stone-200 leading-snug">
                          {item.query}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                              item.status === 'success'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                                : item.status === 'running'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-800 animate-pulse'
                                : item.status === 'error'
                                ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                                : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            {item.status === 'success'
                              ? '推論完成'
                              : item.status === 'running'
                              ? '推論中...'
                              : item.status === 'error'
                              ? '推論受阻'
                              : '等待中'}
                          </span>
                          {item.response && (
                            <span className="text-[10px] text-stone-400 font-mono">
                              {item.response.claims.length} 條斷言
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {item.response && (
                      <button
                        onClick={() => handleCopyXml(item.id, item.response!.rawXml)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer shrink-0"
                        title="複製此問題之獨立 XML"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Item Content */}
                  <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                    {item.status === 'running' && (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                        <RotateCcw className="w-6 h-6 text-amber-400 animate-spin" />
                        <span className="text-xs text-stone-400">
                          正在自語境包推導微斷言與標記置信度...
                        </span>
                      </div>
                    )}

                    {item.status === 'error' && (
                      <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
                        {item.error || '推論失敗'}
                      </div>
                    )}

                    {item.response && (
                      <>
                        {/* Breadcrumbs */}
                        <ReasoningBreadcrumbsView
                          breadcrumbs={item.response.breadcrumbs}
                          sources={activePackage.sources}
                          activeSourceId={activeSourceId}
                          onSelectSource={onSelectSource}
                        />

                        {/* Claims */}
                        <ClaimRenderer
                          claims={item.response.claims}
                          sources={activePackage.sources}
                          activeClaimId={null}
                          activeSourceId={activeSourceId}
                          onSelectClaim={(cId, sId) => {
                            if (onSelectClaimAcrossBatch) {
                              onSelectClaimAcrossBatch(cId, sId);
                            }
                          }}
                        />

                        {/* Boundary */}
                        <KnowledgeBoundaryCard boundary={item.response.knowledgeBoundary} />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table Cross-Comparison Mode */
            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950/80 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
                    <tr>
                      <th className="px-4 py-3 w-12">#</th>
                      <th className="px-4 py-3 w-1/4">提問問題</th>
                      <th className="px-4 py-3 w-40">知識邊界狀態</th>
                      <th className="px-4 py-3">核心原子微斷言 (Claims)</th>
                      <th className="px-4 py-3 w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 font-sans">
                    {batchItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-stone-800/30">
                        <td className="px-4 py-3 font-mono font-bold text-amber-400">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-serif font-semibold text-stone-200">
                          {item.query}
                        </td>
                        <td className="px-4 py-3">
                          {item.response ? (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                                item.response.knowledgeBoundary.status === 'sufficient'
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                  : item.response.knowledgeBoundary.status === 'partial'
                                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                                  : 'bg-rose-950 text-rose-300 border-rose-800'
                              }`}
                            >
                              {item.response.knowledgeBoundary.status}
                            </span>
                          ) : (
                            <span className="text-stone-500 font-mono">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 space-y-2">
                          {item.response ? (
                            item.response.claims.map((claim) => (
                              <div
                                key={claim.id}
                                className={`p-2 rounded-lg text-xs leading-relaxed font-serif ${
                                  claim.confidence === 'high'
                                    ? 'bg-stone-950/70 border-b border-amber-400/60 text-stone-200'
                                    : 'bg-amber-950/20 border-b-2 border-dashed border-amber-500/80 text-amber-200'
                                }`}
                              >
                                <span className="font-mono text-[10px] text-amber-400 mr-2 font-bold">
                                  [{claim.source_id} | {claim.confidence}]
                                </span>
                                {claim.text}
                              </div>
                            ))
                          ) : (
                            <span className="text-stone-500">處理中或無數據...</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {item.response && (
                            <button
                              onClick={() => handleCopyXml(item.id, item.response!.rawXml)}
                              className="px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center space-x-1 cursor-pointer"
                            >
                              {copiedId === item.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>XML</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/80 flex justify-between items-center text-xs">
          <span className="text-stone-400">
            當前對齊語境包：<strong className="text-amber-200">{activePackage.title}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors cursor-pointer"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
