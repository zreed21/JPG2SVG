import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { Controls, TracingMode } from './components/Controls';
import { Viewer } from './components/Viewer';
import { UploadScreen } from './components/UploadScreen';
import { CodeModal } from './components/CodeModal';
import {
  CenterlineOptions,
  TraceResult,
  traceCenterlines,
  computeOtsuThreshold,
} from './utils/centerlineTracer';
import { OutlineOptions, traceFilledContours } from './utils/outlineTracer';
import { generateSampleImages, SampleImage } from './utils/sampleImages';

export const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('drawing');
  const [mode, setMode] = useState<TracingMode>('centerline');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [sampleImages, setSampleImages] = useState<SampleImage[]>([]);

  // Trace results
  const [traceResult, setTraceResult] = useState<TraceResult | null>(null);

  // Settings
  const [centerlineOptions, setCenterlineOptions] = useState<CenterlineOptions>({
    threshold: 135,
    autoThreshold: false,
    adaptiveLighting: true,
    adaptiveSensitivity: 15,
    invert: false,
    lineWidth: 3.5,
    strokeColor: '#0f172a',
    fillBackground: 'none',
    lineCap: 'round',
    lineJoin: 'round',
    connectGaps: true,
    gapMaxDistance: 25,
    autoCloseLoops: true,
    humanErrorSmoothing: 5.0,
    minPathLength: 10,
  });

  const [outlineOptions, setOutlineOptions] = useState<OutlineOptions>({
    threshold: 128,
    invert: false,
    colorLayers: 1,
    smoothing: 1.5,
    fillColor: '#0f172a',
    fillBackground: 'none',
    minArea: 6,
  });

  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageDataRef = useRef<ImageData | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setSampleImages(generateSampleImages());
  }, []);

  // Process image whenever options or image changes
  const runVectorization = useCallback(() => {
    if (!originalImageDataRef.current) return;

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const imgData = originalImageDataRef.current;
        if (!imgData) return;

        if (mode === 'centerline') {
          const res = traceCenterlines(imgData, centerlineOptions);
          setTraceResult(res);
        } else {
          const res = traceFilledContours(imgData, outlineOptions);
          setTraceResult({
            ...res,
            thresholdUsed: outlineOptions.threshold,
          });
        }
      } catch (err) {
        console.error('Vectorization error:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 20);
  }, [mode, centerlineOptions, outlineOptions]);

  // Handle image load
  const handleImageSelected = (dataUrl: string, name = 'drawing') => {
    setImageSrc(dataUrl);
    setFileName(name.replace(/\.[^/.]+$/, ''));
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Keep max dimension to 1200px for optimal speed & quality
      const MAX_DIM = 1200;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        originalImageDataRef.current = imgData;
        hiddenCanvasRef.current = canvas;

        const gray = new Uint8Array(width * height);
        for (let i = 0; i < width * height; i++) {
          const idx = i * 4;
          gray[i] = Math.round(
            0.299 * imgData.data[idx] + 0.587 * imgData.data[idx + 1] + 0.114 * imgData.data[idx + 2]
          );
        }
        const otsu = computeOtsuThreshold(gray);
        setCenterlineOptions((prev) => ({ ...prev, threshold: otsu }));
      }
    };
    img.src = dataUrl;
  };

  // Re-run conversion with debounce when options change
  useEffect(() => {
    if (!originalImageDataRef.current) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = window.setTimeout(() => {
      runVectorization();
    }, 50);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [runVectorization]);

  // Auto Otsu button handler
  const handleAutoThreshold = () => {
    if (!originalImageDataRef.current) return;
    const { width, height, data } = originalImageDataRef.current;
    const gray = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const idx = i * 4;
      gray[i] = Math.round(
        0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]
      );
    }
    const otsu = computeOtsuThreshold(gray);
    if (mode === 'centerline') {
      setCenterlineOptions((prev) => ({ ...prev, threshold: otsu }));
    } else {
      setOutlineOptions((prev) => ({ ...prev, threshold: otsu }));
    }
  };

  // Download SVG
  const handleDownloadSvg = () => {
    if (!traceResult?.svg) return;
    const blob = new Blob([traceResult.svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}-smooth-vector.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset to upload screen
  const handleReset = () => {
    setImageSrc(null);
    setTraceResult(null);
    originalImageDataRef.current = null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header
        onReset={handleReset}
        onOpenCode={() => setIsCodeModalOpen(true)}
        onDownload={handleDownloadSvg}
        hasSvg={!!traceResult?.svg}
        isProcessing={isProcessing}
      />

      {!imageSrc ? (
        <UploadScreen
          onImageSelected={handleImageSelected}
          sampleImages={sampleImages}
        />
      ) : (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <Controls
            mode={mode}
            onModeChange={setMode}
            centerlineOptions={centerlineOptions}
            onCenterlineOptionsChange={(opts) =>
              setCenterlineOptions((prev) => ({ ...prev, ...opts }))
            }
            outlineOptions={outlineOptions}
            onOutlineOptionsChange={(opts) =>
              setOutlineOptions((prev) => ({ ...prev, ...opts }))
            }
            onAutoThreshold={handleAutoThreshold}
            traceResult={traceResult}
            isProcessing={isProcessing}
          />

          <Viewer
            originalImageSrc={imageSrc}
            svgContent={traceResult?.svg || null}
            isProcessing={isProcessing}
          />
        </div>
      )}

      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        svgContent={traceResult?.svg || ''}
        onDownload={handleDownloadSvg}
      />
    </div>
  );
};
