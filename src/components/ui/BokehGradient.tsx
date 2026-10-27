'use client';

/**
 * Aivory "defocused photograph" gradient.
 *
 * Instead of round blobs, a WebGL shader warps fractal noise into the shapes a
 * blurred photo has: horizons, clouds, light leaks, curtain-like bands and
 * aurora streaks, with real shadow pockets and soft highlights. Each scene
 * maps that field through six colours ordered from shadow to highlight.
 *
 * On top: optional Chladni figures (the nodal lines of a vibrating plate,
 * cos(nπx)cos(mπy) + cos(mπx)cos(nπy) = level) as white hairlines, and film grain
 * drawn at device-pixel resolution.
 *
 * The colour field renders at a fraction of the element size (it is blurred
 * anyway) and only animates while on screen; prefers-reduced-motion freezes it.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';

export type BokehMode = 'field' | 'horizon' | 'bands' | 'aurora';

export interface BokehScene {
  /** Six colours: [0] is the shadow tone, [5] the highlight; the mode walks through them in order. */
  colors: [string, string, string, string, string, string];
  mode: BokehMode;
  /** Size of the shapes; higher = smaller, busier shapes. */
  scale?: number;
  seed?: number;
  /** How strongly highlight light leaks and shadow pockets show (0–1). */
  light?: number;
  shadow?: number;
  /** Overall brightness multiplier, to keep white type readable. */
  exposure?: number;
}

export interface ChladniFigure {
  n: number;
  m: number;
  /** Plate cells across the card width. */
  cells?: number;
  /** Contour level; 0 is the classic nodal line, 0.3–0.6 opens it into tiled cells. */
  level?: number;
  opacity?: number;
}

const MODE_INDEX: Record<BokehMode, number> = { field: 0, horizon: 1, bands: 2, aurora: 3 };
const FIELD_SCALE = 0.25; // colour field resolution relative to CSS pixels
const DEFOCUS_PX = 22; // optical blur over the field, so shapes read as an out-of-focus photo
const FRAME_MS = 1000 / 30;
const GRAIN_AMPLITUDE = 78;
const GRAIN_OPACITY = 0.42;

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uC[6];
uniform float uMode;
uniform float uScale;
uniform float uSeed;
uniform float uLight;
uniform float uShadow;
uniform float uExposure;
uniform vec2 uMouse;
out vec4 o;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + 1.0), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
vec3 pal(float h) {
  h = clamp(h, 0.0, 1.0) * 5.0;
  int k = int(min(floor(h), 4.0));
  return mix(uC[k], uC[k + 1], smoothstep(0.0, 1.0, fract(h)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  uv.y = 1.0 - uv.y;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y) * uScale + uSeed;
  float t = uTime * 0.035;
  vec2 mo = (uMouse - 0.5) * 0.35;

  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - vec2(t, 0.0)));
  vec2 r = vec2(fbm(p + 1.4 * q + vec2(1.7, 9.2) + mo + t * 0.7), fbm(p + 1.4 * q + vec2(8.3, 2.8) - t * 0.5));
  float f = fbm(p + 1.3 * r);
  float fn = (f - 0.25) / 0.42;

  float h;
  if (uMode < 0.5) {
    h = fn;
  } else if (uMode < 1.5) {
    // Horizon: palette runs top to bottom across a slow wave.
    float wave = 0.09 * sin(uv.x * 3.4 + t * 4.0 + uSeed) + 0.30 * (f - 0.5) + 0.18 * (r.x - 0.5);
    h = smoothstep(0.02, 0.98, uv.y + wave);
  } else if (uMode < 2.5) {
    // Curtain: soft vertical columns, warped like cloth.
    float x = uv.x * asp + 0.20 * (r.y - 0.5) + 0.04 * sin(uv.y * 4.0 + t * 3.0);
    h = 0.5 + 0.5 * sin(x * 7.5 + uSeed + 3.0 * (f - 0.5));
    h = mix(h, fn, 0.3);
  } else {
    // Aurora: dark base with tilted light streaks.
    h = (1.0 - uv.y) * 0.35 + (fn - 0.5) * 0.5 + 0.1;
    float s = uv.x * asp * 1.6 + (r.x - 0.5) * 1.6 + uv.y * 0.45 + t * 1.2;
    float streak = pow(0.5 + 0.5 * sin(s * 3.14159 + uSeed), 7.0);
    h = mix(h, 0.78 + 0.22 * f, streak * 0.85);
  }

  vec3 col = pal(h);
  float hl = smoothstep(0.56, 0.80, fbm(p * 0.7 + r * 1.5 + 31.0 - mo));
  col = mix(col, uC[5], hl * uLight);
  float sh = smoothstep(0.54, 0.78, fbm(p * 0.8 - r * 1.2 + 17.0));
  col = mix(col, uC[0], sh * uShadow);
  o = vec4(col * uExposure, 1.0);
}`;

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.replace('#', ''), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

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

/** Marching squares over a Chladni plate sized w × h; returns one SVG path. */
function chladniPath(w: number, h: number, { n, m, cells = 1, level = 0 }: ChladniFigure): string {
  const size = w / cells; // square cells: the figure repeats down a tall card
  const f = (x: number, y: number) => {
    const X = x / size;
    const Y = y / size;
    return Math.cos(n * Math.PI * X) * Math.cos(m * Math.PI * Y) + Math.cos(m * Math.PI * X) * Math.cos(n * Math.PI * Y) - level;
  };
  const step = 2;
  const cols = Math.ceil(w / step);
  const rows = Math.ceil(h / step);
  const v: number[] = new Array((cols + 1) * (rows + 1));
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) v[j * (cols + 1) + i] = f(i * step, j * step);
  const lerp = (a: number, b: number) => (a === b ? 0.5 : a / (a - b));
  let d = '';
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = v[j * (cols + 1) + i];
      const b = v[j * (cols + 1) + i + 1];
      const c = v[(j + 1) * (cols + 1) + i + 1];
      const e = v[(j + 1) * (cols + 1) + i];
      const x = i * step;
      const y = j * step;
      const pts: [number, number][] = [];
      if (a > 0 !== b > 0) pts.push([x + lerp(a, b) * step, y]);
      if (b > 0 !== c > 0) pts.push([x + step, y + lerp(b, c) * step]);
      if (e > 0 !== c > 0) pts.push([x + lerp(e, c) * step, y + step]);
      if (a > 0 !== e > 0) pts.push([x, y + lerp(a, e) * step]);
      for (let k = 0; k + 1 < pts.length; k += 2) {
        d += `M${pts[k][0].toFixed(1)} ${pts[k][1].toFixed(1)}L${pts[k + 1][0].toFixed(1)} ${pts[k + 1][1].toFixed(1)}`;
      }
    }
  }
  return d;
}

export function BokehGradient({
  scene,
  chladni,
  className = '',
  style,
  children,
}: {
  scene: BokehScene;
  chladni?: ChladniFigure;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [webgl, setWebgl] = useState(true);
  const fallback = useMemo(() => `linear-gradient(170deg, ${scene.colors.slice(1).join(', ')})`, [scene.colors]);

  // Track size for the grain canvas, the field resolution and the Chladni figure.
  useEffect(() => {
    const el = rootRef.current;
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

  // Grain at device-pixel resolution.
  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas || !size) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(size.w * dpr));
    canvas.height = Math.max(1, Math.round(size.h * dpr));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const pattern = ctx.createPattern(getNoiseTile(), 'repeat');
    if (!pattern) return;
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [size]);

  // The shader field: renders while visible, follows the cursor softly.
  useEffect(() => {
    const canvas = fieldRef.current;
    const root = rootRef.current;
    if (!canvas || !root || !size) return;
    const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false });
    if (!gl) {
      setWebgl(false);
      return;
    }
    canvas.width = Math.max(16, Math.round(size.w * 1.16 * FIELD_SCALE));
    canvas.height = Math.max(16, Math.round(size.h * 1.16 * FIELD_SCALE));

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setWebgl(false);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    gl.uniform2f(u('uRes'), canvas.width, canvas.height);
    gl.uniform3fv(u('uC'), new Float32Array(scene.colors.flatMap(hexToRgb)));
    gl.uniform1f(u('uMode'), MODE_INDEX[scene.mode]);
    gl.uniform1f(u('uScale'), scene.scale ?? 0.9);
    gl.uniform1f(u('uSeed'), scene.seed ?? 0);
    gl.uniform1f(u('uLight'), scene.light ?? 0.45);
    gl.uniform1f(u('uShadow'), scene.shadow ?? 0.45);
    gl.uniform1f(u('uExposure'), scene.exposure ?? 1);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const uTime = u('uTime');
    const uMouse = u('uMouse');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    // Each card starts at a different moment so neighbours never move in step.
    let time = (scene.seed ?? 0) * 13;
    let raf = 0;
    let last = 0;
    let visible = false;

    const draw = () => {
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const tick = (now: number) => {
      raf = 0;
      if (!visible || reduce.matches) return;
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      time += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      draw();
    };
    const start = () => {
      if (!raf && visible && !reduce.matches) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    draw();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(root);
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = (e.clientY - r.top) / r.height;
    };
    const onLeave = () => {
      mouse.tx = mouse.ty = 0.5;
    };
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    const onReduce = () => (reduce.matches ? draw() : start());
    reduce.addEventListener('change', onReduce);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      reduce.removeEventListener('change', onReduce);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [size, scene]);

  const figure = useMemo(() => (chladni && size ? chladniPath(size.w, size.h, chladni) : ''), [chladni, size]);

  return (
    <div
      ref={rootRef}
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: webgl ? scene.colors[1] : fallback, ...style }}
    >
      {webgl && (
        // Oversized so the blur never pulls the card's edge colour in.
        <canvas
          ref={fieldRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[8%] -z-10 h-[116%] w-[116%] max-w-none"
          style={{ filter: `blur(${DEFOCUS_PX}px)` }}
        />
      )}
      {figure && size && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${size.w} ${size.h}`}
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
          style={{ opacity: chladni?.opacity ?? 0.5 }}
        >
          <path d={figure} fill="none" stroke="#fff" strokeWidth={0.9} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <canvas
        ref={grainRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full max-w-none mix-blend-overlay"
        style={{ opacity: GRAIN_OPACITY }}
      />
      {children}
    </div>
  );
}

export default BokehGradient;
