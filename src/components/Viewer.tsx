import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Columns,
  Split,
  Eye,
  Box,
  Sun,
  Moon,
  Layers,
  Sparkles,
} from 'lucide-react';

export type ViewMode = 'split' | 'side-by-side' | 'svg-only' | '3d-tilt';

interface ViewerProps {
  originalImageSrc: string | null;
  svgContent: string | null;
  isProcessing: boolean;
}

export const Viewer: React.FC<ViewerProps> = ({
  originalImageSrc,
  svgContent,
  isProcessing,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [splitPos, setSplitPos] = useState(50); // percentage
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [bgStyle, setBgStyle] = useState<'dark-grid' | 'light-grid' | 'black' | 'white'>('dark-grid');

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingSplitRef = useRef(false);

  // Handle Split Slider Dragging
  const handleSplitMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    isDraggingSplitRef.current = true;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSplitRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setSplitPos((x / rect.width) * 100);
      }
    };

    const handleMouseUp = () => {
      isDraggingSplitRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Handle 3D Tilt on Mouse Move
  const handle3DMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== '3d-tilt' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: y * -35, // Tilt X based on Y mouse
      y: x * 35,  // Tilt Y based on X mouse
    });
  };

  const handle3DMouseLeave = () => {
    if (viewMode === '3d-tilt') {
      setTilt({ x: 0, y: 0 });
    }
  };

  // Pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isDraggingSplitRef.current) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Reset zoom & pan
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setTilt({ x: 0, y: 0 });
  };

  const getBackgroundClass = () => {
    switch (bgStyle) {
      case 'dark-grid':
        return 'checkerboard-bg';
      case 'light-grid':
        return 'checkerboard-light';
      case 'black':
        return 'bg-black';
      case 'white':
        return 'bg-white';
      default:
        return 'checkerboard-bg';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-61px)] bg-slate-950 overflow-hidden relative">
      {/* Top View Mode Toolbar */}
      <div className="h-12 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between z-10 backdrop-blur-sm">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
              viewMode === 'split'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Split Wipe</span>
          </button>

          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>

          <button
            onClick={() => setViewMode('svg-only')}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
              viewMode === 'svg-only'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>SVG Only</span>
          </button>

          <button
            onClick={() => setViewMode('3d-tilt')}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
              viewMode === '3d-tilt'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Tilt View</span>
          </button>
        </div>

        {/* Zoom & View Background Controls */}
        <div className="flex items-center gap-3">
          {/* Background Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-slate-400">
            <button
              onClick={() => setBgStyle('dark-grid')}
              className={`p-1 rounded ${bgStyle === 'dark-grid' ? 'bg-slate-800 text-white' : 'hover:text-slate-200'}`}
              title="Dark Checkerboard"
            >
              <div className="w-3.5 h-3.5 rounded-sm border border-slate-600 bg-slate-900" />
            </button>
            <button
              onClick={() => setBgStyle('light-grid')}
              className={`p-1 rounded ${bgStyle === 'light-grid' ? 'bg-slate-800 text-white' : 'hover:text-slate-200'}`}
              title="Light Checkerboard"
            >
              <div className="w-3.5 h-3.5 rounded-sm border border-slate-400 bg-slate-200" />
            </button>
            <button
              onClick={() => setBgStyle('white')}
              className={`p-1 rounded ${bgStyle === 'white' ? 'bg-slate-800 text-white' : 'hover:text-slate-200'}`}
              title="Pure White Canvas"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBgStyle('black')}
              className={`p-1 rounded ${bgStyle === 'black' ? 'bg-slate-800 text-white' : 'hover:text-slate-200'}`}
              title="Pure Dark Canvas"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(0.2, z - 0.2))}
              className="text-slate-400 hover:text-white p-0.5"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-slate-300 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(5, z + 0.2))}
              className="text-slate-400 hover:text-white p-0.5"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="text-slate-400 hover:text-white p-0.5 ml-1 pl-1 border-l border-slate-800"
              title="Reset View"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Stage */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          handleMouseMove(e);
          handle3DMouseMove(e);
        }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handle3DMouseLeave}
        className={`flex-1 relative overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing ${getBackgroundClass()}`}
        style={{ perspective: viewMode === '3d-tilt' ? '1200px' : 'none' }}
      >
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-30 flex items-center justify-center flex-col gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-200">
              Thinning strokes & computing vector centerlines...
            </span>
          </div>
        )}

        {/* Canvas Display Content */}
        <div
          className="relative transition-transform duration-75 ease-out shadow-2xl rounded-lg"
          style={{
            transform:
              viewMode === '3d-tilt'
                ? `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                : `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformStyle: viewMode === '3d-tilt' ? 'preserve-3d' : 'flat',
          }}
        >
          {viewMode === 'split' && originalImageSrc && svgContent && (
            <div className="relative overflow-hidden rounded-lg border border-slate-700/50 shadow-2xl bg-white max-w-[85vw] max-h-[75vh]">
              {/* Underlying Original Image */}
              <img
                src={originalImageSrc}
                alt="Original"
                className="max-h-[70vh] w-auto object-contain block pointer-events-none select-none"
              />

              {/* Overlaid Vector SVG (Clipped by splitPos) */}
              <div
                className="absolute inset-0 overflow-hidden bg-white/90"
                style={{ clipPath: `polygon(${splitPos}% 0, 100% 0, 100% 100%, ${splitPos}% 100%)` }}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </div>

              {/* Split Drag Handle Bar */}
              <div
                onMouseDown={handleSplitMouseDown}
                className="absolute top-0 bottom-0 w-1 bg-indigo-500 cursor-ew-resize flex items-center justify-center shadow-lg"
                style={{ left: `${splitPos}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-white text-white flex items-center justify-center shadow-md">
                  <Split className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Split Labels */}
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black/70 text-white rounded backdrop-blur-sm pointer-events-none">
                Original Drawing
              </span>
              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-600/90 text-white rounded backdrop-blur-sm pointer-events-none">
                Same-Size SVG Vector
              </span>
            </div>
          )}

          {viewMode === 'side-by-side' && originalImageSrc && svgContent && (
            <div className="flex gap-4 items-center">
              {/* Original */}
              <div className="bg-white p-2 rounded-xl border border-slate-700/50 shadow-xl flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-700 mb-1.5">Original</span>
                <img
                  src={originalImageSrc}
                  alt="Original"
                  className="max-h-[60vh] w-auto object-contain rounded"
                />
              </div>

              {/* Vector SVG */}
              <div className="bg-white p-2 rounded-xl border border-indigo-500/40 shadow-xl flex flex-col items-center">
                <span className="text-xs font-semibold text-indigo-700 mb-1.5">
                  Clean SVG Vector
                </span>
                <div
                  className="max-h-[60vh] w-auto flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </div>
            </div>
          )}

          {viewMode === 'svg-only' && svgContent && (
            <div className="bg-white/95 p-4 rounded-xl border border-slate-700/50 shadow-2xl max-w-[85vw] max-h-[75vh] flex items-center justify-center">
              <div
                className="w-full h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
          )}

          {viewMode === '3d-tilt' && svgContent && (
            <div
              className="relative p-6 rounded-2xl bg-gradient-to-br from-white to-slate-100 shadow-[0_30px_90px_rgba(0,0,0,0.6)] border border-slate-200 flex items-center justify-center"
              style={{
                transform: 'translateZ(50px)',
                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.4), 0 18px 36px -18px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Depth shadow layer */}
              <div
                className="absolute inset-0 opacity-20 filter blur-md pointer-events-none"
                style={{
                  transform: 'translateZ(-30px) translateY(15px) scale(0.96)',
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />

              {/* Elevated Vector Layer */}
              <div
                className="relative z-10 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)]"
                style={{ transform: 'translateZ(30px)' }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />

              <div className="absolute bottom-2 right-3 text-[10px] font-semibold text-slate-400 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
                Move mouse to rotate 3D view
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
