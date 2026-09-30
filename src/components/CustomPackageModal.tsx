import React, { useState } from 'react';
import { ContextPackage, SourceChunk, SourceType } from '../types/theology';
import { X, Plus, Trash2, Check, FileText, Layers } from 'lucide-react';

interface CustomPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePackage: ContextPackage;
  onSavePackage: (updatedPackage: ContextPackage) => void;
}

export const CustomPackageModal: React.FC<CustomPackageModalProps> = ({
  isOpen,
  onClose,
  activePackage,
  onSavePackage,
}) => {
  const [title, setTitle] = useState(activePackage.title);
  const [description, setDescription] = useState(activePackage.description);
  const [sources, setSources] = useState<SourceChunk[]>([...activePackage.sources]);

  // Form for adding new source
  const [newId, setNewId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newParentContext, setNewParentContext] = useState('');
  const [newType, setNewType] = useState<SourceType>('footnote');
  const [newReference, setNewReference] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('李常受 / 恢復本註解');

  if (!isOpen) return null;

  const handleAddSource = () => {
    if (!newId.trim() || !newContent.trim() || !newTitle.trim()) {
      alert('請填寫語料 ID、標題與正文內容');
      return;
    }

    const chunk: SourceChunk = {
      id: newId.trim().toUpperCase(),
      title: newTitle.trim(),
      parentContext: newParentContext.trim() || '自定義父文檔語境',
      type: newType,
      reference: newReference.trim() || newId.trim(),
      content: newContent.trim(),
      author: newAuthor.trim(),
    };

    setSources([...sources, chunk]);

    // Reset inputs
    setNewId('');
    setNewTitle('');
    setNewReference('');
    setNewContent('');
  };

  const handleDeleteSource = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    const updated: ContextPackage = {
      ...activePackage,
      title,
      description,
      sources,
    };
    onSavePackage(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-stone-900 border border-stone-700/80 rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col text-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-amber-950 rounded-lg border border-amber-600/40 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-stone-100">
                階層語境包管理與自定義注入 (Hierarchical RAG Context Injector)
              </h3>
              <p className="text-xs text-stone-400">
                可新增、修改或移除輸入語境切片，用以測試零臆測邊界與微斷言溯源能力
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Package Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 font-medium mb-1">語境包名稱</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-stone-400 font-medium mb-1">描述說明</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Add New Source Section */}
          <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center">
              <Plus className="w-3.5 h-3.5 mr-1" />
              注入新語料切片 (Add Context Chunk)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-400 text-[11px] mb-1">
                  語料唯一識別碼 (Source ID, 如 ROM-08-02-V)
                </label>
                <input
                  type="text"
                  placeholder="如: ROM-08-02-V"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-stone-900 border border-stone-800 rounded text-stone-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-400 text-[11px] mb-1">語料類型</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as SourceType)}
                  className="w-full px-2.5 py-1.5 bg-stone-900 border border-stone-800 rounded text-stone-200"
                >
                  <option value="footnote">footnote (註解)</option>
                  <option value="verse">verse (經文)</option>
                  <option value="outline">outline (綱目)</option>
                  <option value="lifestudy">lifestudy (生命讀經)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 text-[11px] mb-1">章節經緯 / 簡稱</label>
                <input
                  type="text"
                  placeholder="如: 羅八 2 註 1"
                  value={newReference}
                  onChange={(e) => setNewReference(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-stone-900 border border-stone-800 rounded text-stone-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 text-[11px] mb-1">標題</label>
                <input
                  type="text"
                  placeholder="如: 羅馬書八章二節註釋（生命之靈的律）"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-stone-900 border border-stone-800 rounded text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-400 text-[11px] mb-1">
                  父文檔階層語境 (Parent Document Context)
                </label>
                <input
                  type="text"
                  placeholder="如: 羅馬書八章（三一神在生命之靈裡分賜到三部分人裡）"
                  value={newParentContext}
                  onChange={(e) => setNewParentContext(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-stone-900 border border-stone-800 rounded text-stone-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 text-[11px] mb-1">
                語料全文內容 (Content - 嚴格依此為立論憑據)
              </label>
              <textarea
                rows={3}
                placeholder="貼入恢復本經文或職事信息正文..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded text-stone-200 focus:outline-none focus:border-amber-500 font-serif leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddSource}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>加入本語料切片</span>
              </button>
            </div>
          </div>

          {/* Current Sources List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              當前語境條目清單 ({sources.length} 條)
            </h4>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {sources.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-stone-950 rounded-lg border border-stone-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-amber-400">{s.id}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-800 text-stone-300 uppercase">
                        {s.type}
                      </span>
                      <span className="text-stone-300 font-semibold">{s.title}</span>
                    </div>
                    <p className="text-stone-400 text-[11px] line-clamp-2 font-serif">
                      {s.content}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteSource(s.id)}
                    className="p-1 text-stone-500 hover:text-rose-400 hover:bg-stone-900 rounded transition-colors cursor-pointer"
                    title="刪除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950/70 flex justify-between items-center">
          <span className="text-xs text-stone-400 font-sans">
            保存後將立即以新語境包作為推論約束依據
          </span>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>保存並啟用語境包</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
