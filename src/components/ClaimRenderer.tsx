import React, { useState } from 'react';
import { Claim, SourceChunk, SourceType } from '../types/theology';
import { CheckCircle2, AlertTriangle, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';

interface ClaimRendererProps {
  claims: Claim[];
  sources: SourceChunk[];
  activeClaimId: string | null;
  activeSourceId: string | null;
  onSelectClaim: (claimId: string, sourceId: string) => void;
}

export const ClaimRenderer: React.FC<ClaimRendererProps> = ({
  claims,
  sources,
  activeClaimId,
  activeSourceId,
  onSelectClaim,
}) => {
  const [hoveredClaimId, setHoveredClaimId] = useState<string | null>(null);

  if (!claims || claims.length === 0) {
    return (
      <div className="p-4 text-center text-stone-500 font-sans text-xs">
        暫無解析出的斷言標籤
      </div>
    );
  }

  const getSourceTypeBadge = (type: SourceType) => {
    switch (type) {
      case 'verse':
        return { label: '經文 Verse', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' };
      case 'footnote':
        return { label: '註解 Footnote', bg: 'bg-sky-950/80 text-sky-300 border-sky-700/60' };
      case 'outline':
        return { label: '綱目 Outline', bg: 'bg-purple-950/80 text-purple-300 border-purple-700/60' };
      case 'lifestudy':
        return { label: '生命讀經 Life-Study', bg: 'bg-amber-950/80 text-amber-300 border-amber-700/60' };
      default:
        return { label: '職事語料 Ministry', bg: 'bg-stone-800 text-stone-300 border-stone-700' };
    }
  };

  return (
    <div className="space-y-4 leading-relaxed font-serif text-stone-200">
      {claims.map((claim, idx) => {
        const matchedSource = sources.find((s) => s.id === claim.source_id);
        const isHighConfidence = claim.confidence === 'high';
        const isActive = activeClaimId === claim.id || activeSourceId === claim.source_id;
        const isHovered = hoveredClaimId === claim.id;
        const typeBadge = getSourceTypeBadge(claim.type);

        return (
          <div
            key={claim.id || `claim-${idx}`}
            onMouseEnter={() => setHoveredClaimId(claim.id)}
            onMouseLeave={() => setHoveredClaimId(null)}
            onClick={() => onSelectClaim(claim.id, claim.source_id)}
            className={`group relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/50'
                : isHighConfidence
                ? 'bg-stone-900/60 hover:bg-stone-900/90 border-stone-800 hover:border-stone-700'
                : 'bg-amber-950/15 hover:bg-amber-950/30 border-amber-900/40 hover:border-amber-700/60'
            }`}
          >
            {/* Claim Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-sans text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-amber-400 bg-stone-950/80 px-2 py-0.5 rounded border border-stone-800">
                  #{claim.id}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border ${typeBadge.bg}`}
                >
                  {typeBadge.label}
                </span>

                <span className="font-mono text-[11px] text-stone-300 bg-stone-800/80 px-2 py-0.5 rounded border border-stone-700/60">
                  {claim.source_id}
                </span>

                {matchedSource && (
                  <span className="text-stone-400 text-xs hidden sm:inline truncate max-w-[200px]">
                    {matchedSource.reference || matchedSource.title}
                  </span>
                )}
              </div>

              {/* Confidence Rating Badge */}
              <div className="flex items-center">
                {isHighConfidence ? (
                  <span
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/70 border border-emerald-600/50 text-emerald-300"
                    title="高充分性支持：語境中有直接、完整的字面敘述支撐"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>高充分性支持 [High]</span>
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/90 border border-amber-500/80 text-amber-300 animate-pulse"
                    title="綜合推論：結合多處經文或註解的邏輯串接所得結論，語境中無完全對等的單一字面"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>綜合推論 [Synthesis]</span>
                  </span>
                )}
              </div>
            </div>

            {/* Claim Body Text with Strict Underline Contract */}
            <div className="relative">
              <p
                className={`text-base sm:text-[17px] tracking-wide leading-relaxed font-serif ${
                  isHighConfidence
                    ? 'border-b border-amber-400/60 text-stone-100'
                    : 'border-b-2 border-dashed border-amber-500/80 text-amber-100/90'
                }`}
              >
                {claim.text}
              </p>
            </div>

            {/* Synthesis Warning Notice if confidence is synthesis */}
            {!isHighConfidence && (
              <div className="mt-2.5 p-2 bg-amber-950/40 rounded-lg border border-amber-800/40 flex items-start space-x-2 text-xs font-sans text-amber-200/90">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300 mr-1">
                    [綜合推論警示]
                  </span>
                  此斷言係跨經節或跨註解之綜合邏輯推導，語境中無完全對等之單一字面陳述。請點擊比對右側原生階層語境。
                </div>
              </div>
            )}

            {/* Quick Trace Hover Preview */}
            {(isHovered || isActive) && matchedSource && (
              <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-xs font-sans text-stone-400">
                <div className="flex items-center space-x-1.5 truncate max-w-[85%]">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-stone-300 font-medium truncate">
                    溯源原生語料：{matchedSource.title}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-amber-400 font-medium text-[11px] shrink-0">
                  <span>點擊右側定位</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
