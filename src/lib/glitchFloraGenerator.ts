export type PetalKind = 'fan' | 'poppy' | 'ruffle' | 'lily' | 'daisy' | 'tear';

export interface FloraPalette {
  name: string;
  label: string;
  seed: number;
  kind: PetalKind;
  bg: [string, string];
  petal: string[];
  core: string;
  tip?: string[];
  n: number;
  ls?: number;
  bl?: number;
  glitchCount?: number;
  bokeh?: number;
  bk?: string[];
  ang?: number;
}

/**
 * Pure, clean, luminous palettes — zero muddy gray stems, zero dark base rings,
 * zero radial gray streaks, paired with high-definition post-blur glitch blocks.
 */
export const FLORA_PALETTES: Record<string, FloraPalette> = {
  porcelain: {
    name: 'porcelain',
    label: 'Porcelain Sky',
    seed: 19,
    kind: 'tear',
    n: 9,
    ls: 1.35,
    bl: 5.5,
    glitchCount: 18,
    bokeh: 6,
    bk: ['#ffffff', '#e0f2fe', '#bae6fd'],
    bg: ['#b8d0eb', '#7fa6d2'],
    petal: ['#4f86c6', '#74a8de', '#abd0f2', '#ffffff', '#cde4fa'],
    core: '#ffffff',
    tip: ['#ffffff', '#f0f8ff'],
    ang: 56.3,
  },
  mist: {
    name: 'mist',
    label: 'Silver Mist',
    seed: 44,
    kind: 'poppy',
    n: 7,
    ls: 1.28,
    bl: 5.2,
    glitchCount: 18,
    bokeh: 6,
    bk: ['#ffffff', '#f1f5f9', '#dbeafe'],
    bg: ['#c7d2e0', '#93a5bc'],
    petal: ['#6b829e', '#8da2bc', '#dce5f0', '#ffffff', '#b4c4d8'],
    core: '#ffffff',
    tip: ['#ffffff', '#f8fafc'],
    ang: 56.3,
  },
  sage: {
    name: 'sage',
    label: 'Soft Botanical',
    seed: 29,
    kind: 'tear',
    n: 9,
    ls: 1.32,
    bl: 5.2,
    glitchCount: 18,
    bokeh: 6,
    bk: ['#ffffff', '#ecfdf5', '#ccfbf1'],
    bg: ['#b8d8ce', '#7cab9d'],
    petal: ['#4d8f7d', '#73b3a1', '#b6e0d3', '#ffffff', '#d8f2ea'],
    core: '#ffffff',
    tip: ['#ffffff', '#f0fdfa'],
    ang: 56.3,
  },
  blossom: {
    name: 'blossom',
    label: 'Warm Pearl',
    seed: 37,
    kind: 'poppy',
    n: 7,
    ls: 1.25,
    bl: 5.2,
    glitchCount: 18,
    bokeh: 6,
    bk: ['#ffffff', '#f5f3ff', '#fce7f3'],
    bg: ['#d2cbe6', '#a397c4'],
    petal: ['#8374b5', '#a99bd4', '#e4def7', '#ffffff', '#DFC7DC'],
    core: '#ffffff',
    tip: ['#ffffff', '#faf5ff'],
    ang: 56.3,
  },
  footerDusk: {
    name: 'footerDusk',
    label: 'Footer Dusk',
    seed: 61,
    kind: 'tear',
    n: 9,
    ls: 1.35,
    bl: 5.5,
    glitchCount: 20,
    bokeh: 6,
    bk: ['#f5d8c8', '#a3c1cc', '#d97a54'],
    bg: ['#2f4a58', '#7d311a'],
    petal: ['#486674', '#6d8a96', '#c8714e', '#df8864', '#9e5236'],
    core: '#f3d2c1',
    tip: ['#e8a688', '#8aa7b3'],
    ang: 56.3,
  },
  cervoEmber: {
    name: 'cervoEmber',
    label: 'Cervo Ember',
    seed: 73,
    kind: 'poppy',
    n: 8,
    ls: 1.32,
    bl: 5.4,
    glitchCount: 18,
    bokeh: 6,
    bk: ['#ffdfc9', '#b5d6d3', '#f28c5e'],
    bg: ['#5b8683', '#c8421f'],
    petal: ['#6f9996', '#b8947d', '#df7848', '#f09a6e', '#d23b18'],
    core: '#ffe0cc',
    tip: ['#ffd2b8', '#a8ccc9'],
    ang: 56.3,
  },
  workspaceIris: {
    name: 'workspaceIris',
    label: 'Workspace Iris',
    seed: 85,
    kind: 'tear',
    n: 9,
    ls: 1.35,
    bl: 5.4,
    glitchCount: 18,
    bokeh: 6,
    bk: ['#ffffff', '#e9d5ff', '#c7d2fe'],
    bg: ['#647bd8', '#8636bf'],
    petal: ['#6f86e0', '#9aa8ec', '#c484e0', '#b468d4', '#8636bf'],
    core: '#f3e8ff',
    tip: ['#e9d5ff', '#c7d2fe'],
    ang: 56.3,
  },
  planAssessment: {
    name: 'planAssessment',
    label: 'Mint Apricot',
    seed: 103,
    kind: 'tear',
    n: 9,
    ls: 1.45,
    bl: 3.6,
    glitchCount: 16,
    bokeh: 5,
    bk: ['#fff4e6', '#d1fae5', '#fed7aa'],
    bg: ['#3e9682', '#e2904a'],
    petal: ['#4eb39c', '#82d1be', '#f0a868', '#ffd2a8', '#e59554'],
    core: '#fff2e0',
    tip: ['#ffe8cc', '#d1fae5'],
    ang: 28,
  },
  planBlueprint: {
    name: 'planBlueprint',
    label: 'Cervo Ember',
    seed: 117,
    kind: 'poppy',
    n: 8,
    ls: 1.4,
    bl: 3.6,
    glitchCount: 16,
    bokeh: 5,
    bk: ['#ffe4d1', '#b5d6d3', '#f28c5e'],
    bg: ['#5b8683', '#d23b18'],
    petal: ['#6f9996', '#b8947d', '#df7848', '#f29568', '#d23b18'],
    core: '#ffe4d1',
    tip: ['#ffd2b8', '#a8ccc9'],
    ang: 24,
  },
  planComplete: {
    name: 'planComplete',
    label: 'Workspace Iris',
    seed: 131,
    kind: 'tear',
    n: 9,
    ls: 1.42,
    bl: 3.6,
    glitchCount: 16,
    bokeh: 5,
    bk: ['#ffffff', '#e9d5ff', '#c7d2fe'],
    bg: ['#5775db', '#8636bf'],
    petal: ['#6f86e0', '#9aa8ec', '#c484e0', '#b468d4', '#8636bf'],
    core: '#f3e8ff',
    tip: ['#e9d5ff', '#c7d2fe'],
    ang: 30,
  },
  planOperational: {
    name: 'planOperational',
    label: 'Sapphire Sky',
    seed: 149,
    kind: 'lily',
    n: 6,
    ls: 1.38,
    bl: 4.4,
    glitchCount: 0,
    bokeh: 6,
    bk: ['#ffffff', '#bae6fd', '#7dd3fc'],
    bg: ['#1d4ed8', '#0ea5e9'],
    petal: ['#2563eb', '#38bdf8', '#7dd3fc', '#bae6fd', '#0284c7'],
    core: '#f0f9ff',
    tip: ['#e0f2fe', '#ffffff'],
    ang: 26,
  },
  planBusiness: {
    name: 'planBusiness',
    label: 'Orchid Rose',
    seed: 163,
    kind: 'ruffle',
    n: 7,
    ls: 1.36,
    bl: 4.4,
    glitchCount: 0,
    bokeh: 6,
    bk: ['#ffffff', '#fbcfe8', '#fecdd3'],
    bg: ['#5b21b6', '#e11d48'],
    petal: ['#7c3aed', '#c026d3', '#ec4899', '#fb7185', '#f43f5e'],
    core: '#fff1f2',
    tip: ['#fbcfe8', '#fde68a'],
    ang: 30,
  },
  planEnterprise: {
    name: 'planEnterprise',
    label: 'Emerald Teal',
    seed: 179,
    kind: 'daisy',
    n: 14,
    ls: 1.4,
    bl: 4.2,
    glitchCount: 0,
    bokeh: 6,
    bk: ['#ffffff', '#a7f3d0', '#99f6e4'],
    bg: ['#065f46', '#0d9488'],
    petal: ['#047857', '#10b981', '#34d399', '#6ee7b7', '#14b8a6'],
    core: '#ecfdf5',
    tip: ['#a7f3d0', '#ffffff'],
    ang: 22,
  },
};

export const ASCII_GLYPHS = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';

const SPEC: Record<PetalKind, [number, number, number, number, number]> = {
  tear: [0.2, 0.44, 0.28, 0.52, 1],
  poppy: [0.18, 0.28, 0.46, 0.62, 5],
  daisy: [0.12, 0.2, 0.09, 0.09, 16],
  lily: [0.2, 0.32, 0.3, 0.34, 6],
  ruffle: [0.24, 0.38, 0.38, 0.5, 7],
  fan: [0.3, 0.5, 0.3, 0.4, 5],
};

function createRng(seed: number) {
  let s = seed >>> 0;
  return {
    next(): number {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    uniform(min: number, max: number): number {
      return min + (max - min) * this.next();
    },
    randint(min: number, max: number): number {
      return Math.floor(this.uniform(min, max + 1));
    },
    randrange(max: number): number {
      return Math.floor(this.next() * max);
    },
    choice<T>(arr: readonly T[]): T {
      return arr[Math.floor(this.next() * arr.length)];
    },
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function clamp(val: number, min: number, max: number): number {
  return val < min ? min : val > max ? max : val;
}

function smooth(e0: number, e1: number, x: number): number {
  const z = clamp((x - e0) / (e1 - e0), 0, 1);
  return z * z * (3 - 2 * z);
}

function hwFn(kind: PetalKind, tRaw: number, wd: number): number {
  const t = clamp(tRaw, 0, 1);
  if (kind === 'tear') {
    return wd * Math.pow(Math.sin(Math.PI * t), 0.7) * (0.6 + 0.6 * t);
  }
  if (kind === 'poppy') {
    const inner = 1 - Math.pow(2 * Math.pow(t, 0.8) - 1, 2);
    return wd * Math.sqrt(clamp(inner, 0, 1));
  }
  if (kind === 'daisy') {
    return wd * Math.pow(Math.sin(Math.PI * t), 0.5);
  }
  if (kind === 'ruffle') {
    const inner = 1 - Math.pow(2 * Math.pow(t, 0.7) - 1, 2);
    return wd * Math.sqrt(clamp(inner, 0, 1)) * (1 + 0.12 * Math.sin(t * 17));
  }
  return wd * Math.pow(Math.sin(Math.PI * t), 0.9) * (0.4 + 0.8 * t);
}

export const FLORA_TEX_W = 1050;
export const FLORA_TEX_H = 750;

/**
 * Generates a pure, silky Æthereal Glitch Flora composition:
 * - Smooth diagonal gradient + soft luminous bokeh
 * - Pure mathematical gradient petals (zero muddy stems, zero stamen wires, zero dark radial streaks)
 * - Deep soft focal blur BEFORE slicing 18 crisp, high-contrast rectangular Glitch Blocks
 */
export function generateGlitchFloraCanvas(
  palette: FloraPalette,
  seedOverride?: number,
  width = FLORA_TEX_W,
  height = FLORA_TEX_H
): HTMLCanvasElement {
  const W = width;
  const H = height;
  const scaleRatio = W / 1680;
  const rng = createRng(seedOverride ?? palette.seed);

  const img = new Float32Array(W * H * 3);
  const bg0 = hexToRgb(palette.bg[0]);
  const bg1 = hexToRgb(palette.bg[1]);

  // Step 01: Clean diagonal gradient
  const ang = ((palette.ang ?? 56.3) * Math.PI) / 180;
  const ca = Math.cos(ang);
  const sa = Math.sin(ang);
  const denom = Math.abs(ca) + Math.abs(sa);

  for (let y = 0; y < H; y++) {
    const yn = y / H - 0.5;
    for (let x = 0; x < W; x++) {
      const xn = x / W - 0.5;
      const t = clamp(((xn * ca + yn * sa) / denom) + 0.5, 0, 1);
      const idx = (y * W + x) * 3;
      img[idx] = bg0[0] * (1 - t) + bg1[0] * t;
      img[idx + 1] = bg0[1] * (1 - t) + bg1[1] * t;
      img[idx + 2] = bg0[2] * (1 - t) + bg1[2] * t;
    }
  }

  // Step 02: Pure Silky Gradient Petals (no fiber noise, no dark base shadow, no muddy stems)
  const kind = palette.kind;
  const [lo, hi, w0, w1, m] = SPEC[kind];
  const nf = m === 1 ? palette.n : Math.max(3, Math.round(palette.n / 2.2));
  const coreRgb = hexToRgb(palette.core);

  for (let f = 0; f < nf; f++) {
    const cx = rng.uniform(0.16, 0.84) * W;
    const cy = rng.uniform(0.2, 0.8) * H;
    const baseAng = rng.uniform(0, Math.PI * 2);
    const fcol = hexToRgb(rng.choice(palette.petal));

    for (let i = 0; i < m; i++) {
      const th = baseAng + (i * 2 * Math.PI) / m + (m > 1 ? rng.uniform(-0.14, 0.14) : 0);
      const L = rng.uniform(lo, hi) * W * (palette.ls ?? 1);
      const wd = L * rng.uniform(w0, w1);
      const cosT = Math.cos(th);
      const sinT = Math.sin(th);
      const soft = 28 * scaleRatio + 0.18 * wd;
      const col = m === 1 ? hexToRgb(rng.choice(palette.petal)) : fcol;
      const tipRgb = palette.tip ? hexToRgb(rng.choice(palette.tip)) : null;
      const alphaScale = rng.uniform(0.72, 0.92);

      const maxRadius = L + wd + soft + 4;
      const xMin = Math.max(0, Math.floor(cx - maxRadius));
      const xMax = Math.min(W - 1, Math.ceil(cx + maxRadius));
      const yMin = Math.max(0, Math.floor(cy - maxRadius));
      const yMax = Math.min(H - 1, Math.ceil(cy + maxRadius));

      for (let y = yMin; y <= yMax; y++) {
        const dy = y - cy;
        for (let x = xMin; x <= xMax; x++) {
          const dx = x - cx;
          const u = dx * cosT + dy * sinT;
          if (u <= 0 || u >= L) continue;
          const v = -dx * sinT + dy * cosT;
          const absV = Math.abs(v);
          const tt = u / L;
          const hw = hwFn(kind, tt, wd);
          if (absV >= hw + soft) continue;

          const msk = clamp((hw - absV) / soft, 0, 1);
          if (msk <= 0) continue;

          const k = Math.pow(clamp(1 - tt * 1.25, 0, 1), 1.6);
          let cr = col[0] * (1 - k) + coreRgb[0] * k;
          let cg = col[1] * (1 - k) + coreRgb[1] * k;
          let cb = col[2] * (1 - k) + coreRgb[2] * k;

          if (tipRgb) {
            const tk = smooth(0.62, 1, tt) * 0.65;
            cr = cr * (1 - tk) + tipRgb[0] * tk;
            cg = cg * (1 - tk) + tipRgb[1] * tk;
            cb = cb * (1 - tk) + tipRgb[2] * tk;
          }

          const a = msk * alphaScale;
          const idx = (y * W + x) * 3;
          img[idx] = img[idx] * (1 - a) + cr * a;
          img[idx + 1] = img[idx + 1] * (1 - a) + cg * a;
          img[idx + 2] = img[idx + 2] * (1 - a) + cb * a;
        }
      }
    }
  }

  const baseCanvas = document.createElement('canvas');
  baseCanvas.width = W;
  baseCanvas.height = H;
  const baseCtx = baseCanvas.getContext('2d')!;

  const petalImgData = baseCtx.createImageData(W, H);
  for (let i = 0, p = 0; i < img.length; i += 3, p += 4) {
    petalImgData.data[p] = clamp(img[i], 0, 255);
    petalImgData.data[p + 1] = clamp(img[i + 1], 0, 255);
    petalImgData.data[p + 2] = clamp(img[i + 2], 0, 255);
    petalImgData.data[p + 3] = 255;
  }
  baseCtx.putImageData(petalImgData, 0, 0);

  // Step 03: Clean Luminous Bokeh Orbs Only (zero muddy stamen wires)
  if (palette.bokeh && palette.bk) {
    const bokehLayer = document.createElement('canvas');
    bokehLayer.width = W;
    bokehLayer.height = H;
    const bCtx = bokehLayer.getContext('2d')!;
    bCtx.filter = `blur(${Math.max(16, 32 * scaleRatio)}px)`;
    for (let b = 0; b < palette.bokeh; b++) {
      const r = rng.uniform(60, 145) * scaleRatio;
      const bx = rng.uniform(0.12 * W, 0.88 * W);
      const by = rng.uniform(0.15 * H, 0.85 * H);
      const bCol = hexToRgb(rng.choice(palette.bk));
      const bAlpha = rng.uniform(0.28, 0.52);
      bCtx.fillStyle = `rgba(${bCol[0]}, ${bCol[1]}, ${bCol[2]}, ${bAlpha})`;
      bCtx.beginPath();
      bCtx.arc(bx, by, r, 0, Math.PI * 2);
      bCtx.fill();
    }
    baseCtx.drawImage(bokehLayer, 0, 0);
  }

  // Step 04: Deep Dreamy Focal Blur on Flora Layer
  const blurredCanvas = document.createElement('canvas');
  blurredCanvas.width = W;
  blurredCanvas.height = H;
  const blurCtx = blurredCanvas.getContext('2d')!;
  blurCtx.filter = `blur(${Math.max(4.5, (palette.bl ?? 5.2) * scaleRatio * 2.2)}px)`;
  blurCtx.drawImage(baseCanvas, 0, 0);
  blurCtx.filter = 'none';

  // Step 05: Crisp, High-Definition Architectural Glitch Blocks (exact 3 Æthereal modes)
  const raw = blurCtx.getImageData(0, 0, W, H);
  const px = raw.data;

  const snapshot = new Uint8ClampedArray(px);
  const totalGlitches = palette.glitchCount ?? 18;

  for (let g = 0; g < totalGlitches; g++) {
    const gw = Math.max(55, Math.floor(rng.uniform(160, 680) * scaleRatio));
    const gh = Math.max(12, Math.floor(rng.uniform(26, 118) * scaleRatio));
    const gx = rng.randint(0, Math.max(0, W - gw - 1));
    const gy = rng.randint(0, Math.max(0, H - gh - 1));
    const mode = rng.next();

    if (mode < 0.45) {
      // (a) Crisp horizontal pixel-ribbon stretch of a single column
      const sampleX = rng.randint(gx, gx + gw - 1);
      for (let y = gy; y < gy + gh; y++) {
        const src = (y * W + sampleX) * 4;
        for (let x = gx; x < gx + gw; x++) {
          const dst = (y * W + x) * 4;
          px[dst] = snapshot[src];
          px[dst + 1] = snapshot[src + 1];
          px[dst + 2] = snapshot[src + 2];
        }
      }
    } else if (mode < 0.76) {
      // (b) Quantized vertical glass-refraction strips
      const stripW = Math.max(5, Math.floor(rng.choice([10, 14, 20]) * scaleRatio));
      for (let i = 0; i < gw; i += stripW) {
        const sampleX = clamp(
          gx + i + Math.floor(rng.uniform(-14, 14) * scaleRatio),
          0,
          W - 1
        );
        const maxI = Math.min(gx + i + stripW, gx + gw);
        for (let y = gy; y < gy + gh; y++) {
          const src = (y * W + sampleX) * 4;
          for (let x = gx + i; x < maxI; x++) {
            const dst = (y * W + x) * 4;
            px[dst] = snapshot[src];
            px[dst + 1] = snapshot[src + 1];
            px[dst + 2] = snapshot[src + 2];
          }
        }
      }
    } else {
      // (c) Clean horizontal block displacement
      const shiftDelta =
        (rng.next() < 0.5 ? -1 : 1) * Math.floor(rng.uniform(75, 240) * scaleRatio);
      const shiftX = clamp(gx + shiftDelta, 0, Math.max(0, W - gw));
      for (let y = gy; y < gy + gh; y++) {
        for (let i = 0; i < gw; i++) {
          const dst = (y * W + (gx + i)) * 4;
          const src = (y * W + (shiftX + i)) * 4;
          px[dst] = snapshot[src];
          px[dst + 1] = snapshot[src + 1];
          px[dst + 2] = snapshot[src + 2];
        }
      }
    }
    snapshot.set(px);
  }

  blurCtx.putImageData(raw, 0, 0);
  return blurredCanvas;
}

export interface AsciiGridState {
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  updateSmooth: (elapsedSec: number) => void;
}

interface AnimatedAsciiCell {
  c: number;
  r: number;
  ch: string;
  phase: number;
  tickRate: number;
  lastTick: number;
  seqOffset: number;
  seqLen: number;
}

export function createAsciiOverlayState(
  seed: number,
  width: number,
  height: number
): AsciiGridState {
  const safeW = Math.max(240, Math.round(width));
  const safeH = Math.max(180, Math.round(height));
  const rng = createRng(seed + 101);
  const cw = 13;
  const ch = 26;
  const cols = Math.max(12, Math.floor(safeW / cw));
  const rows = Math.max(6, Math.floor(safeH / ch));
  const cellMap = new Map<string, AnimatedAsciiCell>();

  const pick = () => ASCII_GLYPHS[rng.randrange(ASCII_GLYPHS.length)];

  // Build neat, non-overlapping horizontal secret-code sequences on an aligned grid
  const sequenceCount = Math.max(8, Math.round((cols * rows) / 55));
  for (let s = 0; s < sequenceCount; s++) {
    const r = rng.randint(1, Math.max(1, rows - 2));
    const len = rng.randint(6, Math.min(14, Math.max(6, cols - 4)));
    const c0 = rng.randint(1, Math.max(1, cols - len - 1));
    const seqPhase = rng.uniform(0, Math.PI * 2);
    const tickRate = rng.uniform(12, 20); // fast cipher scramble ticks/sec

    // Skip if this row already has a sequence nearby to keep layout clean & uncluttered
    let occupied = false;
    for (let i = -2; i < len + 2; i++) {
      if (cellMap.has(`${c0 + i},${r}`)) {
        occupied = true;
        break;
      }
    }
    if (occupied) continue;

    for (let i = 0; i < len; i++) {
      cellMap.set(`${c0 + i},${r}`, {
        c: c0 + i,
        r,
        ch: pick(),
        phase: seqPhase,
        tickRate,
        lastTick: -1,
        seqOffset: i,
        seqLen: len,
      });
    }
  }

  const cells = Array.from(cellMap.values());
  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
  const canvas = document.createElement('canvas');
  canvas.width = safeW * dpr;
  canvas.height = safeH * dpr;
  const ctx = canvas.getContext('2d')!;

  const updateSmooth = (elapsedSec: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, safeW, safeH);
    ctx.font = '500 11.5px "JetBrains Mono", ui-monospace, monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ffffff';

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      // Fast deterministic cipher tick per cell
      const tick = Math.floor(elapsedSec * cell.tickRate + cell.seqOffset * 0.37);
      if (tick !== cell.lastTick) {
        const idx = Math.abs((tick * 17 + i * 31 + seed) % ASCII_GLYPHS.length);
        cell.ch = ASCII_GLYPHS[idx];
        cell.lastTick = tick;
      }

      // Subtle pulse wave along each sequence (never overpowering UI text)
      const pulse =
        0.5 + 0.5 * Math.sin(elapsedSec * 2.6 + cell.phase - cell.seqOffset * 0.45);
      ctx.globalAlpha = 0.14 + pulse * 0.26;
      ctx.fillText(cell.ch, cell.c * cw + 4, cell.r * ch + 4);
    }
    ctx.globalAlpha = 1;
  };

  updateSmooth(0);

  return { width: safeW, height: safeH, canvas, updateSmooth };
}
