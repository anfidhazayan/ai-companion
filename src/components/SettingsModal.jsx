import React, { useState, useEffect } from 'react';
import { X, Settings, Link, Info, Moon, Sun } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, backendUrl, onSaveBackendUrl, theme, onToggleTheme }) {
  const [urlInput, setUrlInput] = useState(backendUrl);

  useEffect(() => {
    setUrlInput(backendUrl);
  }, [backendUrl]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveBackendUrl(urlInput);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all duration-300 animate-fade-in animate-once"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-brand-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Settings</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Theme Selector */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Theme Mode</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => onToggleTheme('light')}
                className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-medium transition ${
                  theme === 'light'
                    ? 'bg-white text-brand-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleTheme('dark')}
                className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-medium transition ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-brand-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Backend URL Config */}
          <div className="space-y-2">
            <label className="flex items-center space-x-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Link className="w-4 h-4 text-brand-500" />
              <span>Backend API Server URL</span>
            </label>
            <input
              type="url"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="http://localhost:8000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              By default, this connects to the local FastAPI port 8000.
            </p>
          </div>

          {/* About Project */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 font-semibold mb-1">
              <Info className="w-4 h-4 text-brand-500" />
              <span>About AI Learning Companion</span>
            </div>
            <p>
              An intelligent learning application combining modern retrieval technologies:
            </p>
            <ul className="list-disc pl-4 space-y-1 mt-1 font-mono text-[10px]">
              <li>React + Tailwind CSS (Vite build system)</li>
              <li>FastAPI + Python Backend API</li>
              <li>Google Gemini generative AI integration</li>
              <li>SentenceTransformers for high-dimensional embeddings</li>
              <li>FAISS for index retrieval and local vector search</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 active:scale-95 rounded-xl transition shadow-lg shadow-brand-500/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
