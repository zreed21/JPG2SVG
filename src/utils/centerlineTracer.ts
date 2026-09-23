// src/utils/centerlineTracer.ts

export interface CenterlineOptions {
  threshold: number;         // 0 - 255 luminance threshold
  autoThreshold?: boolean;   // Otsu's thresholding
  invert: boolean;           // Invert ink/background
  lineWidth: number;         // Uniform stroke width in px
  strokeColor: string;       // e.g. "#1e293b" or "#000000"
  fillBackground?: string;   // e.g. "none", "#ffffff"
  lineCap: 'round' | 'square' | 'butt';
  lineJoin: 'round' | 'bevel' | 'miter';
  smoothing: number;         // RDP epsilon (0.2 to 5.0)
  minPathLength: number;     // Filter out specks/dust (e.g. 3 to 10 pixels)
}

interface Point {
  x: number;
  y: number;
}

// Compute Otsu's threshold for automatic optimal thresholding of hand drawings
export function computeOtsuThreshold(grayPixels: Uint8Array): number {
  const histogram = new Array(256).fill(0);
  const total = grayPixels.length;

  for (let i = 0; i < total; i++) {
    histogram[grayPixels[i]]++;
  }

  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * histogram[i];

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let maxVariance = 0;
  let threshold = 128;

  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;

    sumB += t * histogram[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;

    const variance = wB * wF * (mB - mF) * (mB - mF);
    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = t;
    }
  }

  return threshold;
}

// Zhang-Suen Thinning Algorithm
function zhangSuenThinning(grid: Uint8Array, width: number, height: number): Uint8Array {
  const result = new Uint8Array(grid);
  let changed = true;

  while (changed) {
    changed = false;

    // Sub-iteration 1
    const toDelete1: number[] = [];
    for (let y = 1; y < height - 1; y++) {
      const rowOffset = y * width;
      const prevRow = (y - 1) * width;
      const nextRow = (y + 1) * width;

      for (let x = 1; x < width - 1; x++) {
        const idx = rowOffset + x;
        if (result[idx] === 0) continue;

        const p2 = result[prevRow + x];
        const p3 = result[prevRow + (x + 1)];
        const p4 = result[rowOffset + (x + 1)];
        const p5 = result[nextRow + (x + 1)];
        const p6 = result[nextRow + x];
        const p7 = result[nextRow + (x - 1)];
        const p8 = result[rowOffset + (x - 1)];
        const p9 = result[prevRow + (x - 1)];

        const b = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
        if (b < 2 || b > 6) continue;

        const neighbors = [p2, p3, p4, p5, p6, p7, p8, p9, p2];
        let a = 0;
        for (let i = 0; i < 8; i++) {
          if (neighbors[i] === 0 && neighbors[i + 1] === 1) a++;
        }
        if (a !== 1) continue;

        if (p2 * p4 * p6 === 0 && p4 * p6 * p8 === 0) {
          toDelete1.push(idx);
        }
      }
    }
    for (let i = 0; i < toDelete1.length; i++) {
      result[toDelete1[i]] = 0;
      changed = true;
    }

    // Sub-iteration 2
    const toDelete2: number[] = [];
    for (let y = 1; y < height - 1; y++) {
      const rowOffset = y * width;
      const prevRow = (y - 1) * width;
      const nextRow = (y + 1) * width;

      for (let x = 1; x < width - 1; x++) {
        const idx = rowOffset + x;
        if (result[idx] === 0) continue;

        const p2 = result[prevRow + x];
        const p3 = result[prevRow + (x + 1)];
        const p4 = result[rowOffset + (x + 1)];
        const p5 = result[nextRow + (x + 1)];
        const p6 = result[nextRow + x];
        const p7 = result[nextRow + (x - 1)];
        const p8 = result[rowOffset + (x - 1)];
        const p9 = result[prevRow + (x - 1)];

        const b = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
        if (b < 2 || b > 6) continue;

        const neighbors = [p2, p3, p4, p5, p6, p7, p8, p9, p2];
        let a = 0;
        for (let i = 0; i < 8; i++) {
          if (neighbors[i] === 0 && neighbors[i + 1] === 1) a++;
        }
        if (a !== 1) continue;

        if (p2 * p4 * p8 === 0 && p2 * p6 * p8 === 0) {
          toDelete2.push(idx);
        }
      }
    }
    for (let i = 0; i < toDelete2.length; i++) {
      result[toDelete2[i]] = 0;
      changed = true;
    }
  }

  return result;
}

// Ramer-Douglas-Peucker line simplification
function perpendicularDistance(p: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  if (dx === 0 && dy === 0) {
    return Math.hypot(p.x - lineStart.x, p.y - lineStart.y);
  }
  const num = Math.abs(dy * p.x - dx * p.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x);
  const den = Math.hypot(dx, dy);
  return num / den;
}

function simplifyPolyline(points: Point[], epsilon: number): Point[] {
  if (points.length <= 2) return points;
  let maxDist = 0;
  let index = 0;
  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], start, end);
    if (d > maxDist) {
      maxDist = d;
      index = i;
    }
  }

  if (maxDist > epsilon) {
    const left = simplifyPolyline(points.slice(0, index + 1), epsilon);
    const right = simplifyPolyline(points.slice(index), epsilon);
    return left.slice(0, -1).concat(right);
  } else {
    return [start, end];
  }
}

// Convert points to smooth SVG path with quadratic Bezier midpoints
function polylineToSmoothSvgPath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} l 0.1 0.1`;
  }
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}`;
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const xc = ((points[i].x + points[i + 1].x) / 2).toFixed(1);
    const yc = ((points[i].y + points[i + 1].y) / 2).toFixed(1);
    d += ` Q ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}, ${xc} ${yc}`;
  }
  d += ` L ${points[points.length - 1].x.toFixed(1)} ${points[points.length - 1].y.toFixed(1)}`;
  return d;
}

export interface TraceResult {
  svg: string;
  pathsCount: number;
  pointsCount: number;
  width: number;
  height: number;
  thresholdUsed: number;
}

// Convert image canvas to uniform line width SVG
export function traceCenterlines(
  imageData: ImageData,
  options: CenterlineOptions
): TraceResult {
  const { width, height, data } = imageData;
  const totalPixels = width * height;

  // 1. Convert to grayscale array
  const gray = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    gray[i] = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
  }

  // 2. Determine threshold
  let effectiveThreshold = options.threshold;
  if (options.autoThreshold) {
    effectiveThreshold = computeOtsuThreshold(gray);
  }

  // 3. Create binary grid
  const binary = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    const isInk = options.invert ? gray[i] > effectiveThreshold : gray[i] < effectiveThreshold;
    binary[i] = isInk ? 1 : 0;
  }

  // 4. Skeletonize
  const skeleton = zhangSuenThinning(binary, width, height);

  // 5. Trace graph / polylines from skeleton
  const visited = new Uint8Array(totalPixels);
  const polylines: Point[][] = [];
  let totalPoints = 0;

  const getUnvisitedNeighbors = (x: number, y: number) => {
    const list: Point[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const idx = ny * width + nx;
          if (skeleton[idx] === 1 && !visited[idx]) {
            list.push({ x: nx, y: ny });
          }
        }
      }
    }
    return list;
  };

  // Traverse and extract continuous stroke lines
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (skeleton[idx] === 0 || visited[idx]) continue;

      const polyline: Point[] = [{ x, y }];
      visited[idx] = 1;
      let curr = { x, y };

      while (true) {
        const nextNeighbors = getUnvisitedNeighbors(curr.x, curr.y);
        if (nextNeighbors.length === 0) break;

        const next = nextNeighbors[0];
        visited[next.y * width + next.x] = 1;
        polyline.push(next);
        curr = next;
      }

      // Filter out small artifacts/dust specks
      if (polyline.length >= options.minPathLength) {
        const simplified = simplifyPolyline(polyline, options.smoothing);
        polylines.push(simplified);
        totalPoints += simplified.length;
      }
    }
  }

  // 6. Build SVG with uniform stroke width
  const pathElements = polylines
    .map(
      (pts) =>
        `  <path d="${polylineToSmoothSvgPath(pts)}" fill="none" stroke="${options.strokeColor}" stroke-width="${options.lineWidth}" stroke-linecap="${options.lineCap}" stroke-linejoin="${options.lineJoin}" />`
    )
    .join('\n');

  const bgRect =
    options.fillBackground && options.fillBackground !== 'none'
      ? `  <rect width="${width}" height="${height}" fill="${options.fillBackground}" />\n`
      : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n${bgRect}${pathElements}\n</svg>`;

  return {
    svg,
    pathsCount: polylines.length,
    pointsCount: totalPoints,
    width,
    height,
    thresholdUsed: effectiveThreshold,
  };
}
