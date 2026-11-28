/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react';
import { GlitchFloraScene } from '@/components/ui/GlitchFloraScene';
import s from './landing.module.css';

export type GrainPalette = { image: string; fallback: string };

export const PALETTES = {
  ember: {
    image: '/landing/flora/banner-cervo-clean.webp?v=20261128',
    fallback: 'linear-gradient(100deg, #6f9996 0%, #b8947d 45%, #df7848 78%, #d23b18 100%)',
  },
  iris: {
    image: '/landing/flora/banner-workspace-clean.webp?v=20261128',
    fallback: 'linear-gradient(104deg, #6f86e0 0%, #9aa8ec 35%, #b468d4 70%, #8636bf 100%)',
  },
} satisfies Record<string, GrainPalette>;

export default function GrainBanner({ palette, lockup, lockupWidth, lockupRatio, copy }: {
  palette: GrainPalette;
  lockup: string;
  /** lockup width in % of the banner */
  lockupWidth: number;
  /** lockup intrinsic width / height */
  lockupRatio: number;
  copy: ReactNode;
}) {
  return (
    <div
      className={s.gb}
      style={{
        backgroundImage: `url(${palette.image}), ${palette.fallback}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <GlitchFloraScene
        imageSrc={palette.image}
        className="absolute inset-0 z-0 h-full w-full"
      />
      <img
        className={`${s.gbLockup} z-10`}
        src={lockup}
        alt=""
        style={{ width: `${lockupWidth}%`, aspectRatio: lockupRatio }}
      />
      <p className={`${s.gbCopy} z-10`}>{copy}</p>
    </div>
  );
}
