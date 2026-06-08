import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function UploadPanel({ onUploadSuccess, onUploadStart }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'processing' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      setStatus('error');
      setMessage('Please upload a valid PDF file.');
      return;
    }

    setFile(selectedFile);
    setStatus('uploading');
    setProgress(0);
    if (onUploadStart) onUploadStart();

    try {
      const data = await api.uploadPdf(selectedFile, (percent) => {
        setProgress(percent);
        if (percent === 100) {
          setStatus('processing');
        }
      });
      setStatus('success');
      setMessage(data.message || 'PDF loaded successfully!');
      if (onUploadSuccess) {
        onUploadSuccess({
          name: selectedFile.name,
          message: data.message,
          chunks: data.message.match(/\d+/) ? parseInt(data.message.match(/\d+/)[0]) : 0
        });
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Failed to upload. Ensure backend is running at local port 8000.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={status === 'uploading' || status === 'processing' ? null : triggerFileInput}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all duration-200 group ${
          dragActive 
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20' 
            : 'border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/30'
        } ${status === 'uploading' || status === 'processing' ? 'pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleChange}
        />

        {status === 'idle' && (
          <div className="text-center space-y-2">
            <div className="mx-auto flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Drag & Drop PDF or <span className="text-brand-500">Browse</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Supports PDF files up to 20MB</p>
          </div>
        )}

        {(status === 'uploading' || status === 'processing') && (
          <div className="w-full text-center space-y-3 p-1">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4 text-brand-500 animate-spin" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {status === 'uploading' ? `Uploading... ${progress}%` : 'Processing PDF...'}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-750 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`bg-brand-500 h-full rounded-full transition-all duration-300 ${status === 'processing' ? 'w-full animate-pulse' : ''}`}
                style={{ width: status === 'uploading' ? `${progress}%` : '100%' }}
              ></div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center space-y-2">
            <div className="mx-auto flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px] mx-auto">
              {file?.name}
            </div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium px-2 leading-relaxed">
              {message}
            </p>
            <div className="text-[9px] text-brand-500 hover:underline pt-1 font-semibold">
              Replace file
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-2">
            <div className="mx-auto flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Upload Failed
            </div>
            <p className="text-[10px] text-rose-500 leading-tight">
              {message}
            </p>
            <div className="text-[9px] text-brand-500 hover:underline pt-1 font-semibold">
              Try again
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
