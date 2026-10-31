'use client';

/**
 * Aivory vibration field: a lit mesh gradient with a dense set of crisp
 * vibration lines on top, the large-surface version of the brand's Chladni
 * ornament (footers, closing bands, cover panels).
 *
 *  - Colour: a handful of light points (position, colour, reach) blended in
 *    Oklab, warped by slow noise, with a vignette, then defocused by CSS blur.
 *    Rendered at a quarter of the element size; it is blurred anyway.
 *  - Lines: contours of one field, drawn by a second shader at device-pixel
 *    resolution so every line is a sharp hairline. The field is a rounded-square
 *    distance from the centre plus a Chladni plate term, so the lines run
 *    parallel to the edges, ripple like a vibrating plate, and square up toward
 *    the centre; a faint crosshair marks the axes. Lines fade out over the
 *    `clear` zone where copy sits.
 *  - Film grain on top, as on every Aivory gradient.
 *
 * Animates only while on screen; frozen under prefers-reduced-motion.
 */

import React, { useEffect, useRef, useState } from 'react';

export interface LightPoint {
  /** 0–1 across and down the surface. */
  x: number;
  y: number;
  color: string;
  /** Reach as a fraction of the surface's short side. */
  r: number;
}

export interface VibrationLines {
  /** Lines from the centre to the edge. */
  count: number;
  /** Squareness of the rings: 2 = ellipse, 4–6 = rounded square. */
  power?: number;
  /** Chladni plate term mixed into the field: cos(nπx)cos(mπy) + cos(mπx)cos(nπy). */
  n?: number;
  m?: number;
  wave?: number;
  opacity?: number;
  /** Ellipse (0–1 coordinates) where the lines fade out to keep copy clean. */
  clear?: { x: number; y: number; rx: number; ry: number };
  crosshair?: boolean;
  /** Line weight in CSS px (default 1). */
  weight?: number;
  /** Ellipse where the lines drop to `level` of their opacity, e.g. behind a logo. */
  quiet?: { x: number; y: number; rx: number; ry: number; level: number };
  /** 'rings' = rounded-square contours; 'plate' = a true Chladni figure (nodal sand lines). */
  kind?: 'rings' | 'plate' | 'dome';
  /** Plate only: second mode mixed in, sign of the mode pair, plate size in short sides. */
  n2?: number;
  m2?: number;
  mix?: number;
  sign?: 1 | -1;
  plate?: number;
  /** Plate only: soft sand halo around each nodal line (0–1, default 0: a clean 1px line). */
  sand?: number;
  /** Plate and dome: how far slow noise bends the figure (0 = symmetric; 0.08–0.3 = fluid). */
  warp?: number;
  /** Plate and dome: noise seed, so two surfaces never bend the same way. */
  seed?: number;
  /** Dome only: cells around one full turn, ogee wave (0 = straight lozenges, ~0.12 = almond),
      and the centre in 0–1 surface coordinates (may sit off the surface). */
  cells?: number;
  ogee?: number;
  /** Dome only: how much the radial rows spiral (0 = straight spokes). */
  twist?: number;
  /** Dome only: 'weave' = interlocking cells on crossing spirals; 'ogee' = almond cells on radial rows. */
  dome?: 'weave' | 'ogee';
  center?: { x: number; y: number };
}

export interface VibrationFieldProps {
  base: string;
  points: LightPoint[];
  lines: VibrationLines;
  /** 0–1: how dark the corners fall. */
  vignette?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const MAX_POINTS = 8;
const FIELD_SCALE = 0.25;
const DEFOCUS_PX = 26;
const GRAIN_AMPLITUDE = 78;
const GRAIN_OPACITY = 0.4;

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const OKLAB = `
vec3 toOk(vec3 c) {
  c = pow(c, vec3(2.2));
  float l = pow(0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b, 1.0 / 3.0);
  float m = pow(0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b, 1.0 / 3.0);
  float s = pow(0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b, 1.0 / 3.0);
  return vec3(0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
              1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
              0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 fromOk(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  vec3 lin = vec3(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
                  -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
                  -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
  return pow(clamp(lin, 0.0, 1.0), vec3(1.0 / 2.2));
}
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + 1.0), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 3; i++) { v += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; } return v; }
`;

const COLOR_FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uBase;
uniform int uCount;
uniform vec4 uPt[${MAX_POINTS}];
uniform vec3 uCol[${MAX_POINTS}];
uniform float uVignette;
out vec4 o;
${OKLAB}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes; uv.y = 1.0 - uv.y;
  float asp = uRes.x / uRes.y, sh = min(asp, 1.0);
  vec2 a = vec2(uv.x * asp, uv.y) / sh;
  float t = uTime * 0.03;
  vec2 w = vec2(fbm(a * 1.3 + t), fbm(a * 1.3 + 4.7 - t)) - 0.5;
  vec3 acc = toOk(uBase) * 0.02; float wsum = 0.02;
  for (int i = 0; i < ${MAX_POINTS}; i++) {
    if (i >= uCount) break;
    vec2 c = vec2(uPt[i].x * asp, uPt[i].y) / sh + vec2(sin(t * 2.0 + float(i)), cos(t * 1.7 + float(i) * 1.3)) * 0.03;
    vec2 d = a + w * 0.35 - c;
    // Sharpened weights: each light keeps its own colour instead of averaging to brown.
    float k = pow(exp(-dot(d, d) / (uPt[i].z * uPt[i].z)), 2.5);
    acc += toOk(uCol[i]) * k; wsum += k;
  }
  vec3 col = acc / wsum;
  vec2 q = uv - 0.5;
  float vig = smoothstep(0.25, 0.95, length(q * vec2(1.0, asp > 1.0 ? 1.0 : 1.0 / asp) * 1.25));
  col.x *= 1.0 - uVignette * vig;
  o = vec4(fromOk(col), 1.0);
}`;

const LINE_FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uCountL;
uniform float uPower;
uniform vec2 uNM;
uniform float uWave;
uniform vec4 uClear;
uniform float uCross;
uniform float uOpacity;
uniform float uKind;
uniform vec2 uNM2;
uniform float uMix;
uniform float uSign;
uniform float uPlate;
uniform float uSand;
uniform float uWarp;
uniform float uSeed;
uniform float uDpr;
uniform vec3 uDome;
uniform vec2 uDomeC;
uniform float uDomeStyle;
uniform float uWeight;
uniform vec4 uQuiet;
uniform float uQuietLevel;
out vec4 o;
float lhash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float lnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(lhash(i), lhash(i + vec2(1, 0)), u.x), mix(lhash(i + vec2(0, 1)), lhash(i + 1.0), u.x), u.y);
}
float lfbm(vec2 p) { return 0.6 * lnoise(p) + 0.3 * lnoise(p * 2.1 + 3.7) + 0.1 * lnoise(p * 4.3 + 9.1); }
float modeF(vec2 q, vec2 nm, float sg) {
  float pi = 3.14159265;
  return cos(nm.x * pi * q.x) * cos(nm.y * pi * q.y) + sg * cos(nm.y * pi * q.x) * cos(nm.x * pi * q.y);
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes; uv.y = 1.0 - uv.y;
  float asp = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * 2.0;
  vec2 cq0 = (uv - uClear.xy) / uClear.zw;
  float keep0 = smoothstep(0.75, 1.25, length(cq0));
  keep0 *= mix(uQuietLevel, 1.0, smoothstep(0.7, 1.2, length((uv - uQuiet.xy) / uQuiet.zw)));
  if (uKind > 1.5) {
    // Dome lattice (Isfahan): two families of logarithmic spirals crossing at right angles in
    // log-polar space, so the almond cells keep their shape and shrink toward the centre.
    float sh = min(asp, 1.0);
    vec2 c = (vec2(uv.x * asp, uv.y) - vec2(uDomeC.x * asp, uDomeC.y)) / sh;
    // Optional bend: slow noise pushes the lattice around, so no two cells share a shape.
    if (uWarp > 0.0) {
      vec2 wq = c * 0.8 + uSeed;
      c += uWarp * (vec2(lfbm(wq), lfbm(wq + vec2(7.3, 3.1))) - 0.5) * 2.0;
    }
    float rr = max(length(c), 1e-4);
    float N = uDome.x;
    float u = log(rr) * N / 6.2831853 - uTime * 0.006;
    float v = atan(c.y, c.x) * N / 6.2831853;
    float w = uDome.y;
    // Ogee lattice: two mirrored sine families along each radial row. Where they cross they pinch
    // into points, so every cell is an almond pointing at the centre, rows offset like the dome.
    float g1, g2;
    if (uDomeStyle > 0.5) {
      float a0 = v + uDome.z * u;
      g1 = a0 + w * sin(6.2831853 * u);
      g2 = a0 - w * sin(6.2831853 * u);
    } else {
      // Weave: spirals in both directions, each rippling along the other, so cells interlock.
      g1 = u + v + w * sin(6.2831853 * (u - v));
      g2 = u - v + w * sin(6.2831853 * (u + v));
    }
    float a1 = 0.0, a2 = 0.0;
    float fw1 = max(fwidth(g1), 1e-5), fw2 = max(fwidth(g2), 1e-5);
    a1 = 1.0 - clamp(abs(fract(g1 - 0.5) - 0.5) / fw1 - 0.5 * uDpr * uWeight + 0.5, 0.0, 1.0);
    a2 = 1.0 - clamp(abs(fract(g2 - 0.5) - 0.5) / fw2 - 0.5 * uDpr * uWeight + 0.5, 0.0, 1.0);
    // Where cells get smaller than a few pixels the lattice turns to noise: let it dissolve.
    float dense = 1.0 - smoothstep(0.06, 0.16, max(fw1, fw2));
    float a = max(a1, a2) * dense * keep0 * uOpacity;
    o = vec4(vec3(a), a);
    return;
  }
  if (uKind > 0.5) {
    // True Chladni plate: centred, square in screen space, sized in short sides.
    float sh = min(asp, 1.0);
    vec2 q = (vec2(uv.x * asp, uv.y) - vec2(asp, 1.0) * 0.5) / (sh * uPlate) + 0.5;
    // Bend the plate with slow noise: the figure stays recognisable but loses its mirror symmetry.
    float wt = uTime * 0.025;
    vec2 wq = q * 1.3 + uSeed;
    q += uWarp * (vec2(lfbm(wq + vec2(0.0, wt)), lfbm(wq + vec2(5.2, -wt))) - 0.5) * 2.0;
    float f = modeF(q, uNM, uSign);
    if (uMix > 0.0) f = mix(f, modeF(q, uNM2, uSign), uMix);
    // Exactly one CSS pixel wide (uDpr device pixels), anti-aliased over one device pixel.
    float d = abs(f) / max(fwidth(f), 1e-4);
    float line = 1.0 - clamp(d - 0.5 * uDpr * uWeight + 0.5, 0.0, 1.0);
    float halo = uSand > 0.0 ? exp(-pow(abs(f) / 0.09, 2.0)) * uSand : 0.0;
    float a = max(line, halo) * keep0 * uOpacity;
    o = vec4(vec3(a), a);
    return;
  }
  // Rounded-square distance in the surface's own proportions.
  vec2 ap = abs(p);
  float r = pow(pow(ap.x, uPower) + pow(ap.y, uPower), 1.0 / uPower);
  float X = uv.x * asp, Y = uv.y;
  float pi = 3.14159265;
  float plate = cos(uNM.x * pi * X) * cos(uNM.y * pi * Y) + cos(uNM.y * pi * X) * cos(uNM.x * pi * Y);
  // The plate term grows toward the edges so the centre squares up, as on a real plate.
  float f = r + uWave * plate * smoothstep(0.15, 1.0, r) + uTime * 0.004;
  float g = f * uCountL;
  float d = abs(fract(g - 0.5) - 0.5) / max(fwidth(g), 1e-4);
  float line = 1.0 - clamp(d - 0.15, 0.0, 1.0);
  float cross = 0.0;
  if (uCross > 0.5) {
    float cx = abs(p.x) / max(fwidth(p.x), 1e-4), cy = abs(p.y) / max(fwidth(p.y), 1e-4);
    cross = (1.0 - clamp(cx - 0.15, 0.0, 1.0)) + (1.0 - clamp(cy - 0.15, 0.0, 1.0));
    cross = min(cross, 1.0) * 0.55;
  }
  vec2 cq = (uv - uClear.xy) / uClear.zw;
  float keep = smoothstep(0.75, 1.25, length(cq));
  float a = max(line, cross) * keep * uOpacity;
  o = vec4(vec3(1.0) * a, a);
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

function program(gl: WebGL2RenderingContext, frag: string): WebGLProgram | null {
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error('VibrationField shader:', gl.getShaderInfoLog(s));
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  gl.useProgram(p);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(p, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return p;
}

export function VibrationField({ base, points, lines, vignette = 0.45, className = '', style, children }: VibrationFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

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

  useEffect(() => {
    const root = rootRef.current;
    const cc = colorRef.current;
    const lc = lineRef.current;
    if (!root || !cc || !lc || !size) return;
    const cgl = cc.getContext('webgl2', { antialias: false });
    const lgl = lc.getContext('webgl2', { antialias: false, premultipliedAlpha: true });
    if (!cgl || !lgl) return;
    const dpr = window.devicePixelRatio || 1;

    cc.width = Math.max(16, Math.round(size.w * 1.16 * FIELD_SCALE));
    cc.height = Math.max(16, Math.round(size.h * 1.16 * FIELD_SCALE));
    const cp = program(cgl, COLOR_FRAG);
    lc.width = Math.max(1, Math.round(size.w * dpr));
    lc.height = Math.max(1, Math.round(size.h * dpr));
    const lp = program(lgl, LINE_FRAG);
    if (!cp || !lp) return;

    const cu = (n: string) => cgl.getUniformLocation(cp, n);
    cgl.useProgram(cp);
    cgl.uniform2f(cu('uRes'), cc.width, cc.height);
    cgl.uniform3fv(cu('uBase'), hexToRgb(base));
    const pts = points.slice(0, MAX_POINTS);
    cgl.uniform1i(cu('uCount'), pts.length);
    // The colour canvas overhangs the element by 8% each side; map points into it.
    cgl.uniform4fv(cu('uPt'), new Float32Array(pts.flatMap((p) => [(p.x + 0.08) / 1.16, (p.y + 0.08) / 1.16, p.r, 0])));
    cgl.uniform3fv(cu('uCol'), new Float32Array(pts.flatMap((p) => hexToRgb(p.color))));
    cgl.uniform1f(cu('uVignette'), vignette);
    cgl.viewport(0, 0, cc.width, cc.height);

    const lu = (n: string) => lgl.getUniformLocation(lp, n);
    lgl.useProgram(lp);
    lgl.uniform2f(lu('uRes'), lc.width, lc.height);
    lgl.uniform1f(lu('uCountL'), lines.count);
    lgl.uniform1f(lu('uPower'), lines.power ?? 4);
    lgl.uniform2f(lu('uNM'), lines.n ?? 3, lines.m ?? 5);
    lgl.uniform1f(lu('uWave'), lines.wave ?? 0.025);
    const cl = lines.clear ?? { x: 0.5, y: 0.5, rx: 0.32, ry: 0.32 };
    lgl.uniform4f(lu('uClear'), cl.x, cl.y, cl.rx, cl.ry);
    lgl.uniform1f(lu('uCross'), lines.crosshair === false ? 0 : 1);
    lgl.uniform1f(lu('uOpacity'), lines.opacity ?? 0.5);
    lgl.uniform1f(lu('uKind'), lines.kind === 'dome' ? 2 : lines.kind === 'plate' ? 1 : 0);
    lgl.uniform3f(lu('uDome'), lines.cells ?? 28, lines.ogee ?? (lines.dome === 'ogee' ? 0.5 : 0.13), lines.twist ?? 0);
    lgl.uniform1f(lu('uWeight'), lines.weight ?? 1);
    const qz = lines.quiet ?? { x: 0.5, y: 0.5, rx: 0.0001, ry: 0.0001, level: 1 };
    lgl.uniform4f(lu('uQuiet'), qz.x, qz.y, qz.rx, qz.ry);
    lgl.uniform1f(lu('uQuietLevel'), qz.level);
    lgl.uniform1f(lu('uDomeStyle'), lines.dome === 'ogee' ? 1 : 0);
    lgl.uniform2f(lu('uDomeC'), lines.center?.x ?? 0.5, lines.center?.y ?? 0.5);
    lgl.uniform2f(lu('uNM2'), lines.n2 ?? 0, lines.m2 ?? 0);
    lgl.uniform1f(lu('uMix'), lines.mix ?? 0);
    lgl.uniform1f(lu('uSign'), lines.sign ?? -1);
    lgl.uniform1f(lu('uPlate'), lines.plate ?? 1);
    lgl.uniform1f(lu('uSand'), lines.sand ?? 0);
    lgl.uniform1f(lu('uWarp'), lines.warp ?? 0);
    lgl.uniform1f(lu('uSeed'), lines.seed ?? 0);
    lgl.uniform1f(lu('uDpr'), dpr);
    lgl.viewport(0, 0, lc.width, lc.height);
    lgl.clearColor(0, 0, 0, 0);

    const cT = cu('uTime');
    const lT = lu('uTime');
    let time = 0;
    const draw = () => {
      cgl.uniform1f(cT, time);
      cgl.drawArrays(cgl.TRIANGLES, 0, 3);
      lgl.clear(lgl.COLOR_BUFFER_BIT);
      lgl.uniform1f(lT, time);
      lgl.drawArrays(lgl.TRIANGLES, 0, 3);
    };
    draw();

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let last = 0;
    let visible = false;
    const tick = (now: number) => {
      raf = 0;
      if (!visible || reduce.matches) return;
      raf = requestAnimationFrame(tick);
      if (now - last < 1000 / 24) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      time += dt;
      draw();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduce.matches) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(root);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [size, base, points, lines, vignette]);

  return (
    <div ref={rootRef} className={`relative isolate overflow-hidden ${className}`} style={{ background: base, ...style }}>
      <canvas
        ref={colorRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[8%] -z-10 h-[116%] w-[116%] max-w-none"
        style={{ filter: `blur(${DEFOCUS_PX}px)` }}
      />
      <canvas
        ref={grainRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full max-w-none mix-blend-overlay"
        style={{ opacity: GRAIN_OPACITY }}
      />
      <canvas ref={lineRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full max-w-none" />
      {children}
    </div>
  );
}

export default VibrationField;
