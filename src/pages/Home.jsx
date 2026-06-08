import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import MemoryPanel from '../components/MemoryPanel';
import SettingsModal from '../components/SettingsModal';
import { api, getBackendUrl, setBackendUrl } from '../services/api';
import { Brain, Menu, X } from 'lucide-react';

export default function Home() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [backendUrl, setBackendUrlState] = useState(getBackendUrl());
  const [activePdf, setActivePdf] = useState(null);
  const [messages, setMessages] = useState([]);
  const [facts, setFacts] = useState([]);
  const [isMemoryLoading, setIsMemoryLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(true);
  
  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState(null);

  // Chat sessions history (mock data)
  const [activeChatId, setActiveChatId] = useState('chat-1');
  const [chatHistory, setChatHistory] = useState([
    { id: 'chat-1', title: 'Intro to LangChain & RAG' },
    { id: 'chat-2', title: 'FAISS Vector Search Basics' },
    { id: 'chat-3', title: 'FastAPI Backend API setup' }
  ]);

  // Synchronize theme with HTML document class list
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load initial backend status, memory facts, and cached uploaded file details
  useEffect(() => {
    loadBackendStatus();
    loadMemory();
  }, [backendUrl]);

  const loadBackendStatus = async () => {
    try {
      setError(null);
      const status = await api.getStatus();
      if (status.pdf_loaded) {
        const cachedName = localStorage.getItem('last_pdf_name') || 'Loaded Document.pdf';
        setActivePdf({
          name: cachedName,
          chunks: status.chunks_count
        });
      } else {
        setActivePdf(null);
      }
    } catch (err) {
      console.error(err);
      setError('Backend server unavailable. Please ensure FastAPI is running and check settings.');
    }
  };

  const loadMemory = async () => {
    setIsMemoryLoading(true);
    try {
      const data = await api.getMemory();
      setFacts(data.facts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMemoryLoading(false);
    }
  };

  const handleToggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const handleSaveBackendUrl = (newUrl) => {
    setBackendUrl(newUrl);
    setBackendUrlState(newUrl);
    loadBackendStatus();
  };

  const handleUploadStart = () => {
    setIsGenerating(true);
    setLoadingText('Uploading PDF...');
    setError(null);
  };

  const handleUploadSuccess = (pdfDetails) => {
    setIsGenerating(false);
    setLoadingText('');
    setActivePdf(pdfDetails);
    localStorage.setItem('last_pdf_name', pdfDetails.name);
    
    // Add success system message to session
    const systemMessage = {
      id: `system-${Date.now()}`,
      sender: 'ai',
      text: `🎉 **Document Loaded successfully!** \n\nI have chunked and indexed your file **${pdfDetails.name}** into **${pdfDetails.chunks} chunks** inside the local FAISS index. You can now ask me questions using RAG (Retrieval-Augmented Generation)!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleSendMessage = async (text) => {
    setError(null);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp
    };
    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);

    const isMemoryPrompt = text.toLowerCase().startsWith('remember');

    try {
      if (isMemoryPrompt) {
        setLoadingText('Updating memory...');
      } else if (activePdf) {
        setLoadingText('Searching knowledge base...');
        // Wait 800ms to show the state transitions cleanly
        await new Promise(resolve => setTimeout(resolve, 850));
        setLoadingText('Generating answer...');
      } else {
        setLoadingText('Generating answer...');
      }

      const response = await api.askQuestion(text);
      
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

      // If we taught it a fact, refresh facts list
      if (isMemoryPrompt) {
        await loadMemory();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to get answer. Check if backend is running.');
    } finally {
      setIsGenerating(false);
      setLoadingText('');
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const firstUserMsg = messages.find(m => m.sender === 'user');
      const newTitle = firstUserMsg ? (firstUserMsg.text.length > 25 ? firstUserMsg.text.slice(0, 25) + '...' : firstUserMsg.text) : `Session ${chatHistory.length + 1}`;
      const newHistoryItem = {
        id: `chat-${Date.now()}`,
        title: newTitle
      };
      setChatHistory(prev => [newHistoryItem, ...prev]);
      setActiveChatId(newHistoryItem.id);
    }
    setMessages([]);
    setError(null);
  };

  const handleSelectHistoryItem = (chatId) => {
    setActiveChatId(chatId);
    const matched = chatHistory.find(c => c.id === chatId);
    const mockMessage = {
      id: `system-welcome-${Date.now()}`,
      sender: 'ai',
      text: `Welcome back to session: **"${matched?.title || 'Previous Chat'}"**. \n\nHow can I help you learn today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([mockMessage]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activePdf={activePdf}
          onUploadStart={handleUploadStart}
          onUploadSuccess={handleUploadSuccess}
          onNewChat={handleNewChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          chatHistory={chatHistory}
          onSelectHistoryItem={handleSelectHistoryItem}
          activeChatId={activeChatId}
        />
      </div>

      {/* Mobile Sidebar overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="relative flex-1 max-w-[280px] bg-slate-900 h-full animate-fade-in animate-duration-200">
            <Sidebar
              activePdf={activePdf}
              onUploadStart={handleUploadStart}
              onUploadSuccess={handleUploadSuccess}
              onNewChat={handleNewChat}
              onOpenSettings={() => {
                setIsSettingsOpen(true);
                setIsMobileSidebarOpen(false);
              }}
              chatHistory={chatHistory}
              onSelectHistoryItem={(id) => {
                handleSelectHistoryItem(id);
                setIsMobileSidebarOpen(false);
              }}
              activeChatId={activeChatId}
            />
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-4 right-[-45px] text-white p-2 rounded-lg bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main panel container */}
      <div className="flex flex-col flex-grow min-w-0 h-full">
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 select-none">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-805 text-slate-600 dark:text-slate-300 animate-pulse-slow"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-1">
            <Brain className="w-4 h-4 text-brand-500" />
            <span className="font-extrabold text-sm text-slate-850 dark:text-white">Companion</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMemoryOpen(!isMemoryOpen)}
            className={`p-1.5 rounded-lg border text-slate-650 dark:text-slate-300 ${
              isMemoryOpen 
                ? 'border-brand-500/30 bg-brand-500/10 text-brand-500' 
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <Brain className="w-5 h-5" />
          </button>
        </header>

        {/* Desktop Header panel triggers */}
        <div className="hidden md:flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 select-none">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
            {activePdf ? `Connected: ${activePdf.name}` : 'Local General Model Active'}
          </span>
          <button
            type="button"
            onClick={() => setIsMemoryOpen(!isMemoryOpen)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition duration-200 ${
              isMemoryOpen 
                ? 'border-brand-500/30 bg-brand-500/5 text-brand-500' 
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Memory Panel</span>
          </button>
        </div>

        {/* Chat Window */}
        <div className="flex-grow min-h-0 relative">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
            loadingText={loadingText}
            activePdf={activePdf}
            error={error}
          />
        </div>
      </div>

      {/* Memory Drawer/Panel on Desktop */}
      {isMemoryOpen && (
        <div className="hidden md:block select-none animate-fade-in">
          <MemoryPanel facts={facts} isLoading={isMemoryLoading} onRefresh={loadMemory} />
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        backendUrl={backendUrl}
        onSaveBackendUrl={handleSaveBackendUrl}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </div>
  );
}
