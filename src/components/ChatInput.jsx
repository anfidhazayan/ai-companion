import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSendMessage, disabled, loadingText }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    // If Enter key is pressed without Shift key, submit the message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 rounded-2xl shadow-xl max-w-3xl mx-auto overflow-hidden transition-all focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10">
      {disabled && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <div className="h-full bg-brand-500 animate-pulse w-full rounded-full"></div>
        </div>
      )}
      
      <div className="flex items-end p-3 space-x-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? (loadingText || "Thinking...") : "Ask a question about the PDF, or type 'remember ...'"}
          disabled={disabled}
          className="flex-1 max-h-48 resize-none bg-transparent border-0 p-1.5 focus:ring-0 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm leading-relaxed"
          style={{ height: 'auto' }}
        />
        
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className={`flex items-center justify-center p-2.5 rounded-xl transition-all ${
            text.trim() && !disabled
              ? 'bg-brand-500 text-white hover:bg-brand-600 active:scale-95 shadow-md shadow-brand-500/10'
              : 'bg-slate-150 dark:bg-slate-900 text-slate-400 dark:text-slate-650 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
