/**
 * Technical drawings for the hero cards: white hairlines on a gradient tile,
 * isometric (30deg) or flat 2D, one accent part filled solid.
 *
 * They are plain SVG strings built once at module load from fixed numbers, so
 * they are static markup (no user input, nothing to sanitise) and every card
 * that shows one costs a single DOM subtree, not a React tree.
 */

const SOLID = 'rgba(255,255,255,.92)';
const FACE = {
  solid: { t: SOLID, l: 'rgba(255,255,255,.55)', r: 'rgba(255,255,255,.72)' },
  glass: { t: 'rgba(255,255,255,.34)', l: 'rgba(255,255,255,.14)', r: 'rgba(255,255,255,.22)' },
  silver: { t: 'rgba(255,255,255,.6)', l: 'rgba(255,255,255,.3)', r: 'rgba(255,255,255,.42)' },
  node: { t: SOLID, l: 'rgba(255,255,255,.2)', r: 'rgba(255,255,255,.36)' },
};
type Faces = { t: string; l: string; r: string };

/** Isometric helpers with the drawing's ground line at `oy` (viewBox 190x190). */
function iso(oy: number) {
  const ox = 95;
  const P = (x: number, y: number, z: number) =>
    `${(ox + (x - y) * 0.866).toFixed(1)},${(oy + (x + y) * 0.5 - z).toFixed(1)}`;
  const poly = (pts: string[], style = '') =>
    `<polygon points="${pts.join(' ')}"${style}/>`;
  const box = (x: number, y: number, z: number, w: number, d: number, h: number, f?: Faces) => {
    const st = (k: keyof Faces) => (f ? ` style="fill:${f[k]}"` : '');
    return (
      poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], st('l')) +
      poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], st('r')) +
      poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], st('t'))
    );
  };
  const line = (pts: string[], dashed = false) =>
    `<polyline points="${pts.join(' ')}" fill="none"${dashed ? ' stroke-dasharray="2 3"' : ''}/>`;
  return { P, poly, box, line };
}

const wrap = (inner: string) =>
  `<svg class="hero-dr" viewBox="0 0 190 190" aria-hidden="true" focusable="false">${inner}</svg>`;

/** Tangled lines pass a gate and leave parallel. */
function streamline(): string {
  const ys = [70, 88, 106, 124];
  const st = [[40, 150], [150, 52], [96, 168], [60, 60]];
  let s = '';
  for (let i = 0; i < 4; i++) {
    s += `<path d="M14 ${st[i][0]}C44 ${st[i][1]} 58 ${190 - st[i][1]} 88 ${ys[i]}H176" fill="none"/>`;
  }
  s += `<rect x="84" y="56" width="14" height="82" rx="7" style="fill:${SOLID}"/>`;
  for (let i = 0; i < 4; i++) s += `<circle cx="176" cy="${ys[i]}" r="2.4" style="fill:#fff"/>`;
  return wrap(s + '<path d="M112 150H176M112 145v10M176 145v10" fill="none"/>');
}

/** Three isometric nodes on a dashed plane, linked by routed paths. */
function flow(): string {
  const { P, poly, box, line } = iso(112);
  let s = poly([P(-50, -50, 0), P(50, -50, 0), P(50, 50, 0), P(-50, 50, 0)], ' stroke-dasharray="2 3"');
  s += line([P(-20, -30, 0), P(2, -30, 0), P(2, -8, 0)], true) + line([P(14, 4, 0), P(32, 4, 0), P(32, 20, 0)], true);
  return wrap(s + box(-44, -40, 0, 22, 22, 9) + box(-9, -9, 0, 22, 22, 9) + box(21, 21, 0, 22, 22, 9, FACE.node));
}

/** Padlock, front view, with dimension lines and a centre line. */
function lock(): string {
  return wrap(
    '<path d="M95 30V172" stroke-dasharray="7 3 1 3" fill="none"/>' +
      '<path d="M71 92V74a24 24 0 0 1 48 0v18" fill="none"/><path d="M79 92V74a16 16 0 0 1 32 0v18" fill="none"/>' +
      `<rect x="58" y="92" width="74" height="56" rx="8" style="fill:${SOLID}"/>` +
      '<circle cx="95" cy="114" r="5.5" style="fill:#1d4a9a;stroke:#1d4a9a"/>' +
      '<path d="M95 118v13" style="stroke:#1d4a9a;stroke-width:2.2"/>' +
      '<path d="M58 164H132M58 159v10M132 159v10M146 92V148M141 92h10M141 148h10" fill="none"/>',
  );
}

/** Modules inside a wireframe cube: the data stays within its boundary. */
function vault(): string {
  const { P, box, line } = iso(156);
  let s = box(-38, -38, 0, 76, 76, 3);
  s += line([P(-38, -38, 3), P(-38, -38, 73)], true) + line([P(-38, -38, 73), P(38, -38, 73)], true) + line([P(-38, -38, 73), P(-38, 38, 73)], true);
  s += box(-28, -28, 3, 24, 32, 9, FACE.solid) + box(-22, -20, 12, 10, 10, 26, FACE.glass) + box(6, -28, 3, 22, 10, 42, FACE.silver);
  s += box(-26, 12, 3, 18, 14, 16, FACE.glass) + box(4, -6, 3, 24, 30, 22, FACE.solid);
  return wrap(s + box(-38, -38, 3, 76, 76, 70));
}

/** A log spine: every action is an entry, one is checked. */
function audit(): string {
  const ys = [36, 66, 96, 126];
  let s = '<path d="M40 22V160" stroke-dasharray="2 3" fill="none"/>';
  ys.forEach((y, i) => {
    const on = i === 2;
    s += `<circle cx="40" cy="${y}" r="4.5" style="fill:${on ? '#fff' : 'transparent'}"/><path d="M45 ${y}H58" fill="none"/>`;
    s += `<rect x="58" y="${y - 11}" width="108" height="22" rx="5"${on ? ` style="fill:${SOLID}"` : ''}/>`;
    s += on
      ? `<path d="M68 ${y}l5 5 9-10" style="stroke:#1c1e26;stroke-width:1.8" fill="none"/><path d="M92 ${y}H150" style="stroke:#1c1e26"/>`
      : `<path d="M68 ${y}H${118 + i * 12}" fill="none"/>`;
  });
  return wrap(s + '<path d="M176 25V137M171 25h10M171 137h10" fill="none"/>');
}

export const DRAWINGS = {
  streamline: streamline(),
  flow: flow(),
  lock: lock(),
  vault: vault(),
  audit: audit(),
};
