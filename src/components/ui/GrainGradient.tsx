'use client';

/**
 * Aivory grainy-gradient surface.
 *
 * A base gradient, five soft blobs that drift slowly, an optional fine white
 * contour pattern, a cursor glow, and a film-grain canvas on top. The look
 * follows the Orbit design system's grainy gradients; the code is our own.
 *
 * What makes the grain read as grain rather than haze:
 *  - it is drawn on a canvas at device-pixel resolution, so one noise pixel
 *    is one physical pixel and is never scaled or blurred;
 *  - the tile is mid-grey noise (128 ± 70) blended with `overlay`, which
 *    lightens and darkens the colour underneath without tinting it.
 *
 * Children render above every layer. Motion (drift, hover spring) stops under
 * prefers-reduced-motion.
 */

import React, { useEffect, useMemo, useRef } from 'react';

export interface GrainPalette {
  /** CSS background under the blobs, usually a vertical linear-gradient. */
  base: string;
  /** Five blob colours: top-left, top-right, mid-left, mid-right, bottom. */
  blobs: [string, string, string, string, string];
}

/** Steel and silver at the top, Aivory blue through the middle, warm orange below. */
export const SILVER_BLUE_ORANGE: GrainPalette = {
  base: 'linear-gradient(180deg, #5d77a3 0%, #2a58a8 30%, #1d4a9a 55%, #a8582f 80%, #e46a24 100%)',
  blobs: ['#a3b3ca', '#7f97bd', '#2b63c6', '#1b3f86', '#f2701f'],
};

// Where each blob sits and how slowly it drifts, as fractions of the surface.
const BLOB_LAYOUT = [
  { x: 8, y: 0, w: 70, h: 95, dur: 22, delay: 0 },
  { x: 92, y: 4, w: 70, h: 95, dur: 26, delay: -7 },
  { x: 0, y: 56, w: 60, h: 105, dur: 28, delay: -13 },
  { x: 100, y: 70, w: 62, h: 105, dur: 20, delay: -4 },
  { x: 46, y: 108, w: 110, h: 70, dur: 24, delay: -10 },
];

const GRAIN_AMPLITUDE = 70;
const GRAIN_OPACITY = 0.4;
const BLOB_SHIFT = 9; // % the blobs follow the cursor
const PATTERN_SHIFT = 3; // % the contours move the other way
const SPRING_K = 70;
const SPRING_C = 2 * 0.86 * Math.sqrt(SPRING_K);

let noiseTile: HTMLCanvasElement | null = null;
function getNoiseTile(): HTMLCanvasElement {
  if (noiseTile) return noiseTile;
  const tile = document.createElement('canvas');
  tile.width = tile.height = 128;
  const ctx = tile.getContext('2d')!;
  const img = ctx.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = (128 + (Math.random() - 0.5) * 2 * GRAIN_AMPLITUDE) | 0;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  noiseTile = tile;
  return tile;
}

/** Concentric, slightly wobbly ellipses in a 100×100 box. */
function contourPaths(): string[] {
  const paths: string[] = [];
  const cx = 50;
  const cy = 46;
  for (let k = 1; k <= 26; k++) {
    const r = k * 4.2;
    let d = '';
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 72) {
      const rr = r * (1 + 0.03 * Math.sin(a * 3 + k * 0.5) + 0.018 * Math.sin(a * 5 - k));
      d += `${d ? 'L' : 'M'}${(cx + Math.cos(a) * rr * 1.25).toFixed(2)} ${(cy + Math.sin(a) * rr * 0.95).toFixed(2)}`;
    }
    paths.push(`${d}Z`);
  }
  return paths;
}

const blobBackground = (c: string) =>
  `radial-gradient(closest-side, ${c} 0%, color-mix(in oklab, ${c} 78%, transparent) 25%, ` +
  `color-mix(in oklab, ${c} 45%, transparent) 50%, color-mix(in oklab, ${c} 16%, transparent) 75%, transparent 100%)`;

export function GrainGradient({
  palette = SILVER_BLUE_ORANGE,
  contours = true,
  patternOpacity = 0.14,
  blur = 40,
  hover = true,
  className = '',
  style,
  children,
}: {
  palette?: GrainPalette;
  contours?: boolean;
  patternOpacity?: number;
  /** Blob blur in px. */
  blur?: number;
  hover?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const paths = useMemo(() => (contours ? contourPaths() : []), [contours]);

  // Grain at device-pixel resolution, repainted only when the size changes.
  useEffect(() => {
    const el = rootRef.current;
    const canvas = grainRef.current;
    if (!el || !canvas) return;
    const paint = () => {
      const dpr = window.devicePixelRatio || 1;
      const r = el.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      const pattern = ctx.createPattern(getNoiseTile(), 'repeat');
      if (!pattern) return;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Hover spring: blobs lean toward the cursor, contours away, glow fades in.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !hover) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mk = () => ({ x: 0, v: 0, t: 0 });
    const sx = mk();
    const sy = mk();
    const sg = mk();
    let raf = 0;
    let last = 0;
    const step = (s: ReturnType<typeof mk>, dt: number) => {
      const a = -SPRING_K * (s.x - s.t) - SPRING_C * s.v;
      s.v += a * dt;
      s.x += s.v * dt;
    };
    const atRest = (s: ReturnType<typeof mk>) => Math.abs(s.v) < 1e-4 && Math.abs(s.x - s.t) < 1e-4;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (let i = 0; i < 4; i++) {
        step(sx, dt / 4);
        step(sy, dt / 4);
        step(sg, dt / 4);
      }
      if (blobsRef.current) {
        blobsRef.current.style.transform = `translate(${(sx.x * BLOB_SHIFT).toFixed(3)}%, ${(sy.x * BLOB_SHIFT).toFixed(3)}%)`;
      }
      if (patternRef.current) {
        patternRef.current.style.transform = `translate(${(-sx.x * PATTERN_SHIFT).toFixed(3)}%, ${(-sy.x * PATTERN_SHIFT).toFixed(3)}%)`;
      }
      if (glowRef.current) glowRef.current.style.opacity = Math.max(0, Math.min(1, sg.x)).toFixed(3);
      raf = atRest(sx) && atRest(sy) && atRest(sg) ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (reduce.matches) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      sx.t = nx - 0.5;
      sy.t = ny - 0.5;
      sg.t = 1;
      glowRef.current?.style.setProperty('--gx', `${(nx * 100).toFixed(2)}%`);
      glowRef.current?.style.setProperty('--gy', `${(ny * 100).toFixed(2)}%`);
      kick();
    };
    const onLeave = () => {
      sx.t = sy.t = sg.t = 0;
      kick();
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [hover]);

  return (
    <div
      ref={rootRef}
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: palette.base, ...style }}
    >
      <div ref={blobsRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 will-change-transform">
        {BLOB_LAYOUT.map((b, i) => (
          <div
            key={i}
            className="aivory-gg-blob absolute rounded-full"
            style={{
              width: `${b.w}%`,
              height: `${b.h}%`,
              left: `calc(${b.x}% - ${b.w / 2}%)`,
              top: `calc(${b.y}% - ${b.h / 2}%)`,
              background: blobBackground(palette.blobs[i]),
              filter: `blur(${blur}px)`,
              animation: `aivory-gg-drift ${b.dur}s ease-in-out ${b.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>
      {contours && (
        <div
          ref={patternRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
          style={{
            opacity: patternOpacity,
            WebkitMaskImage: 'radial-gradient(ellipse 50% 46% at 50% 45%, transparent 40%, #000 100%)',
            maskImage: 'radial-gradient(ellipse 50% 46% at 50% 45%, transparent 40%, #000 100%)',
          }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="block h-full w-full">
            {paths.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#fff" strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
        </div>
      )}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 mix-blend-soft-light"
        style={{
          background:
            'radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,.30) 0%, rgba(255,255,255,.10) 20%, rgba(255,255,255,0) 42%)',
        }}
      />
      <canvas
        ref={grainRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full max-w-none mix-blend-overlay"
        style={{ opacity: GRAIN_OPACITY }}
      />
      <style>{`
        @keyframes aivory-gg-drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(3%, -2.5%) scale(1.06); }
          100% { transform: translate(-2.5%, 3%) scale(0.96); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aivory-gg-blob { animation: none !important; }
        }
      `}</style>
      {children}
    </div>
  );
}

export default GrainGradient;
