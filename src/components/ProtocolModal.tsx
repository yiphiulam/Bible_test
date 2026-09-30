import React from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, FileCode, Check } from 'lucide-react';

interface ProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProtocolModal: React.FC<ProtocolModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-stone-900 border border-stone-700/80 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col text-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-amber-950/80 border border-amber-600/40 rounded-lg text-amber-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-stone-100">
                神學問答引導引擎 · 核心規範與渲染契約
              </h3>
              <p className="text-xs text-stone-400">
                嚴格約束原則、微斷言標註、雙向溯源與 XML 輸出結構規範
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* 1. Core Principles */}
          <section className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-1.5" />
              三大核心約束原則（防幻覺與信任校準）
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-stone-950/60 rounded-lg border border-stone-800">
                <span className="text-xs font-semibold text-stone-200 block mb-1">
                  1. 嚴格基於給定語境
                </span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  所有教義闡釋、字義界定與經節引證，必須嚴格源自輸入的「階層語境包」。嚴禁依賴參數記憶進行無憑據外推。
                </p>
              </div>
              <div className="p-3 bg-stone-950/60 rounded-lg border border-stone-800">
                <span className="text-xs font-semibold text-stone-200 block mb-1">
                  2. 零臆測原則
                </span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  若檢索語境無法完全支持提問的核心教義，模型必須誠實聲明資料邊界（insufficient / partial），禁止拼湊答案。
                </p>
              </div>
              <div className="p-3 bg-stone-950/60 rounded-lg border border-stone-800">
                <span className="text-xs font-semibold text-stone-200 block mb-1">
                  3. 語意原子化標註
                </span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  所有生成敘述均須拆解為微斷言（Claim-level），強制嵌入結構化 <code className="text-amber-300">&lt;claim&gt;</code> 標籤。
                </p>
              </div>
            </div>
          </section>

          {/* 2. Confidence and Tag Specs */}
          <section className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              斷言標籤屬性與置信度前端渲染契約
            </h4>
            <div className="bg-stone-950/70 p-4 rounded-lg border border-stone-800 space-y-3 font-mono text-xs">
              <div className="text-stone-300">
                &lt;claim <span className="text-amber-300">id</span>="c1" <span className="text-emerald-300">source_id</span>="ROM-05-10-N2" <span className="text-cyan-300">type</span>="footnote" <span className="text-orange-300">confidence</span>="high"&gt;...&lt;/claim&gt;
              </div>
              <div className="pt-2 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                <div className="p-2.5 rounded bg-stone-900 border border-stone-700/60">
                  <div className="flex items-center space-x-1.5 text-stone-200 font-semibold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>confidence="high"（高充分性支持）</span>
                  </div>
                  <p className="text-stone-400 text-[11px] leading-relaxed">
                    語境中有直接、完整的字面敘述支撐。前端渲染<strong className="text-stone-200">細實線底線</strong>與金色高亮，並標註具體出處註解/經節。
                  </p>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-amber-900/40">
                  <div className="flex items-center space-x-1.5 text-amber-300 font-semibold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>confidence="synthesis"（綜合推論）</span>
                  </div>
                  <p className="text-stone-400 text-[11px] leading-relaxed">
                    結合多處經文或註解的邏輯串接所得結論，語境中無完全對等的單一字面。前端渲染<strong className="text-amber-300">琥珀色虛線</strong>與醒目警示符號。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Output Schema */}
          <section className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              嚴格 XML 輸出架構契約
            </h4>
            <pre className="p-3.5 bg-stone-950 font-mono text-xs text-stone-300 rounded-lg border border-stone-800 overflow-x-auto leading-relaxed">
{`<response>
  <!-- 1. 推理鏈微地圖：跨卷或多步推論時必填，展示從起點經節/註解至終點教義的節點流向 -->
  <reasoning_breadcrumbs>
    <step order="1" source_id="語料ID" label="簡要節點標題" />
    <step order="2" source_id="語料ID" label="簡要節點標題" />
  </reasoning_breadcrumbs>

  <!-- 2. 主核心解答：包含斷言級錨定標籤的完整敘述 -->
  <content>
    <claim id="c1" source_id="ROM-05-10-N2" type="footnote" confidence="high">
      在神完整的救恩裡，『得救』包含藉著基督的死得與神和好，以及在祂的生命裡得救。
    </claim>
  </content>

  <!-- 3. 知識邊界與未涵蓋範疇：若語境不足，顯式揭露盲區；若完全充分則填寫無 -->
  <knowledge_boundary>
    <status>sufficient | partial | insufficient</status>
    <uncovered_aspects>指出檢索語料未提及但問題涉及的教義或章節；若無則填寫無。</uncovered_aspects>
  </knowledge_boundary>
</response>`}
            </pre>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors cursor-pointer"
          >
            了解並關閉
          </button>
        </div>
      </div>
    </div>
  );
};
