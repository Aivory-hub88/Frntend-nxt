/* Parametric facade ornaments, drawn as white hairlines over a gradient card.
   Pure SVG, deterministic (no randomness), so server and client render the same.

   - `lattice`: a diamond grid of lens-shaped openings whose size swells and shrinks with a
     slow wave field, and whose rows drift sideways (the Broad / KAFD station facades).
   - `ribbons`: near-vertical lines bent by two crossing waves whose amplitude grows down the
     card, like folded fins on a parametric wall. */

export type ParametricKind = 'lattice' | 'ribbons';

const W = 260;
const H = 700;
const f = (n: number) => n.toFixed(1);

function lattice(): string {
  const dx = 34;
  const dy = 22;
  const out: string[] = [];
  for (let j = -2; j * dy < H + 2 * dy; j++) {
    for (let i = -2; i * dx < W + 2 * dx; i++) {
      const bx = i * dx + (j % 2 === 0 ? 0 : dx / 2);
      const by = j * dy;
      // Field: one long diagonal swell plus a slower vertical breath.
      const field = Math.sin(bx * 0.018 + by * 0.011) * 0.6 + Math.sin(by * 0.006 - 0.8) * 0.4;
      const s = 0.42 + 0.56 * (0.5 + 0.5 * field);
      const x = bx + Math.sin(by * 0.012) * 10;
      const y = by;
      const hw = (dx / 2) * s * 1.02;
      const hh = (dy / 2) * s * 1.0;
      // Lens: pointed left and right, curved top and bottom.
      out.push(`M${f(x - hw)} ${f(y)}Q${f(x)} ${f(y - hh * 2)} ${f(x + hw)} ${f(y)}Q${f(x)} ${f(y + hh * 2)} ${f(x - hw)} ${f(y)}Z`);
    }
  }
  return out.join('');
}

function ribbons(): string {
  const out: string[] = [];
  const gap = 13;
  for (let x0 = -30; x0 < W + 30; x0 += gap) {
    let d = '';
    for (let y = -10; y <= H + 10; y += 10) {
      const amp = 6 + 22 * (y / H);
      const x = x0 + Math.sin(y * 0.011 + x0 * 0.02) * amp + Math.sin(y * 0.027 - x0 * 0.035) * amp * 0.35;
      d += `${y === -10 ? 'M' : 'L'}${f(x)} ${f(y)}`;
    }
    out.push(d);
  }
  return out.join('');
}

export function ParametricPattern({ kind = 'lattice', opacity = 0.2, className = '' }: { kind?: ParametricKind; opacity?: number; className?: string }) {
  const d = kind === 'lattice' ? lattice() : ribbons();
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{
        opacity,
        // Shows at the top (behind the wordmark) and the bottom edge; nearly gone behind the rows of copy.
        maskImage: 'linear-gradient(180deg, #000 0%, rgba(0,0,0,.5) 14%, rgba(0,0,0,.1) 26%, rgba(0,0,0,.1) 78%, rgba(0,0,0,.7) 100%)',
        WebkitMaskImage: 'linear-gradient(180deg, #000 0%, rgba(0,0,0,.5) 14%, rgba(0,0,0,.1) 26%, rgba(0,0,0,.1) 78%, rgba(0,0,0,.7) 100%)',
      }}
    >
      <path d={d} fill="none" stroke="#fff" strokeWidth={0.8} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

export default ParametricPattern;
