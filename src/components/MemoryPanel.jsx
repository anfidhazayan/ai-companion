import React from 'react';
import { Brain, Sparkles, HelpCircle, RefreshCw } from 'lucide-react';

export default function MemoryPanel({ facts = [], isLoading, onRefresh }) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-80 overflow-hidden select-none">
      {/* Title Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-brand-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Companion Memory</h3>
        </div>
        <div className="flex items-center space-x-2">
          {/* Status Indicator */}
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
          <button 
            type="button"
            onClick={onRefresh}
            title="Refresh memory"
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition ml-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main content body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Helper Note */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-500 dark:text-slate-400 space-y-1.5 leading-relaxed">
          <div className="flex items-center space-x-1.5 text-brand-500 dark:text-brand-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>How it works</span>
          </div>
          <p>
            The assistant remembers information across conversations. To teach the companion something new, type:
          </p>
          <div className="bg-slate-100 dark:bg-slate-950 p-2 rounded-lg font-mono text-[10px] text-slate-700 dark:text-slate-355 mt-1.5 border border-slate-200 dark:border-slate-800">
            remember [your fact]
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
            Example: "remember my name is Anfidha Zayan"
          </p>
        </div>

        {/* Facts List */}
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-1">
            Saved Facts ({facts.length})
          </h4>
          
          {facts.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <HelpCircle className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-750 mb-2" />
              <p className="text-xs text-slate-400 dark:text-slate-500">
                No facts stored in memory yet. Tell the companion something to remember!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {facts.map((fact, i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300 shadow-sm transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-brand-500 mt-0.5">•</span>
                    <span className="break-words leading-relaxed">{fact}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
