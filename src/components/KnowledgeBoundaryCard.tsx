import React from 'react';
import { KnowledgeBoundary } from '../types/theology';
import { ShieldCheck, AlertCircle, AlertOctagon, HelpCircle } from 'lucide-react';

interface KnowledgeBoundaryCardProps {
  boundary: KnowledgeBoundary;
}

export const KnowledgeBoundaryCard: React.FC<KnowledgeBoundaryCardProps> = ({ boundary }) => {
  const isSufficient = boundary.status === 'sufficient';
  const isPartial = boundary.status === 'partial';
  const isInsufficient = boundary.status === 'insufficient';

  const getStatusConfig = () => {
    if (isSufficient) {
      return {
        badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60',
        title: '檢索語料充分 (Sufficient Support)',
        icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
        borderColor: 'border-emerald-900/60',
        cardBg: 'bg-emerald-950/15',
        desc: '輸入的階層語境包足以完全支持問題之核心教義與字義界定。未發生未授權之參數臆測。',
      };
    }
    if (isPartial) {
      return {
        badgeBg: 'bg-amber-950/90 text-amber-300 border-amber-600/60',
        title: '檢索語料部分充分 (Partial Support)',
        icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
        borderColor: 'border-amber-900/60',
        cardBg: 'bg-amber-950/20',
        desc: '語料涵蓋問題之部分層面，但在深層神學關聯或未載章節上存在邊界，已誠實揭露。',
      };
    }
    return {
      badgeBg: 'bg-rose-950/90 text-rose-300 border-rose-600/60',
      title: '檢索語料邊界不足 (Insufficient Support)',
      icon: <AlertOctagon className="w-5 h-5 text-rose-400" />,
      borderColor: 'border-rose-900/60',
      cardBg: 'bg-rose-950/20',
      desc: '當前注入的語境包無法支持提問之核心教義。觸發零臆測原則，模型嚴禁憑空捏造。',
    };
  };

  const config = getStatusConfig();

  return (
    <div
      className={`rounded-xl border ${config.borderColor} ${config.cardBg} p-4 mt-5 transition-all shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-stone-900/90 border border-stone-800">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider font-mono">
                知識邊界與未涵蓋範疇 (Knowledge Boundary)
              </h3>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border uppercase ${config.badgeBg}`}
              >
                {boundary.status}
              </span>
            </div>
            <p className="text-xs text-stone-300 font-medium mt-0.5">{config.title}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-stone-400 leading-relaxed mb-3">{config.desc}</p>

      {/* Uncovered Aspects */}
      <div className="p-3 bg-stone-950/70 rounded-lg border border-stone-800/80">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
          顯式揭露之未涵蓋範疇 (Uncovered Aspects):
        </span>
        <p className="text-xs text-stone-300 font-sans leading-relaxed">
          {boundary.uncovered_aspects || '無。'}
        </p>
      </div>
    </div>
  );
};
