import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Download, Sparkles } from 'lucide-react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  svgContent: string;
  onDownload: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  onClose,
  svgContent,
  onDownload,
}) => {
  const [copiedType, setCopiedType] = useState<'raw' | 'data-uri' | 'react' | null>(null);

  if (!isOpen) return null;

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(svgContent);
    setCopiedType('raw');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyDataUri = () => {
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
    navigator.clipboard.writeText(dataUri);
    setCopiedType('data-uri');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyReact = () => {
    // Basic conversion from HTML attributes to JSX
    const reactComponent = `import React from 'react';\n\nexport const VectorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (\n  ${svgContent
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/fill-rule=/g, 'fillRule=')}\n);`;
    navigator.clipboard.writeText(reactComponent);
    setCopiedType('react');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white text-base">Generated SVG Code</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 flex-1 overflow-auto bg-slate-950 font-mono text-xs text-indigo-200/90 leading-relaxed">
          <pre className="whitespace-pre-wrap break-all">{svgContent}</pre>
        </div>

        {/* Action Buttons Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyRaw}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copiedType === 'raw' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'raw' ? 'Copied SVG!' : 'Copy SVG'}</span>
            </button>

            <button
              onClick={handleCopyDataUri}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copiedType === 'data-uri' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'data-uri' ? 'Copied Data URI!' : 'Copy Data URI'}</span>
            </button>

            <button
              onClick={handleCopyReact}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copiedType === 'react' ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{copiedType === 'react' ? 'Copied React!' : 'Copy React Component'}</span>
            </button>
          </div>

          <button
            onClick={onDownload}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center gap-1.5 transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .svg file</span>
          </button>
        </div>
      </div>
    </div>
  );
};
