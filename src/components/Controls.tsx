import React from 'react';
import {
  Sliders,
  Paintbrush,
  Sparkles,
  Layers,
  Feather,
  Zap,
  Eye,
  Settings2,
  Palette,
  Minus,
  Check,
} from 'lucide-react';
import { CenterlineOptions, TraceResult } from '../utils/centerlineTracer';
import { OutlineOptions } from '../utils/outlineTracer';

export type TracingMode = 'centerline' | 'outline';

interface ControlsProps {
  mode: TracingMode;
  onModeChange: (m: TracingMode) => void;
  centerlineOptions: CenterlineOptions;
  onCenterlineOptionsChange: (opts: Partial<CenterlineOptions>) => void;
  outlineOptions: OutlineOptions;
  onOutlineOptionsChange: (opts: Partial<OutlineOptions>) => void;
  onAutoThreshold: () => void;
  traceResult: TraceResult | null;
  isProcessing: boolean;
}

const PRESET_WIDTHS = [
  { label: 'Hairline', value: 1.0 },
  { label: 'Pen', value: 2.5 },
  { label: 'Medium', value: 4.0 },
  { label: 'Marker', value: 7.0 },
  { label: 'Bold', value: 12.0 },
];

const QUICK_COLORS = [
  '#000000',
  '#1e293b',
  '#4338ca',
  '#0284c7',
  '#059669',
  '#d97706',
  '#dc2626',
  '#ffffff',
];

export const Controls: React.FC<ControlsProps> = ({
  mode,
  onModeChange,
  centerlineOptions,
  onCenterlineOptionsChange,
  outlineOptions,
  onOutlineOptionsChange,
  onAutoThreshold,
  traceResult,
  isProcessing,
}) => {
  return (
    <div className="w-80 md:w-96 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-61px)] overflow-y-auto">
      {/* Mode Switcher */}
      <div className="p-4 border-b border-slate-800">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Tracing Algorithm
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => onModeChange('centerline')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'centerline'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Feather className="w-4 h-4 mb-1" />
            <span>Same-Size Line</span>
            <span className="text-[10px] font-normal opacity-80">Centerline / Sketches</span>
          </button>

          <button
            onClick={() => onModeChange('outline')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'outline'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4 mb-1" />
            <span>Filled Contours</span>
            <span className="text-[10px] font-normal opacity-80">Outline / Solid Logo</span>
          </button>
        </div>

        {mode === 'centerline' && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-indigo-400 mt-0.5" />
            <span>
              <strong>Same-Size Line Active:</strong> Thins hand-drawn strokes down to a 1px skeleton and applies uniform stroke width across every line.
            </span>
          </div>
        )}
      </div>

      {/* Main Settings Panel */}
      <div className="p-4 space-y-6 flex-1">
        {mode === 'centerline' ? (
          <>
            {/* 1. Line Thickness / Stroke Width */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Minus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Uniform Line Thickness</span>
                </label>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                  {centerlineOptions.lineWidth.toFixed(1)} px
                </span>
              </div>

              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={centerlineOptions.lineWidth}
                onChange={(e) =>
                  onCenterlineOptionsChange({ lineWidth: parseFloat(e.target.value) })
                }
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />

              {/* Quick Width Buttons */}
              <div className="flex gap-1.5 pt-1">
                {PRESET_WIDTHS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => onCenterlineOptionsChange({ lineWidth: p.value })}
                    className={`flex-1 py-1 text-[11px] rounded border transition-colors ${
                      centerlineOptions.lineWidth === p.value
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-semibold'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Darkness / Luminance Threshold */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Ink Darkness Threshold</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onAutoThreshold}
                    className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/80 hover:bg-indigo-900 transition-colors flex items-center gap-1"
                    title="Calculate optimal Otsu threshold automatically"
                  >
                    <Zap className="w-2.5 h-2.5" />
                    <span>Auto Detect</span>
                  </button>
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {centerlineOptions.threshold}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="10"
                max="245"
                step="1"
                value={centerlineOptions.threshold}
                onChange={(e) =>
                  onCenterlineOptionsChange({
                    threshold: parseInt(e.target.value),
                    autoThreshold: false,
                  })
                }
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Light lines only</span>
                <span>All ink & textures</span>
              </div>
            </div>

            {/* 3. Smoothing / Curve Fitting */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Paintbrush className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hand Jitter Smoothing</span>
                </label>
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {centerlineOptions.smoothing.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.2"
                value={centerlineOptions.smoothing}
                onChange={(e) =>
                  onCenterlineOptionsChange({ smoothing: parseFloat(e.target.value) })
                }
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Preserve every sharp pixel</span>
                <span>Ultra smooth curves</span>
              </div>
            </div>

            {/* 4. Dust / Specks Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Filter Dust & Tiny Specks
                </label>
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  &gt; {centerlineOptions.minPathLength} px
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={centerlineOptions.minPathLength}
                onChange={(e) =>
                  onCenterlineOptionsChange({ minPathLength: parseInt(e.target.value) })
                }
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
            </div>

            {/* 5. Stroke Caps & Joins */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Line Ends</label>
                <select
                  value={centerlineOptions.lineCap}
                  onChange={(e) =>
                    onCenterlineOptionsChange({
                      lineCap: e.target.value as 'round' | 'square' | 'butt',
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="round">Round (Natural)</option>
                  <option value="square">Square</option>
                  <option value="butt">Flat (Butt)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Line Joins</label>
                <select
                  value={centerlineOptions.lineJoin}
                  onChange={(e) =>
                    onCenterlineOptionsChange({
                      lineJoin: e.target.value as 'round' | 'bevel' | 'miter',
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="round">Round</option>
                  <option value="miter">Miter (Sharp)</option>
                  <option value="bevel">Bevel</option>
                </select>
              </div>
            </div>

            {/* 6. Color Picker & Background */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Line Color</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 flex-wrap">
                  {QUICK_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => onCenterlineOptionsChange({ strokeColor: color })}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-transform hover:scale-110 ${
                        centerlineOptions.strokeColor === color
                          ? 'border-indigo-400 ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900'
                          : 'border-slate-700'
                      }`}
                    >
                      {centerlineOptions.strokeColor === color && (
                        <Check
                          className={`w-3 h-3 ${color === '#ffffff' ? 'text-black' : 'text-white'}`}
                        />
                      )}
                    </button>
                  ))}
                </div>
                <input
                  type="color"
                  value={centerlineOptions.strokeColor}
                  onChange={(e) => onCenterlineOptionsChange({ strokeColor: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                  title="Custom color"
                />
              </div>
            </div>

            {/* Invert Toggle */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-300 block">Invert Colors</span>
                <span className="text-[10px] text-slate-500">
                  White strokes on dark paper
                </span>
              </div>
              <button
                onClick={() =>
                  onCenterlineOptionsChange({ invert: !centerlineOptions.invert })
                }
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  centerlineOptions.invert ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    centerlineOptions.invert ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </>
        ) : (
          /* Outline Mode Controls */
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Threshold (Black / White)
                </label>
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {outlineOptions.threshold}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="245"
                value={outlineOptions.threshold}
                onChange={(e) =>
                  onOutlineOptionsChange({ threshold: parseInt(e.target.value) })
                }
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Curve Smoothing
                </label>
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {outlineOptions.smoothing.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={outlineOptions.smoothing}
                onChange={(e) =>
                  onOutlineOptionsChange({ smoothing: parseFloat(e.target.value) })
                }
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-medium text-slate-300">Fill Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={outlineOptions.fillColor}
                  onChange={(e) => onOutlineOptionsChange({ fillColor: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                />
                <span className="text-xs font-mono text-slate-400">
                  {outlineOptions.fillColor}
                </span>
              </div>
            </div>

            {/* Invert */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-300 block">Invert Foreground</span>
              </div>
              <button
                onClick={() => onOutlineOptionsChange({ invert: !outlineOptions.invert })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  outlineOptions.invert ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    outlineOptions.invert ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Live Vector Stats footer */}
      {traceResult && (
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>Paths generated:</span>
            <span className="text-slate-200 font-mono font-medium">
              {traceResult.pathsCount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Vector Nodes:</span>
            <span className="text-slate-200 font-mono font-medium">
              {traceResult.pointsCount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Canvas Size:</span>
            <span className="text-slate-200 font-mono font-medium">
              {traceResult.width} × {traceResult.height} px
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
