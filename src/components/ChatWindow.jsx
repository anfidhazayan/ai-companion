import React, { useEffect, useRef } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import { Bot, Brain, FileText, AlertCircle, RefreshCw } from 'lucide-react';

export default function ChatWindow({
  messages,
  onSendMessage,
  isGenerating,
  loadingText,
  activePdf,
  error
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/40 flex-1 overflow-hidden">
      {/* Messages / Welcome viewport */}
      <div className="flex-1 overflow-y-auto px-4">
        {messages.length === 0 ? (
          /* Landing Screen */
          <div className="max-w-2xl mx-auto pt-16 pb-8 text-center space-y-8 select-none">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500 text-white shadow-xl shadow-brand-500/20">
                <Bot className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                AI Learning Companion
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                An intelligent study assistant fueled by FAISS vector search, document chunking, and Gemini. 
              </p>
            </div>

            {/* Feature Highlights cards */}
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl space-y-2.5 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-500">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">1. Upload a PDF</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Provide any PDF study material. The companion chunks and indexes it into FAISS to construct local vector knowledge.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl space-y-2.5 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
                  <Brain className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">2. Teach Facts</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Type <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded">remember [fact]</span> to save facts in long-term memory.
                </p>
              </div>
            </div>

            {/* Hint Banner */}
            {!activePdf && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 max-w-md mx-auto">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">Upload a PDF in the sidebar to activate RAG Q&A</span>
              </div>
            )}
          </div>
        ) : (
          /* List of messages */
          <div className="space-y-2 py-6">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}

            {/* AI Generation State */}
            {isGenerating && (
              <div className="flex items-start space-x-4 max-w-4xl mx-auto py-5 px-6 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 animate-pulse">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 bg-brand-500 text-white shadow-sm border border-brand-600">
                  <Bot className="w-5 h-5 animate-spin" />
                </div>
                <div className="flex-1 space-y-2.5 pt-1">
                  <div className="flex items-center space-x-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    <span>Companion is thinking</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>{loadingText || "Processing..."}</span>
                    </span>
                  </div>
                  <div className="space-y-2 max-w-[85%] text-left">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div ref={bottomRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="px-6 py-2 bg-rose-500/10 border-t border-b border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input panel area */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <ChatInput 
          onSendMessage={onSendMessage} 
          disabled={isGenerating} 
          loadingText={loadingText} 
        />
        <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2.5 select-none font-medium">
          FastAPI Backend API: <span className="underline">http://localhost:8000</span> | Gemini models are utilized for text synthesis.
        </div>
      </div>
    </div>
  );
}
