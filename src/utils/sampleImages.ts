// src/utils/sampleImages.ts

export interface SampleImage {
  id: string;
  name: string;
  description: string;
  category: 'sketch' | 'ink' | 'logo';
  dataUrl: string;
}

// Generate high quality canvas samples dynamically
export function generateSampleImages(): SampleImage[] {
  const samples: SampleImage[] = [];

  // Sample 1: Hand-Drawn Flower Sketch (with uneven pencil stroke thickness)
  const c1 = document.createElement('canvas');
  c1.width = 600;
  c1.height = 600;
  const ctx1 = c1.getContext('2d')!;
  ctx1.fillStyle = '#f8fafc';
  ctx1.fillRect(0, 0, 600, 600);

  // Draw simulated rough pencil flower
  ctx1.strokeStyle = '#27272a';
  ctx1.lineCap = 'round';
  ctx1.lineJoin = 'round';

  // Petals
  const centerX = 300;
  const centerY = 260;
  const numPetals = 6;
  for (let i = 0; i < numPetals; i++) {
    const angle = (i * Math.PI * 2) / numPetals;
    const pX = centerX + Math.cos(angle) * 110;
    const pY = centerY + Math.sin(angle) * 110;

    ctx1.beginPath();
    ctx1.lineWidth = 3 + Math.sin(i * 1.5) * 3; // Intentionally uneven line thickness
    ctx1.moveTo(centerX, centerY);
    ctx1.bezierCurveTo(
      centerX + Math.cos(angle - 0.4) * 140,
      centerY + Math.sin(angle - 0.4) * 140,
      pX + Math.cos(angle + 0.3) * 50,
      pY + Math.sin(angle + 0.3) * 50,
      pX,
      pY
    );
    ctx1.bezierCurveTo(
      pX - Math.cos(angle - 0.3) * 50,
      pY - Math.sin(angle - 0.3) * 50,
      centerX + Math.cos(angle + 0.4) * 140,
      centerY + Math.sin(angle + 0.4) * 140,
      centerX,
      centerY
    );
    ctx1.stroke();
  }

  // Flower Center
  ctx1.beginPath();
  ctx1.lineWidth = 4.5;
  ctx1.arc(centerX, centerY, 32, 0, Math.PI * 2);
  ctx1.stroke();

  // Stem
  ctx1.beginPath();
  ctx1.lineWidth = 5;
  ctx1.moveTo(centerX, centerY + 32);
  ctx1.bezierCurveTo(280, 360, 320, 440, 290, 530);
  ctx1.stroke();

  // Leaves
  ctx1.beginPath();
  ctx1.lineWidth = 3;
  ctx1.moveTo(295, 390);
  ctx1.bezierCurveTo(230, 370, 200, 420, 290, 430);
  ctx1.stroke();

  ctx1.beginPath();
  ctx1.lineWidth = 4;
  ctx1.moveTo(305, 440);
  ctx1.bezierCurveTo(380, 420, 410, 480, 300, 490);
  ctx1.stroke();

  samples.push({
    id: 'flower-sketch',
    name: 'Hand-Drawn Flower',
    description: 'Uneven pencil strokes & pressure variations',
    category: 'sketch',
    dataUrl: c1.toDataURL('image/png'),
  });

  // Sample 2: Hand Lettering / Signature
  const c2 = document.createElement('canvas');
  c2.width = 600;
  c2.height = 300;
  const ctx2 = c2.getContext('2d')!;
  ctx2.fillStyle = '#fdfbf7';
  ctx2.fillRect(0, 0, 600, 300);

  ctx2.strokeStyle = '#18181b';
  ctx2.lineCap = 'round';
  ctx2.lineJoin = 'round';

  // Draw cursive "SVG Vector"
  ctx2.beginPath();
  ctx2.lineWidth = 6;
  ctx2.moveTo(80, 160);
  ctx2.bezierCurveTo(90, 80, 150, 70, 130, 140);
  ctx2.bezierCurveTo(110, 200, 170, 230, 200, 160);
  ctx2.bezierCurveTo(210, 130, 220, 200, 250, 170);
  ctx2.bezierCurveTo(260, 150, 280, 150, 280, 190);
  ctx2.bezierCurveTo(280, 260, 230, 270, 220, 240);
  ctx2.stroke();

  ctx2.beginPath();
  ctx2.lineWidth = 4;
  ctx2.moveTo(320, 130);
  ctx2.bezierCurveTo(350, 140, 370, 180, 410, 130);
  ctx2.bezierCurveTo(420, 180, 440, 210, 490, 140);
  ctx2.stroke();

  // Flourish underline
  ctx2.beginPath();
  ctx2.lineWidth = 3;
  ctx2.moveTo(70, 220);
  ctx2.bezierCurveTo(250, 250, 450, 210, 520, 230);
  ctx2.stroke();

  samples.push({
    id: 'lettering',
    name: 'Handwritten Lettering',
    description: 'Cursive ink strokes with natural flow',
    category: 'ink',
    dataUrl: c2.toDataURL('image/png'),
  });

  // Sample 3: Geometric Mascot Logo
  const c3 = document.createElement('canvas');
  c3.width = 500;
  c3.height = 500;
  const ctx3 = c3.getContext('2d')!;
  ctx3.fillStyle = '#ffffff';
  ctx3.fillRect(0, 0, 500, 500);

  ctx3.fillStyle = '#0f172a';
  // Outer shield
  ctx3.beginPath();
  ctx3.moveTo(250, 60);
  ctx3.lineTo(410, 120);
  ctx3.lineTo(390, 320);
  ctx3.lineTo(250, 440);
  ctx3.lineTo(110, 320);
  ctx3.lineTo(90, 120);
  ctx3.closePath();
  ctx3.fill();

  // Inner cutout
  ctx3.fillStyle = '#ffffff';
  ctx3.beginPath();
  ctx3.arc(250, 230, 90, 0, Math.PI * 2);
  ctx3.fill();

  ctx3.fillStyle = '#0f172a';
  ctx3.beginPath();
  ctx3.moveTo(250, 170);
  ctx3.lineTo(290, 270);
  ctx3.lineTo(210, 270);
  ctx3.closePath();
  ctx3.fill();

  samples.push({
    id: 'emblem-logo',
    name: 'Shield Emblem Logo',
    description: 'Crisp geometric vector icon',
    category: 'logo',
    dataUrl: c3.toDataURL('image/png'),
  });

  return samples;
}
