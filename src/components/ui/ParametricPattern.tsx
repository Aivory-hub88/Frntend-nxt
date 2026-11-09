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

type P = [number, number];

/**
 * Facade of crossing sine ribbons: neighbouring lines run in opposite phase and kiss at the
 * pinch points, so almond / eye-shaped cells open between them. Wavelength changes across the
 * surface and row spacing changes down it, so cells range from long slim eyes to small seeds.
 * Each ribbon is three parallel strands (a metal fin). Laid in a disc and bent onto the globe.
 */
function wavesPath(w: number, h: number, p: GlobeProps, t: number): Layer[] {
  const R = p.radius * h;
  const cx = p.center.x * w;
  const cy = p.center.y * h;
  const toScreen = (q: P): P => {
    const r = Math.hypot(q[0], q[1]);
    if (r < 1e-6) return [cx, cy];
    const rr = Math.sin(Math.min(1, r) * Math.PI / 2) / r;
    return [cx + q[0] * rr * R, cy + q[1] * rr * R];
  };
  // Row spacing varies down the surface: wide bands of big eyes, then tight rows of small ones.
  const rowsV: number[] = [];
  for (let v = -1.08; v < 1.08; ) {
    rowsV.push(v);
    v += 0.045 + 0.085 * Math.pow(0.5 + 0.5 * Math.sin(v * 3.1 + 0.6), 1.6);
  }
  // Phase along u: integral of a wavenumber that changes across the surface (long eyes <-> short).
  const STEP = 0.005;
  const phaseAt: number[] = [];
  let acc = 0;
  for (let u = -1.1; u <= 1.1 + 1e-9; u += STEP) {
    const k = 15 + 20 * Math.pow(0.5 + 0.5 * Math.sin(u * 2.4 - 0.7), 1.3);
    acc += k * STEP;
    phaseAt.push(acc);
  }
  const drift = t * 0.22;
  const breathe = 1 + 0.04 * Math.sin(t * 0.4);
  const near: string[] = [];
  const far: string[] = [];
  const side: string[] = [];
  const strands = [-0.006, 0, 0.006];
  for (let j = 0; j + 1 < rowsV.length; j++) {
    // The crossing line between rows j and j+1, with amplitude half of each neighbouring gap.
    const v0 = (rowsV[j] + rowsV[j + 1]) / 2;
    const gapUp = rowsV[j + 1] - rowsV[j];
    const gapDn = j + 2 < rowsV.length ? rowsV[j + 2] - rowsV[j + 1] : gapUp;
    const amp = 0.5 * Math.min(gapUp, gapDn) * 1.0 * breathe;
    const sign = j % 2 ? 1 : -1;
    for (const off of strands) {
      let cur: string[] | null = null;
      let d = '';
      const flush = () => {
        if (cur && d) cur.push(d);
        d = '';
        cur = null;
      };
      phaseAt.forEach((ph, i) => {
        const u = -1.1 + i * STEP;
        const v = v0 + off + sign * amp * Math.sin(ph - drift);
        const r = Math.hypot(u, v);
        if (r > 0.995) {
          flush();
          return;
        }
        const band = off !== 0 ? side : r < 0.8 ? near : far;
        if (band !== cur) {
          flush();
          cur = band;
        }
        const [x, y] = toScreen([u, v]);
        d += `${d ? 'L' : 'M'}${f(x)} ${f(y)}`;
      });
      flush();
    }
  }
  const limb = `M${f(cx - R)} ${f(cy)}A${f(R)} ${f(R)} 0 1 0 ${f(cx + R)} ${f(cy)}A${f(R)} ${f(R)} 0 1 0 ${f(cx - R)} ${f(cy)}Z`;
  return [[far.join(''), 0.5], [near.join(''), 1], [side.join(''), 0.35], [limb, 0.45]];
}

export function ParametricGlobe(props: GlobeProps) {
  const { opacity = 0.45, quiet = [], className = '' } = props;
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize((s) => (s && Math.round(s.w) === Math.round(r.width) && Math.round(s.h) === Math.round(r.height) ? s : { w: r.width, h: r.height }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !size) return;
    const paint = (time: number) => {
      const pr = propsRef.current;
      const layers = (pr.pattern === 'waves' ? wavesPath : globePath)(size.w, size.h, pr, time);
      pathRefs.current.forEach((el, i) => {
        if (!el) return;
        el.setAttribute('d', layers[i]?.[0] ?? '');
        el.setAttribute('opacity', String(layers[i]?.[1] ?? 0));
      });
    };
    paint(0);
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
      if (dt < 1 / 30) return;
      last = now;
      t += dt;
      paint(t);
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
  }, [size, props.center.x, props.center.y, props.radius, props.pattern]);

  const w = size?.w ?? 1;
  const h = size?.h ?? 1;
  const maskId = 'pg-mask';
  return (
    <svg
      ref={svgRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        {quiet.map((q, i) => (
          <radialGradient key={i} id={`${maskId}-q${i}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#000" stopOpacity={1 - q.level} />
            <stop offset="0.6" stopColor="#000" stopOpacity={(1 - q.level) * 0.8} />
            <stop offset="1" stopColor="#000" stopOpacity={0} />
          </radialGradient>
        ))}
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
          <rect width={w} height={h} fill="#fff" />
          {quiet.map((q, i) => (
            <ellipse key={i} cx={q.x * w} cy={q.y * h} rx={q.rx * w} ry={q.ry * h} fill={`url(#${maskId}-q${i})`} />
          ))}
        </mask>
      </defs>
      <g mask={`url(#${maskId})`} fill="none" stroke="#fff" strokeWidth={0.75} strokeLinejoin="round">
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} ref={(el) => { pathRefs.current[i] = el; }} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
