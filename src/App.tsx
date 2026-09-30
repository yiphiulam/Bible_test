import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProtocolModal } from './components/ProtocolModal';
import { ReasoningBreadcrumbsView } from './components/ReasoningBreadcrumbs';
import { ClaimRenderer } from './components/ClaimRenderer';
import { KnowledgeBoundaryCard } from './components/KnowledgeBoundaryCard';
import { ClaimAuditLedger } from './components/ClaimAuditLedger';
import { ContextPackageViewer } from './components/ContextPackageViewer';
import { CustomPackageModal } from './components/CustomPackageModal';
import { BatchQueryModal } from './components/BatchQueryModal';
import { BibleCanonBrowserModal } from './components/BibleCanonBrowserModal';
import { GitHubBackupModal } from './components/GitHubBackupModal';
import { PRESET_CONTEXT_PACKAGES } from './data/contextLibrary';
import { ContextPackage, ParsedEngineResponse, BatchQueryItem } from './types/theology';
import { parseEngineResponse } from './utils/xmlParser';
import {
  Send,
  Sparkles,
  BookOpen,
  Code,
  Shield,
  Layers,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  ChevronRight,
  Database,
} from 'lucide-react';

export default function App() {
  const [packages, setPackages] = useState<ContextPackage[]>(PRESET_CONTEXT_PACKAGES);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(PRESET_CONTEXT_PACKAGES[0].id);
  const [query, setQuery] = useState<string>(
    '在神完整的救恩裡，基督的死成就的客觀救恩與基督的生命在信徒裡面作的主觀救恩有何區別？這如何連於《神的經綸》中神的終極心意？'
  );
  const [strictness, setStrictness] = useState<'strict' | 'synthetic'>('strict');

  // Interactive Highlighting States
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);

  // Modals & Tabs
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);
  const [isCustomPackageOpen, setIsCustomPackageOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isBibleCanonOpen, setIsBibleCanonOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'interactive' | 'audit' | 'rawXml'>('interactive');

  // Batch query state
  const [batchItems, setBatchItems] = useState<BatchQueryItem[]>([]);
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  // Loading & Engine Output
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [engineResponse, setEngineResponse] = useState<ParsedEngineResponse | null>(null);

  const activePackage =
    packages.find((p) => p.id === selectedPackageId) || PRESET_CONTEXT_PACKAGES[0];

  // Initial demonstration response for instant inspection
  useEffect(() => {
    const initialXml = `<response>
  <reasoning_breadcrumbs>
    <step order="1" source_id="ROM-05-10-V" label="起點經節：藉神兒子之死得與神和好，在祂生命裡得救" />
    <step order="2" source_id="ROM-05-10-N2" label="註解界定：客觀稱義與主觀天天在神聖生命裡得救之兩面救恩" />
    <step order="3" source_id="ECO-006" label="經綸深化：神聖生命的內在分賜與生命性情一模一樣的終極心意" />
  </reasoning_breadcrumbs>
  <content>
    <claim id="c1" source_id="ROM-05-10-V" type="verse" confidence="high">羅馬書五章十節宣告，信徒作仇敵的時候，且藉著神兒子的死得與神和好，既已和好，就更要在祂的生命裡得救了。</claim>
    <claim id="c2" source_id="ROM-05-10-N2" type="footnote" confidence="high">羅馬書五章十節註二指明，神完整的救恩有兩部分：一部分是基督的死為我們成就的客觀救恩，叫我們得著稱義並與神和好；另一部分是基督的生命要在我們裡面作的主觀救恩，叫我們天天在祂的神聖生命裡得救，脫離罪的權勢，並在生命中作王。</claim>
    <claim id="c3" source_id="ECO-006" type="lifestudy" confidence="high">《神的經綸》第六章指出，基督藉著死救贖了我們，但神的終極心意乃是要藉著祂那神聖、終極完成的靈，將祂神聖的生命分賜到我們三部分的人裡，使我們在生命和性情上與祂一模一樣。</claim>
    <claim id="c4" source_id="ROM-05-10-N2" type="footnote" confidence="synthesis">綜合檢索語料之教義脈絡，客觀的法理救贖平息了神的公義要求並解決罪的定罪，而主觀的生機拯救則是神的終極心意，藉著三一神神聖生命向信徒三部分人的不斷分賜，使信徒不僅脫離罪的權勢，更在生命中作王，至終與祂完全一致。</claim>
  </content>
  <knowledge_boundary>
    <status>sufficient</status>
    <uncovered_aspects>無。當前語境充分支持神完整救恩的客觀法理面與主觀生機面之區分，以及《神的經綸》中將生命分賜到三部分人裡的終極目的。</uncovered_aspects>
  </knowledge_boundary>
</response>`;

    setEngineResponse(parseEngineResponse(initialXml));
  }, []);

  // Execute Theological Query
  const handleExecuteQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setActiveClaimId(null);
    setActiveSourceId(null);

    setLoadingStage('正在提取檢索增強模組之階層語境包...');
    await new Promise((r) => setTimeout(r, 200));

    try {
      setLoadingStage('正在依據零幻覺契約校驗微斷言與字面溯源...');

      const response = await fetch('/api/theology/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          contextPackage: activePackage,
          strictness,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '神學推論引擎調用失敗');
      }

      setLoadingStage('正在結構化解析原子微斷言 XML 與置信度標註...');
      const data = await response.json();
      const parsed = parseEngineResponse(data.rawXml);
      setEngineResponse(parsed);
      setActiveTab('interactive');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '查詢處理時發生異常');
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  // Batch Query Runner
  const handleBatchRun = async (queries: string[]) => {
    setIsBatchRunning(true);
    const initialItems: BatchQueryItem[] = queries.map((q, idx) => ({
      id: `batch-${Date.now()}-${idx}`,
      query: q,
      status: 'idle',
    }));
    setBatchItems(initialItems);

    for (let i = 0; i < initialItems.length; i++) {
      const current = initialItems[i];
      setBatchItems((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: 'running' } : item))
      );

      try {
        const response = await fetch('/api/theology/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: current.query,
            contextPackage: activePackage,
            strictness,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || '神學推論引擎調用失敗');
        }

        const data = await response.json();
        const parsed = parseEngineResponse(data.rawXml);

        setBatchItems((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: 'success', response: parsed } : item
          )
        );
      } catch (err: any) {
        setBatchItems((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: 'error', error: err?.message || '推論失敗' } : item
          )
        );
      }
    }
    setIsBatchRunning(false);
  };

  // Bi-directional selection handlers
  const handleSelectClaim = (claimId: string, sourceId: string) => {
    setActiveClaimId(claimId);
    setActiveSourceId(sourceId);
  };

  const handleSelectSource = (sourceId: string) => {
    setActiveSourceId(sourceId);
    // Find matching claim if any
    if (engineResponse) {
      const match = engineResponse.claims.find((c) => c.source_id === sourceId);
      if (match) {
        setActiveClaimId(match.id);
      }
    }
  };

  const handleSaveCustomPackage = (updated: ContextPackage) => {
    const existingIdx = packages.findIndex((p) => p.id === updated.id);
    if (existingIdx >= 0) {
      const updatedList = [...packages];
      updatedList[existingIdx] = updated;
      setPackages(updatedList);
    } else {
      setPackages([...packages, updated]);
    }
    setSelectedPackageId(updated.id);
  };

  const citedSourceIds = engineResponse ? engineResponse.claims.map((c) => c.source_id) : [];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-900/60 selection:text-amber-100">
      {/* Header */}
      <Header
        onOpenProtocol={() => setIsProtocolOpen(true)}
        onOpenBatchQuery={() => setIsBatchModalOpen(true)}
        onOpenBibleCanon={() => setIsBibleCanonOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        activePackageTitle={activePackage.title}
        sourceCount={activePackage.sources.length}
        batchCount={batchItems.length}
      />

      {/* Main Workbench Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Top Control Bar: Package Selector & Preset Inquiries */}
        <section className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
            {/* Package Selector */}
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 text-amber-400 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  選擇檢索增強語境包 (Active Context Package)
                </label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => {
                    setSelectedPackageId(e.target.value);
                    const selected = packages.find((p) => p.id === e.target.value);
                    if (selected && selected.sampleQuestions[0]) {
                      setQuery(selected.sampleQuestions[0]);
                    }
                  }}
                  className="w-full bg-stone-950 border border-stone-700/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-100 font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      [{pkg.category}] {pkg.title} ({pkg.sources.length} 語料)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Strictness Control */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs text-stone-400 font-mono">約束模式:</span>
              <div className="flex bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs">
                <button
                  type="button"
                  onClick={() => setStrictness('strict')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center space-x-1 ${
                    strictness === 'strict'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title="極致嚴格零幻覺模式（Temperature 0.2）"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>極致嚴格 (零幻覺)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStrictness('synthetic')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center space-x-1 ${
                    strictness === 'synthetic'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title="綜合研討模式（Temperature 0.4）"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>綜合研討</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sample Questions Pills */}
          <div className="mt-3.5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider flex items-center">
                <Search className="w-3 h-3 mr-1" />
                典型神學研討提問範例（點擊載入）：
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activePackage.sampleQuestions.map((sq, idx) => (
                <button
                  key={`sq-${idx}`}
                  onClick={() => setQuery(sq)}
                  className={`text-xs px-3 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    query === sq
                      ? 'bg-amber-950/80 border-amber-600/80 text-amber-200 shadow-sm'
                      : 'bg-stone-950/60 hover:bg-stone-800 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box and Execute Button */}
          <div className="mt-4 pt-4 border-t border-stone-800">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <textarea
                  rows={2}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="輸入針對當前語境包之神學教義、字義定義或查經疑難提問..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 resize-none font-serif leading-relaxed"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExecuteQuery}
                  disabled={isLoading || !query.trim()}
                  className="sm:w-44 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-3 text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>推論校驗中...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>執行單題推論</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(true)}
                  className="sm:w-44 bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-600/60 text-amber-200 font-semibold rounded-xl px-4 py-3 text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                  title="多題同時輸入或上傳，橫向比對各題的 <response> XML 報告"
                >
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>批次橫向比對</span>
                  {batchItems.length > 0 && (
                    <span className="ml-1 text-[11px] px-1.5 py-0.2 bg-amber-950 text-amber-300 rounded font-mono border border-amber-800">
                      {batchItems.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="p-6 bg-stone-900/90 border border-amber-900/40 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-amber-600/30 border-t-amber-500 animate-spin" />
              <BookOpen className="w-5 h-5 text-amber-400 absolute inset-0 m-auto" />
            </div>
            <div>
              <p className="text-sm font-serif font-bold text-amber-200">{loadingStage}</p>
              <p className="text-xs text-stone-400 font-sans mt-1">
                嚴格依據父文檔語境包進行語意原子化拆解與置信度評級...
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-xl flex items-center space-x-3 text-rose-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold">推論過程受阻：</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Two-Column Research Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Answer Stream & Research Tabs) */}
          <div className="lg:col-span-7 flex flex-col space-y-5">
            {/* View Mode Selector Tabs */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('interactive')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === 'interactive'
                      ? 'bg-stone-800 text-amber-300 border border-stone-700'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>雙向可視化渲染 (Interactive Grounding)</span>
                </button>

                <button
                  onClick={() => setActiveTab('audit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === 'audit'
                      ? 'bg-stone-800 text-amber-300 border border-stone-700'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>斷言審計總帳 (Audit Ledger)</span>
                </button>

                <button
                  onClick={() => setActiveTab('rawXml')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === 'rawXml'
                      ? 'bg-stone-800 text-amber-300 border border-stone-700'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>原始 XML 契約輸出</span>
                </button>
              </div>

              {engineResponse && (
                <span className="text-[10px] font-mono text-stone-500 hidden sm:inline">
                  {engineResponse.claims.length} 條微斷言 · 置信度細實/虛線標記
                </span>
              )}
            </div>

            {/* Tab 1: Interactive Grounding View */}
            {activeTab === 'interactive' && engineResponse && (
              <div className="space-y-5 animate-in fade-in">
                {/* 1. Reasoning Breadcrumbs Micro-Map */}
                <ReasoningBreadcrumbsView
                  breadcrumbs={engineResponse.breadcrumbs}
                  sources={activePackage.sources}
                  activeSourceId={activeSourceId}
                  onSelectSource={handleSelectSource}
                />

                {/* 2. Core Theological Answer with Claim Tags */}
                <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-md">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-amber-950 rounded text-amber-400 border border-amber-800/40">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider font-mono">
                        主核心解答 (Core Grounded Content)
                      </h3>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                      <span className="flex items-center text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
                        細實線: 高充分性
                      </span>
                      <span className="flex items-center text-amber-400">
                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-1" />
                        虛線: 綜合推論
                      </span>
                    </div>
                  </div>

                  {/* Render Claims Stream */}
                  <ClaimRenderer
                    claims={engineResponse.claims}
                    sources={activePackage.sources}
                    activeClaimId={activeClaimId}
                    activeSourceId={activeSourceId}
                    onSelectClaim={handleSelectClaim}
                  />
                </div>

                {/* 3. Knowledge Boundary Card */}
                <KnowledgeBoundaryCard boundary={engineResponse.knowledgeBoundary} />
              </div>
            )}

            {/* Tab 2: Claim Audit Ledger */}
            {activeTab === 'audit' && engineResponse && (
              <ClaimAuditLedger
                claims={engineResponse.claims}
                sources={activePackage.sources}
                knowledgeBoundary={engineResponse.knowledgeBoundary}
                rawXml={engineResponse.rawXml}
              />
            )}

            {/* Tab 3: Raw XML Contract Output */}
            {activeTab === 'rawXml' && engineResponse && (
              <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="text-xs font-mono font-bold text-amber-300">
                    符合契約之原生 XML 文本
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    標準 &lt;response&gt; 規範結構
                  </span>
                </div>
                <pre className="p-4 bg-stone-950 font-mono text-xs text-stone-200 rounded-xl border border-stone-800 overflow-x-auto whitespace-pre leading-relaxed">
                  {engineResponse.rawXml}
                </pre>
              </div>
            )}
          </div>

          {/* Right Column: Hierarchical Context Viewer (階層語境包) */}
          <div className="lg:col-span-5 sticky top-20 h-[calc(100vh-6rem)]">
            <ContextPackageViewer
              contextPackage={activePackage}
              activeSourceId={activeSourceId}
              activeClaimSourceId={activeSourceId}
              citedSourceIds={citedSourceIds}
              onSelectSource={handleSelectSource}
              onOpenCustomPackage={() => setIsCustomPackageOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Protocol / Specification Modal */}
      <ProtocolModal isOpen={isProtocolOpen} onClose={() => setIsProtocolOpen(false)} />

      {/* Custom Context Package Manager Modal */}
      <CustomPackageModal
        isOpen={isCustomPackageOpen}
        onClose={() => setIsCustomPackageOpen(false)}
        activePackage={activePackage}
        onSavePackage={handleSaveCustomPackage}
      />

      {/* Batch Query & Comparison Modal */}
      <BatchQueryModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        activePackage={activePackage}
        onBatchRun={handleBatchRun}
        batchItems={batchItems}
        isBatchRunning={isBatchRunning}
        onClearBatch={() => setBatchItems([])}
        activeSourceId={activeSourceId}
        onSelectSource={handleSelectSource}
        onSelectClaimAcrossBatch={(_claimId, sId) => handleSelectSource(sId)}
      />

      {/* 66-Book Whole Bible Canon Browser Modal */}
      <BibleCanonBrowserModal
        isOpen={isBibleCanonOpen}
        onClose={() => setIsBibleCanonOpen(false)}
        activeSources={activePackage.sources}
        onSelectBookChunk={(book) => {
          setIsBibleCanonOpen(false);
        }}
      />

      {/* GitHub Backup & Sync Modal */}
      <GitHubBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
    </div>
  );
}
