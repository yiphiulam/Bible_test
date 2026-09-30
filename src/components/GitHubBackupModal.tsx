import React, { useState } from 'react';
import { Download, GitBranch, Github, Check, Copy, ExternalLink, X, Terminal, ShieldCheck } from 'lucide-react';

interface GitHubBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubBackupModal: React.FC<GitHubBackupModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const repoUrl = 'https://github.com/yiphiulam/Bible_GoogleAI.git';

  const terminalCommands = `# 1. 下載並解壓縮本專案完整原始碼包
tar -xzf Bible_GoogleAI_backup.tar.gz
cd Bible_GoogleAI

# 2. 推送至您的 GitHub 儲存庫
git remote add origin ${repoUrl}
git branch -M main
git push -u origin main`;

  const handleCopy = () => {
    navigator.clipboard.writeText(terminalCommands);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleDirectPushWithPAT = async () => {
    if (!tokenInput.trim()) {
      alert('請先貼入具備 repo 寫入權限的 GitHub Personal Access Token (PAT)');
      return;
    }

    setIsPushing(true);
    setPushStatus('正在連接 GitHub 遠端儲存庫並推播程式碼...');

    try {
      const response = await fetch('/api/backup/push-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '推送失敗');
      }

      setPushStatus('推播成功！專案已成功備份至 yiphiulam/Bible_GoogleAI (main 分支)。');
    } catch (err: any) {
      setPushStatus(`推播受阻：${err.message || '請確認 Token 權限'}`);
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col text-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-950/80 border border-amber-600/40 rounded-xl text-amber-400">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-stone-100 flex items-center space-x-2">
                <span>備份與同步至 GitHub</span>
              </h3>
              <p className="text-xs text-stone-400">
                目標儲存庫：<code className="text-amber-300">yiphiulam/Bible_GoogleAI</code>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Status summary */}
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>本地代碼倉庫已就緒（包含 66 卷正典語料庫與批次比對引擎）</span>
            </div>
            <p className="text-stone-400 leading-relaxed font-sans">
              本專案已完成初始 Commit（27 個核心代碼文件、整本聖經神聖經綸索引庫、微斷言 XML 引導引擎與批次總表），並已封裝成乾淨且不含 <code>node_modules</code> 的備份檔案包。
            </p>
          </div>

          {/* Option A: Direct Push via Token */}
          <div className="p-4 bg-stone-950/70 rounded-xl border border-amber-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-300 flex items-center space-x-1.5">
                <GitBranch className="w-4 h-4" />
                <span>方案一：直接在線推播（輸入 GitHub Personal Access Token）</span>
              </h4>
            </div>
            <p className="text-stone-400 leading-relaxed">
              GitHub 遠端儲存庫需要身分認證。若您在 GitHub 具備 <strong>Personal Access Token (classic / fine-grained, 勾選 repo 權限)</strong>，可貼入下方，系統將直接在後台執行 <code>git push -u origin main</code>。
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                placeholder="貼入 GitHub Personal Access Token (ghp_...)"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-mono"
              />
              <button
                onClick={handleDirectPushWithPAT}
                disabled={isPushing || !tokenInput.trim()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center space-x-1.5"
              >
                <span>{isPushing ? '推播中...' : '推播至 main 分支'}</span>
              </button>
            </div>

            {pushStatus && (
              <div
                className={`p-3 rounded-lg border text-xs leading-relaxed font-mono ${
                  pushStatus.includes('成功')
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-stone-900 border-amber-800/60 text-amber-200'
                }`}
              >
                {pushStatus}
              </div>
            )}
          </div>

          {/* Option B: Download Archive & Local Push */}
          <div className="p-4 bg-stone-950/70 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-200 flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>方案二：一鍵下載原始碼壓縮檔並本地推播</span>
              </h4>
              <a
                href="/api/backup/download"
                download="Bible_GoogleAI_backup.tar.gz"
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-amber-600/40 text-amber-300 font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下載完整原始碼 (.tar.gz)</span>
              </a>
            </div>

            <p className="text-stone-400 leading-relaxed">
              您也可以點選上方按鈕直接下載純淨完整原始碼包（82 KB，含所有經綸索引庫與元件），並在您本地終端機貼入以下指令：
            </p>

            <div className="relative">
              <pre className="p-3 bg-stone-950 font-mono text-[11px] text-amber-200/90 rounded-lg border border-stone-800 overflow-x-auto leading-relaxed">
                {terminalCommands}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] rounded transition-colors flex items-center space-x-1 cursor-pointer"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? '已複製' : '複製指令'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/80 flex justify-between items-center text-xs">
          <a
            href="https://github.com/yiphiulam/Bible_GoogleAI"
            target="_blank"
            rel="noreferrer"
            className="text-stone-400 hover:text-amber-300 flex items-center space-x-1 transition-colors"
          >
            <span>檢視 GitHub 遠端儲存庫</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
