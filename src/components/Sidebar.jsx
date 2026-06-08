import React from 'react';
import { Plus, Settings, MessageSquare, BookOpen, FileText, Database } from 'lucide-react';
import UploadPanel from './UploadPanel';

export default function Sidebar({
  activePdf,
  onUploadStart,
  onUploadSuccess,
  onNewChat,
  onOpenSettings,
  chatHistory = [],
  onSelectHistoryItem,
  activeChatId
}) {
  return (
    <aside className="flex flex-col h-full w-80 bg-slate-900 text-slate-100 border-r border-slate-800 flex-shrink-0 select-none">
      {/* Title / Logo */}
      <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-800">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500 shadow-lg shadow-brand-500/30">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-black tracking-wider text-white uppercase">Learning Companion</h2>
          <span className="text-[10px] font-semibold text-slate-400">FAISS + Gemini RAG</span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="p-4 space-y-4">
        <button
          type="button"
          onClick={onNewChat}
          className="flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-98 font-bold text-sm text-white transition-all duration-200 shadow-lg shadow-brand-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Session</span>
        </button>

        {/* Upload Panel */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-1">
            Knowledge Upload
          </label>
          <UploadPanel onUploadStart={onUploadStart} onUploadSuccess={onUploadSuccess} />
        </div>

        {/* Knowledge Indicator */}
        {activePdf ? (
          <div className="bg-slate-800/40 border border-slate-850 rounded-xl p-3.5 space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-emerald-400 animate-pulse-slow" />
                <span className="text-xs font-bold text-white">RAG Active</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate max-w-[170px]" title={activePdf.name}>
                  {activePdf.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 pl-5">
                <span>Chunks Indexed</span>
                <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {activePdf.chunks}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/10 border border-dashed border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] font-medium text-slate-500">
              No PDF uploaded. General intelligence model active.
            </span>
          </div>
        )}
      </div>

      {/* Chat History List (UI only as requested) */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-1 block mb-1">
          Recent Sessions
        </label>
        {chatHistory.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquare className="w-6 h-6 mx-auto text-slate-800 mb-1.5" />
            <p className="text-[11px] text-slate-500 italic font-medium">No previous chats</p>
          </div>
        ) : (
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => onSelectHistoryItem(chat.id)}
                className={`flex items-center space-x-2.5 w-full px-3 py-2.5 rounded-lg text-left text-xs font-semibold transition ${
                  activeChatId === chat.id
                    ? 'bg-slate-800 text-white border-l-2 border-brand-500'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-slate-850">
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center space-x-2.5 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>App Settings</span>
        </button>
      </div>
    </aside>
  );
}
