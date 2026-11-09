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
      if (hw < 2.2) continue; // drop the tiniest lenses so crushed areas stay airy
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
// Brightest at the very top and bottom edges; dips behind the wordmark (~10%) and the last row (~88%).
const MASK = 'linear-gradient(180deg, rgba(0,0,0,.95) 0%, rgba(0,0,0,.6) 6%, rgba(0,0,0,.32) 11%, rgba(0,0,0,.1) 23%, rgba(0,0,0,.1) 79%, rgba(0,0,0,.32) 88%, #000 100%)';

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

/* ── Parametric globe ──────────────────────────────────────────────────────────
   The same lens lattice, wrapped on a sphere and drawn in extreme close-up past a
   surface edge. Cells are laid out on longitude/latitude, so they foreshorten toward
   the limb (the globe effect); opening sizes swell along a wave; the globe turns slowly.
   Lengths are in CSS px of the host (measured), so the sphere stays round. */

type Ellipse = { x: number; y: number; rx: number; ry: number; level: number };

export interface GlobeProps {
  /** Sphere centre as a fraction of the host's width and height (may sit off the surface). */
  center: { x: number; y: number };
  /** Radius in host heights. */
  radius: number;
  /** 'lattice' = lens lattice on longitude/latitude; 'waves' = crossing sine ribbons that open
      almond cells of varying size (woven facade). */
  pattern?: 'lattice' | 'waves';
  /** Cells around the equator, and cell rows from pole to pole (lattice). */
  cols?: number;
  rows?: number;
  /** Tilt toward the viewer and roll, radians. */
  tilt?: number;
  roll?: number;
  opacity?: number;
  /** Ellipses (host fractions) where the lattice steps back to `level` of its opacity. */
  quiet?: Ellipse[];
  className?: string;
}

type Layer = [string, number];

function globePath(w: number, h: number, p: GlobeProps, t: number): Layer[] {
  const R = p.radius * h;
  const cx = p.center.x * w;
  const cy = p.center.y * h;
  const cols = p.cols ?? 72;
  const rows = p.rows ?? 38;
  const tilt = p.tilt ?? -0.55;
  const roll = p.roll ?? 0.35;
  const spin = t * 0.035;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  const dLon = (Math.PI * 2) / cols;
  const dLat = Math.PI / rows;
  // Projected point, or null on the far side of the sphere.
  const proj = (lon: number, lat: number): [number, number, number] => {
    const x0 = Math.cos(lat) * Math.sin(lon + spin);
    const y0 = Math.sin(lat);
    const z0 = Math.cos(lat) * Math.cos(lon + spin);
    const y1 = y0 * ct - z0 * st;
    const z1 = y0 * st + z0 * ct;
    const x2 = x0 * cr - y1 * sr;
    const y2 = x0 * sr + y1 * cr;
    return [cx + R * x2, cy - R * y2, z1];
  };
  const bands: string[][] = [[], [], []];
  const N = 22;
  for (let j = 1; j < rows; j++) {
    const lat = -Math.PI / 2 + j * dLat;
    for (let i = 0; i < cols; i++) {
      const lon = (i + (j % 2 ? 0.5 : 0)) * dLon;
      const [mx, my, mz] = proj(lon, lat);
      if (mz < 0.04) continue;
      if (mx < -60 || mx > w + 60 || my < -60 || my > h + 60) continue;
      const s = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(lon * 3 + lat * 5 - t * 0.5));
      // Wider than the cell, so neighbouring lenses touch and read as one woven skin.
      const hw = (dLon / 2) * s * 1.28;
      const hh = (dLat / 2) * s * 0.95;
      let d = '';
      for (let k = 0; k < N; k++) {
        const a = (k / N) * Math.PI * 2;
        const c = Math.cos(a);
        const sn = Math.sin(a);
        // Lens: pointed at the longitude ends, round across latitude.
        const u = c;
        const v = Math.sign(sn) * Math.pow(Math.abs(sn), 1.9);
        const [x, y] = proj(lon + u * hw, lat + v * hh);
        d += `${k === 0 ? 'M' : 'L'}${f(x)} ${f(y)}`;
      }
      // Depth: cells turning away toward the limb fade, so the sphere reads.
      bands[mz > 0.62 ? 2 : mz > 0.3 ? 1 : 0].push(d + 'Z');
    }
  }
  const limb = `M${f(cx - R)} ${f(cy)}A${f(R)} ${f(R)} 0 1 0 ${f(cx + R)} ${f(cy)}A${f(R)} ${f(R)} 0 1 0 ${f(cx - R)} ${f(cy)}Z`;
  const op = [0.35, 0.65, 1];
  return [...bands.map((b, i): Layer => [b.join(''), op[i]]), [limb, 0.5]];
}


/* ── Woven waves ── */

/**
 * Facade of crossing sine ribbons on a real sphere. Rows follow latitude, waves run along
 * longitude: neighbouring lines in opposite phase kiss at pinch points and open almond / eye
 * cells. Every cell has the same width; row spacing varies from equator to pole. Each ribbon is three strands. The sphere leans left (`roll`), shows its
 * north pole a little (`tilt`) and turns slowly on its axis. Drawn on a canvas from geometry
 * built once, so a frame only rotates points (the SVG + breathing version was too heavy).
 */
type WaveGeo = { cosLon: Float32Array; sinLon: Float32Array; strands: { cl: Float32Array; sl: Float32Array; band: 0 | 1 | 2 }[] };
let WAVE_GEO: WaveGeo | null = null;

/** Static geometry, built once: per strand, cos/sin of latitude at every longitude sample.
    Each frame only turns these points around the axis, so no trig and no strings per frame. */
function waveGeo(): WaveGeo {
  if (WAVE_GEO) return WAVE_GEO;
  const TAU = Math.PI * 2;
  const rows: number[] = [];
  for (let v = -1.42; v < 1.42; ) {
    rows.push(v);
    v += 0.034 + 0.05 * Math.pow(0.5 + 0.5 * Math.sin(v * 4.3 + 0.6), 1.6);
  }
  // Phase around longitude: uniform, so every cell has the same width; a whole number of
  // cycles per turn, so the seam never shows as the globe turns.
  const CYCLES = 12;
  const SAMPLES = 720;
  const cosLon = new Float32Array(SAMPLES + 1);
  const sinLon = new Float32Array(SAMPLES + 1);
  const ph = new Float32Array(SAMPLES + 1);
  for (let i = 0; i <= SAMPLES; i++) {
    const lon = (i / SAMPLES) * TAU;
    cosLon[i] = Math.cos(lon);
    sinLon[i] = Math.sin(lon);
    ph[i] = lon * CYCLES;
  }
  const strands: WaveGeo['strands'] = [];
  for (let j = 0; j + 1 < rows.length; j++) {
    const v0 = (rows[j] + rows[j + 1]) / 2;
    const gapUp = rows[j + 1] - rows[j];
    const gapDn = j + 2 < rows.length ? rows[j + 2] - rows[j + 1] : gapUp;
    const amp = 0.5 * Math.min(gapUp, gapDn);
    const sign = j % 2 ? 1 : -1;
    for (const off of [-0.0045, 0, 0.0045]) {
      const cl = new Float32Array(SAMPLES + 1);
      const sl = new Float32Array(SAMPLES + 1);
      for (let i = 0; i <= SAMPLES; i++) {
        const lat = v0 + off + sign * amp * Math.sin(ph[i]);
        cl[i] = Math.cos(lat);
        sl[i] = Math.sin(lat);
      }
      strands.push({ cl, sl, band: off === 0 ? 0 : 2 });
    }
  }
  WAVE_GEO = { cosLon, sinLon, strands };
  return WAVE_GEO;
}

/** Draws the woven-wave globe for rotation angle `spin` into a CSS-px canvas context. */
function drawWaves(ctx: CanvasRenderingContext2D, w: number, h: number, p: GlobeProps, spin: number) {
  const g = waveGeo();
  const R = p.radius * h;
  const cx = p.center.x * w;
  const cy = p.center.y * h;
  const tilt = p.tilt ?? 0.38;
  const roll = p.roll ?? 0.46;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  const cs = Math.cos(spin);
  const ss = Math.sin(spin);
  const near = new Path2D();
  const far = new Path2D();
  const side = new Path2D();
  const n = g.cosLon.length;
  for (const s of g.strands) {
    let pen: Path2D | null = null;
    for (let i = 0; i < n; i++) {
      // sin/cos(lon + spin) by angle addition: no trig in the loop.
      const sL = g.sinLon[i] * cs + g.cosLon[i] * ss;
      const cL = g.cosLon[i] * cs - g.sinLon[i] * ss;
      const x0 = s.cl[i] * sL;
      const y0 = s.sl[i];
      const z0 = s.cl[i] * cL;
      const z1 = -y0 * st + z0 * ct;
      if (z1 < 0.02) {
        pen = null;
        continue;
      }
      const y1 = y0 * ct + z0 * st;
      const x = cx + R * (x0 * cr - y1 * sr);
      const y = cy - R * (x0 * sr + y1 * cr);
      if (x < -40 || x > w + 40 || y < -40 || y > h + 40) {
        pen = null;
        continue;
      }
      const target = s.band === 2 ? side : z1 > 0.45 ? near : far;
      if (pen !== target) {
        if (pen) pen.lineTo(x, y); // close the gap where the depth band changes
        target.moveTo(x, y);
        pen = target;
      } else {
        target.lineTo(x, y);
      }
    }
  }
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 0.75;
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 0.45;
  ctx.stroke(far);
  ctx.globalAlpha = 1;
  ctx.stroke(near);
  ctx.globalAlpha = 0.35;
  ctx.stroke(side);
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Quiet zones: punch soft elliptical holes so the lines step back behind copy. */
function punchQuiet(ctx: CanvasRenderingContext2D, w: number, h: number, quiet: Ellipse[]) {
  if (!quiet.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  for (const q of quiet) {
    ctx.save();
    ctx.translate(q.x * w, q.y * h);
    ctx.scale(q.rx * w, q.ry * h);
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    gr.addColorStop(0, `rgba(0,0,0,${1 - q.level})`);
    gr.addColorStop(0.6, `rgba(0,0,0,${(1 - q.level) * 0.8})`);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

export function ParametricGlobe(props: GlobeProps) {
  const { opacity = 0.45, className = '' } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let w = 0;
    let h = 0;
    let spin = 0;
    const paint = () => {
      if (!w || !h) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const pr = propsRef.current;
      if (pr.pattern === 'waves') {
        drawWaves(ctx, w, h, pr, spin);
      } else {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 0.75;
        for (const [d, o] of globePath(w, h, pr, spin / 0.035)) {
          ctx.globalAlpha = o;
          ctx.stroke(new Path2D(d));
        }
        ctx.globalAlpha = 1;
      }
      punchQuiet(ctx, w, h, pr.quiet ?? []);
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (Math.round(r.width) === Math.round(w) && Math.round(r.height) === Math.round(h)) return;
      w = r.width;
      h = r.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      paint();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => ro.disconnect();

    // Rotation only: a slow turn (~2.3 min), repainted at ~24 fps while on screen.
    let raf = 0;
    let visible = false;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) {
        last = now;
        return;
      }
      const dt = (now - last) / 1000;
      if (dt < 1 / 24) return;
      last = now;
      spin += Math.min(0.1, dt) * 0.045;
      paint();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [props.center.x, props.center.y, props.radius, props.pattern]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    />
  );
}
