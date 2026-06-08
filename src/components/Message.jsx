import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Bot, User, Clock, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Message({ message }) {
  const { sender, text, timestamp } = message;
  const isAi = sender === 'ai';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom components for ReactMarkdown
  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeText = String(children).replace(/\n$/, '');

      if (!inline) {
        return (
          <div className="relative my-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden font-mono text-xs">
            {/* Code Block Header */}
            <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-205 dark:border-slate-800 text-[10px] text-slate-500 font-bold uppercase select-none">
              <span className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-brand-500" />
                <span>{match ? match[1] : 'code'}</span>
              </span>
              <CopyCodeButton text={codeText} />
            </div>
            {/* Code Body */}
            <div className="p-4 overflow-x-auto">
              <pre className="text-slate-850 dark:text-slate-200 leading-relaxed"><code>{children}</code></pre>
            </div>
          </div>
        );
      }

      // Inline code
      return (
        <code className="px-1.5 py-0.5 rounded-md bg-slate-150 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-mono text-xs font-semibold" {...props}>
          {children}
        </code>
      );
    },
    ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1 text-slate-700 dark:text-slate-300">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-700 dark:text-slate-300">{children}</ol>,
    li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
    p: ({ children }) => <p className="text-sm leading-relaxed mb-2 last:mb-0 text-slate-700 dark:text-slate-300">{children}</p>,
    h1: ({ children }) => <h1 className="text-lg font-extrabold text-slate-900 dark:text-white mt-4 mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-md font-bold text-slate-800 dark:text-slate-150 mt-3 mb-1.5">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-bold text-slate-855 dark:text-slate-200 mt-2 mb-1">{children}</h3>,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start space-x-4 max-w-4xl mx-auto py-5 px-6 rounded-2xl transition-all duration-200 ${
        isAi 
          ? 'bg-slate-50/50 dark:bg-slate-900/30' 
          : 'flex-row-reverse space-x-reverse'
      }`}
    >
      {/* Avatar */}
      <div className={`flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 shadow-sm border ${
        isAi 
          ? 'bg-brand-500 border-brand-600 text-white' 
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350'
      }`}>
        {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* Message Box */}
      <div className="flex-1 space-y-1.5 overflow-hidden">
        {/* Header */}
        <div className={`flex items-center space-x-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 ${!isAi ? 'justify-end' : ''}`}>
          <span className="font-bold text-slate-600 dark:text-slate-400">{isAi ? 'Companion' : 'You'}</span>
          <span>•</span>
          <span className="flex items-center space-x-0.5">
            <Clock className="w-3 h-3" />
            <span>{timestamp}</span>
          </span>
        </div>

        {/* Text */}
        <div className={`text-slate-800 dark:text-slate-200 ${!isAi ? 'text-right' : ''}`}>
          {isAi ? (
            <div className="prose dark:prose-invert max-w-none text-left">
              <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
            </div>
          ) : (
            <div className="inline-block bg-brand-500 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-none text-left shadow-sm border border-brand-600 max-w-[85%] break-words leading-relaxed whitespace-pre-wrap">
              {text}
            </div>
          )}
        </div>

        {/* Copy Response Button */}
        {isAi && (
          <div className="flex justify-start pt-1.5">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy response</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Inner helper for copying code inside block
function CopyCodeButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      type="button"
      className="flex items-center space-x-1 text-[10px] text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold transition focus:outline-none"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}
