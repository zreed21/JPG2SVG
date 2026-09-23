import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Image as ImageIcon, Feather, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { SampleImage } from '../utils/sampleImages';

interface UploadScreenProps {
  onImageSelected: (dataUrl: string, name?: string) => void;
  sampleImages: SampleImage[];
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onImageSelected,
  sampleImages,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected(e.target.result as string, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files && e.clipboardData.files[0]) {
      handleFile(e.clipboardData.files[0]);
    }
  };

  return (
    <div
      onPaste={handlePaste}
      className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 overflow-y-auto"
    >
      <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-6 my-auto py-8">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>New Feature: Uniform "Same Size Line" Vectorization for Hand Drawings</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Turn Hand Drawings & Photos into Clean SVGs
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Solves uneven, wobbly sketch lines by thinning strokes down to a 1-pixel skeleton and rendering every stroke at the exact uniform thickness.
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full max-w-xl p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center group ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-slate-800 hover:border-indigo-500/50 bg-slate-900/50 hover:bg-slate-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/bmp, image/svg+xml"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600/20 transition-all">
            <Upload className="w-7 h-7 text-indigo-400" />
          </div>

          <h3 className="font-semibold text-white text-base mb-1">
            Drop your hand drawing or photo here
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Supports JPEG, PNG, WebP, BMP (or paste from clipboard)
          </p>

          <span className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all">
            Browse File
          </span>
        </div>

        {/* Sample Templates / Try It Out */}
        {sampleImages.length > 0 && (
          <div className="w-full max-w-2xl pt-4">
            <div className="flex items-center justify-between mb-3 text-left">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Or Try with Sample Drawings:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sampleImages.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onImageSelected(sample.dataUrl, `${sample.id}.png`)}
                  className="p-3 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl transition-all text-left flex flex-col group"
                >
                  <div className="w-full h-28 bg-white rounded-lg mb-2 overflow-hidden flex items-center justify-center p-2 border border-slate-700/50">
                    <img
                      src={sample.dataUrl}
                      alt={sample.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {sample.name}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {sample.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
