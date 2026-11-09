'use client';

import { useEffect, useRef, useState } from 'react';

/* Parametric facade ornaments, drawn as white hairlines over a gradient card.

   - `lattice`: a diamond grid of lens-shaped openings. The grid itself is bent by two soft
     "bulges" (a fisheye push away from a centre), so cells near a bulge grow large and cells
     far from it shrink, and each lens is sized from its warped neighbours, so the openings
     always fit the cell they sit in (the Broad / KAFD / Nanjing facades). The bulges drift
     slowly, so the surface breathes.
   - `ribbons`: near-vertical lines bent by two crossing waves whose amplitude grows down the
     card, like folded fins on a parametric wall; the waves travel slowly.

   Motion is off under prefers-reduced-motion and while the card is off screen. */

export type ParametricKind = 'lattice' | 'ribbons';

const W = 260;
const H = 700;
const f = (n: number) => n.toFixed(1);

type Bulge = { cx: number; cy: number; r: number; k: number };

function bulges(t: number): Bulge[] {
  return [
    { cx: 200 + Math.sin(t * 0.21) * 34, cy: 40 + Math.cos(t * 0.17) * 22, r: 95, k: 1.6 },
    { cx: 60 + Math.cos(t * 0.15) * 34, cy: 665 + Math.sin(t * 0.19) * 22, r: 95, k: 1.4 },
  ];
}

/** Fisheye push: points near a bulge centre are spread apart, so cells there are larger. */
function warp(x: number, y: number, bs: Bulge[]): [number, number] {
  let wx = x;
  let wy = y;
  for (const b of bs) {
    const dx = x - b.cx;
    const dy = y - b.cy;
    const g = b.k * Math.exp(-(dx * dx + dy * dy) / (b.r * b.r));
    wx += dx * g;
    wy += dy * g;
  }
  return [wx, wy];
}

function lattice(t: number): string {
  const dx = 22;
  const dy = 15;
  const bs = bulges(t);
  const out: string[] = [];
  const pt = (i: number, j: number) => warp(i * dx + (j % 2 === 0 ? 0 : dx / 2), j * dy, bs);
  for (let j = -6; j * dy < H + 6 * dy; j++) {
    for (let i = -6; i * dx < W + 6 * dx; i++) {
      const [x, y] = pt(i, j);
      if (x < -40 || x > W + 40 || y < -40 || y > H + 40) continue;
      // Local cell size from the warped neighbours.
      const [rx] = pt(i + 1, j);
      const [, by] = pt(i, j + 2);
      const cw = Math.abs(rx - x);
      const ch = Math.abs(by - y) / 2;
      // Openings also swell along a slow travelling wave, so size varies within a region too.
      const s = 0.55 + 0.4 * (0.5 + 0.5 * Math.sin(x * 0.03 + y * 0.018 - t * 0.6));
      const hw = (cw / 2) * s;
      const hh = ch * s;
      if (hw < 1.2) continue;
      out.push(`M${f(x - hw)} ${f(y)}Q${f(x)} ${f(y - hh * 2)} ${f(x + hw)} ${f(y)}Q${f(x)} ${f(y + hh * 2)} ${f(x - hw)} ${f(y)}Z`);
    }
  }
  return out.join('');
}

function ribbons(t: number): string {
  const out: string[] = [];
  const gap = 13;
  for (let x0 = -30; x0 < W + 30; x0 += gap) {
    let d = '';
    for (let y = -10; y <= H + 10; y += 10) {
      const amp = 6 + 22 * (y / H);
      const x = x0 + Math.sin(y * 0.011 + x0 * 0.02 - t * 0.4) * amp + Math.sin(y * 0.027 - x0 * 0.035 + t * 0.25) * amp * 0.35;
      d += `${y === -10 ? 'M' : 'L'}${f(x)} ${f(y)}`;
    }
    out.push(d);
  }
  return out.join('');
}

const draw = (kind: ParametricKind, t: number) => (kind === 'lattice' ? lattice(t) : ribbons(t));
const MASK = 'linear-gradient(180deg, #000 0%, rgba(0,0,0,.75) 12%, rgba(0,0,0,.12) 25%, rgba(0,0,0,.12) 76%, rgba(0,0,0,.9) 100%)';

export function ParametricPattern({ kind = 'lattice', opacity = 0.3, className = '' }: { kind?: ParametricKind; opacity?: number; className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [initial] = useState(() => draw(kind, 0));

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;
    path.setAttribute('d', draw(kind, 0));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let visible = false;
    let last = 0;
    let t = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min(0.1, (now - last) / 1000);
      if (dt < 1 / 30) return; // ~30 fps is plenty for a slow drift
      last = now;
      t += dt;
      path.setAttribute('d', draw(kind, t));
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(svg);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [kind]);

  return (
    <svg
      ref={svgRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      // Shows at the top (behind the wordmark) and the bottom edge; nearly gone behind the rows of copy.
      style={{ opacity, maskImage: MASK, WebkitMaskImage: MASK }}
    >
      <path ref={pathRef} d={initial} fill="none" stroke="#fff" strokeWidth={0.8} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

export default ParametricPattern;
