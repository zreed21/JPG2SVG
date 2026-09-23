# JPG2SVG Studio — Same-Size Line Edition

A high-performance in-browser raster-to-vector studio designed specifically for turning hand drawings, sketches, signatures, and photos into clean, production-ready SVGs.

![JPG2SVG Studio Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

## ✨ Key Features

- ✏️ **Same-Size Line Mode (Centerline / Skeleton Tracing)**: Uses the **Zhang-Suen thinning algorithm** to erode thick, uneven hand-drawn lines down to a 1-pixel skeleton, then renders every stroke with a uniform thickness.
- 📐 **Adjustable Line Thickness**: Pick any uniform stroke size (from 0.5px hairline to 20px bold marker) with 1 click.
- 🪄 **Hand Jitter Smoothing**: Integrated Ramer-Douglas-Peucker (RDP) and Quadratic Bezier curve fitting to smooth out wobbly hand strokes.
- ⚡ **Auto-Otsu Darkness Threshold**: Automatically calculates optimal ink-vs-paper separation.
- 🧹 **Dust & Specks Filter**: Automatically eliminates scanner artifacts, eraser dust, and tiny pixel noise.
- 🔲 **Filled Contours Mode**: For geometric shapes, logos, and solid vector silhouettes.
- 🪟 **Interactive Comparison Views**:
  - **Split Wipe**: Drag divider slider over the canvas to compare original drawing vs vector SVG.
  - **Side-by-Side**: Direct visual comparison.
  - **3D Tilt View**: Dynamic mouse-driven perspective tilt with extruded drop shadows.
- 💾 **Export Options**: Download clean `.svg` file, copy SVG code, copy Data URI, or copy React component.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm or yarn

### Installation

```bash
git clone https://github.com/<your-username>/JPG2SVG.git
cd JPG2SVG
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🛠️ Built With

- **React 19** + **TypeScript**
- **Vite 7**
- **Tailwind CSS v4**
- **Lucide Icons**
