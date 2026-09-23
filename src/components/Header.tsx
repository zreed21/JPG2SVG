import React from 'react';
import { Layers, Sparkles, Wand2, Download, Code, Github, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenCode: () => void;
  onDownload: () => void;
  hasSvg: boolean;
  isProcessing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenCode,
  onDownload,
  hasSvg,
  isProcessing,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-white tracking-tight">JPG2SVG Studio</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Dual Engine: Original & Same-Size Line
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Switch between Original Filled Contours and Uniform Centerline Tracing
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          title="Reset to new image"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Image</span>
        </button>

        <button
          onClick={onOpenCode}
          disabled={!hasSvg || isProcessing}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Code className="w-3.5 h-3.5" />
          <span>View SVG Code</span>
        </button>

        <button
          onClick={onDownload}
          disabled={!hasSvg || isProcessing}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export SVG</span>
        </button>
      </div>
    </header>
  );
};
