/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from 'react';
import s from './landing.module.css';

/* Orbit grainy gradient, as in the product films (promo-video/src/cervo/kit.tsx, World):
   a five-stop base (0 / 30 / 55 / 78 / 100 %), five big soft blobs parked on the edges drifting
   a few percent, optional motion-blurred light streaks, then crisp 128 px grain at one noise pixel
   per screen pixel. CSS only: the drift is keyframes, stopped under prefers-reduced-motion. */

/** y / h in % of the banner, rot in deg */
type Streak = { y: number; h: number; rot: number; c: string; o: number };
export type GrainPalette = { angle: number; stops: string[]; blobs: string[]; grain: number; streaks?: Streak[] };

// Three colours per banner, like the ElevenLabs launch films.
export const PALETTES = {
  // ember (the user's 2026-10-26 reference): warm cream along the top, a muted teal band under the lockup,
  // coral-orange through the copy, deepening to red-orange low right
  ember: {
    angle: 100,
    stops: ['#6f9996', '#a8948a', '#df7848', '#e0603a', '#d23b18'],
    blobs: ['#f2ede2', '#dcc0a6', '#5e9692', '#df2f0e', '#efa071'],
    grain: 0.45,
    streaks: [
      { y: 8, h: 14, rot: -2, c: '#fff6e8', o: 0.4 },
      { y: 30, h: 6, rot: -3, c: '#9cc3c0', o: 0.35 },
    ],
  },
  // iris: periwinkle under the lockup, pink-lavender light across the middle, magenta deepening under the copy
  iris: {
    angle: 104,
    stops: ['#6f86e0', '#9aa8ec', '#b468d4', '#9a42cc', '#6a27ad'],
    blobs: ['#7d92e8', '#f3b2dc', '#8ea4ee', '#9b3fcf', '#c47ddc'],
    grain: 0.34,
    streaks: [
      { y: 12, h: 16, rot: -7, c: '#ffd6ef', o: 0.5 },
      { y: 30, h: 8, rot: -5, c: '#f5a9dc', o: 0.55 },
      { y: 44, h: 4, rot: -4, c: '#ffffff', o: 0.3 },
      { y: 84, h: 3, rot: 1, c: '#b13fc6', o: 0.75 },
    ],
  },
} satisfies Record<string, GrainPalette>;

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
const blob = (c: string) =>
  `radial-gradient(closest-side, ${c} 0%, ${rgba(c, 0.78)} 25%, ${rgba(c, 0.45)} 50%, ${rgba(c, 0.16)} 75%, transparent 100%)`;
const streak = (c: string) =>
  `linear-gradient(90deg, transparent 0%, ${rgba(c, 0.5)} 25%, ${c} 55%, ${rgba(c, 0.4)} 80%, transparent 100%)`;

export default function GrainBanner({ palette, lockup, lockupWidth, lockupRatio, copy }: {
  palette: GrainPalette;
  lockup: string;
  /** lockup width in % of the banner */
  lockupWidth: number;
  /** lockup intrinsic width / height */
  lockupRatio: number;
  copy: ReactNode;
}) {
  const [a, b, c, d, e] = palette.stops;
  const base = `linear-gradient(${palette.angle}deg, ${a} 0%, ${b} 30%, ${c} 55%, ${d} 78%, ${e} 100%)`;
  return (
    <div className={s.gb} style={{ background: base }}>
      {palette.blobs.map((col, i) => (
        <i key={i} className={`${s.gbBlob} ${s[`gbB${i + 1}`]}`} style={{ background: blob(col) }} />
      ))}
      {palette.streaks?.map((st, i) => (
        <i
          key={`s${i}`}
          className={s.gbStreak}
          style={{
            top: `${st.y - st.h / 2}%`,
            height: `${st.h}%`,
            opacity: st.o,
            background: streak(st.c),
            '--rot': `${st.rot}deg`,
            animationDelay: `${-i * 5}s`,
            animationDirection: i % 2 ? 'alternate-reverse' : 'alternate',
          } as CSSProperties}
        />
      ))}
      <i className={s.gbGrain} style={{ opacity: palette.grain }} />
      <img
        className={s.gbLockup}
        src={lockup}
        alt=""
        style={{ width: `${lockupWidth}%`, aspectRatio: lockupRatio }}
      />
      <p className={s.gbCopy}>{copy}</p>
    </div>
  );
}
