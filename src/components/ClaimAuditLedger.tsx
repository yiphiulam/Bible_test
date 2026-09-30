import React from 'react';
import { Claim, SourceChunk, KnowledgeBoundary } from '../types/theology';
import { CheckCircle, AlertTriangle, ShieldCheck, XCircle, Copy, Check } from 'lucide-react';

interface ClaimAuditLedgerProps {
  claims: Claim[];
  sources: SourceChunk[];
  knowledgeBoundary: KnowledgeBoundary;
  rawXml: string;
}

export const ClaimAuditLedger: React.FC<ClaimAuditLedgerProps> = ({
  claims,
  sources,
  knowledgeBoundary,
  rawXml,
}) => {
  const [copied, setCopied] = React.useState(false);

  const sourceIdMap = new Map(sources.map((s) => [s.id, s]));

  const highCount = claims.filter((c) => c.confidence === 'high').length;
  const synthesisCount = claims.filter((c) => c.confidence === 'synthesis').length;
  const verifiedCount = claims.filter((c) => sourceIdMap.has(c.source_id)).length;
  const ungroundedCount = claims.length - verifiedCount;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800">
          <span className="text-[10px] text-stone-400 font-mono uppercase block">總斷言數</span>
          <span className="text-xl font-bold font-mono text-stone-100">{claims.length}</span>
          <span className="text-[10px] text-stone-500 block mt-0.5">Claim-level 標註</span>
        </div>

        <div className="p-3 bg-stone-900/80 rounded-xl border border-emerald-950">
          <span className="text-[10px] text-emerald-400 font-mono uppercase block">高充分性支持</span>
          <span className="text-xl font-bold font-mono text-emerald-300">{highCount}</span>
          <span className="text-[10px] text-emerald-500/70 block mt-0.5">字面直接支撐</span>
        </div>

        <div className="p-3 bg-stone-900/80 rounded-xl border border-amber-950">
          <span className="text-[10px] text-amber-400 font-mono uppercase block">綜合推論</span>
          <span className="text-xl font-bold font-mono text-amber-300">{synthesisCount}</span>
          <span className="text-[10px] text-amber-500/70 block mt-0.5">跨節邏輯串接</span>
        </div>

        <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800">
          <span className="text-[10px] text-stone-400 font-mono uppercase block">語境溯源校驗</span>
          <span
            className={`text-xl font-bold font-mono ${
              ungroundedCount === 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {ungroundedCount === 0 ? '100% 覆蓋' : `${ungroundedCount} 條孤立`}
          </span>
          <span className="text-[10px] text-stone-500 block mt-0.5">零幻覺校驗</span>
        </div>
      </div>

      {/* Claim Audit Table */}
      <div className="bg-stone-900/90 rounded-xl border border-stone-800 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              微斷言審計總帳 (Claim-level Audit Ledger)
            </h4>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '已複製 XML' : '複製 XML'}</span>
          </button>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/80 text-stone-400 uppercase font-mono text-[10px] sticky top-0 border-b border-stone-800">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">語料 ID (Source ID)</th>
                <th className="px-3 py-2">類型</th>
                <th className="px-3 py-2">置信度</th>
                <th className="px-3 py-2">溯源校驗</th>
                <th className="px-3 py-2">斷言文本精要</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-sans">
              {claims.map((claim) => {
                const source = sourceIdMap.get(claim.source_id);
                const isVerified = !!source;
                const isHigh = claim.confidence === 'high';

                return (
                  <tr key={claim.id} className="hover:bg-stone-800/40">
                    <td className="px-3 py-2.5 font-mono font-bold text-amber-400">
                      {claim.id}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-stone-300">
                      {claim.source_id}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-800 text-stone-300 uppercase">
                        {claim.type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {isHigh ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                          high (實線)
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800">
                          synthesis (虛線)
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {isVerified ? (
                        <span className="inline-flex items-center text-emerald-400 text-[11px]">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          已在語境錨定
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-400 text-[11px]">
                          <XCircle className="w-3 h-3 mr-1" />
                          未在語境找到
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-stone-300 max-w-xs truncate" title={claim.text}>
                      {claim.text}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
