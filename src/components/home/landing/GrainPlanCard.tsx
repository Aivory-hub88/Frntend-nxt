'use client';

import type { ReactNode } from 'react';
import { BokehGradient, type BokehScene, type ChladniFigure } from '@/components/ui/BokehGradient';

/* One scene per card, each a different defocused "photograph": its own shape
   (field, horizon, curtain, aurora), its own six colours from shadow to
   highlight, and on some cards a Chladni figure in white hairlines. */

export interface PlanWorld {
  scene: BokehScene;
  chladni?: ChladniFigure;
}

/** Fresh: deep emerald and jade under a clear sky blue, a cool mint glint. */
export const WORLD_FRESH: PlanWorld = {
  scene: { colors: ['#032a22', '#05624a', '#0a9468', '#1fae78', '#1a8fc0', '#8fe0c0'], mode: 'field', scale: 0.8, seed: 3.1, light: 0.15, shadow: 0.5, exposure: 0.92 },
};

/** Dusk: navy sky over a slate haze, an orange horizon below. */
export const WORLD_DUSK: PlanWorld = {
  scene: { colors: ['#06132b', '#0f3a78', '#2c5ea8', '#6f7f9e', '#de621e', '#f29a45'], mode: 'horizon', scale: 0.7, seed: 7.4, light: 0.15, shadow: 0.35 },
  chladni: { n: 1, m: 2, cells: 2, level: 0.6, opacity: 0.35 },
};

/** Sunset: plum and deep reds into vermilion, a lavender cloud, a peach light leak. */
export const WORLD_SUNSET: PlanWorld = {
  scene: { colors: ['#561230', '#b3201f', '#d4321f', '#e45a28', '#8a6aa8', '#ef9a5c'], mode: 'field', scale: 0.85, seed: 1.7, light: 0.15, shadow: 0.45, exposure: 0.92 },
  chladni: { n: 2, m: 3, cells: 1.5, level: 0.5, opacity: 0.55 },
};

/** Curtain: folds of red, orange, lilac-grey and pink. */
export const WORLD_CURTAIN: PlanWorld = {
  scene: { colors: ['#7a1c36', '#d63a2a', '#e8703a', '#7f80a6', '#c9506f', '#eea062'], mode: 'bands', scale: 0.8, seed: 4.2, light: 0.15, shadow: 0.4, exposure: 0.86 },
};

/** Aurora: midnight indigo with violet and pink light streaks. */
export const WORLD_AURORA: PlanWorld = {
  scene: { colors: ['#12143f', '#262c86', '#5a46b8', '#8f74dc', '#de78b6', '#eec4e2'], mode: 'aurora', scale: 0.8, seed: 2.6, light: 0.15, shadow: 0.45 },
};

/** Ember night: near-black navy and violet with red embers and an amber glow. */
export const WORLD_EMBER: PlanWorld = {
  scene: { colors: ['#07071a', '#141a4a', '#222c74', '#3b2a80', '#b8301f', '#ef7a2a'], mode: 'field', scale: 0.9, seed: 9.3, light: 0.15, shadow: 0.6, exposure: 0.92 },
  chladni: { n: 2, m: 5, cells: 1, level: 0.3, opacity: 0.4 },
};

function CheckCircle() {
  return (
    <svg className="mt-[3px] h-[18px] w-[18px] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="10" cy="10" r="8.3" />
      <path d="M6.6 10.2l2.3 2.3 4.6-4.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface GrainPlanFeature {
  text: string;
  strong?: boolean;
}

export function GrainPlanCard({
  world,
  badge,
  title,
  subtitle,
  description,
  price,
  priceSuffix,
  priceSmall = false,
  note,
  features,
  cta,
  onCta,
}: {
  world: PlanWorld;
  badge?: string;
  title: string;
  subtitle?: ReactNode;
  description?: string;
  price: string;
  priceSuffix: string;
  /** Long prices (IDR) step the size down so they stay on one line. */
  priceSmall?: boolean;
  note?: string;
  features: GrainPlanFeature[];
  cta: string;
  onCta: () => void;
}) {
  return (
    <BokehGradient
      scene={world.scene}
      chladni={world.chladni}
      className="flex flex-col rounded-[28px] p-7 text-white shadow-[0_18px_44px_rgba(20,24,60,0.18)] md:p-8"
    >
      <div className="flex flex-col items-start md:min-h-[132px]">
        <h3 className="whitespace-pre-line text-[28px] font-normal leading-[1.08] tracking-[-0.02em] md:text-[30px]">{title}</h3>
        {subtitle && <div className="mt-3 text-[13px] font-medium leading-[1.35] text-white/70">{subtitle}</div>}
        {badge && (
          <span className="mt-4 inline-flex items-center rounded-full border border-white/80 px-3.5 py-1 text-[13px] font-medium">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-8 flex items-baseline gap-2 whitespace-nowrap">
        <span className={`${priceSmall ? 'text-[34px] md:text-[38px]' : 'text-[46px] md:text-[52px]'} font-normal leading-none tracking-[-0.02em]`}>
          {price}
        </span>
        <span className="text-[17px] text-white/75">{priceSuffix}</span>
      </div>
      {note && <p className="mt-2 text-[13px] font-medium text-white/65">{note}</p>}

      {description && <p className="mt-7 text-[15px] leading-[1.45] text-white/85">{description}</p>}

      <ul className="mt-7 flex-grow space-y-3 text-[15px] leading-[1.4]">
        {features.map((f) => (
          <li key={f.text} className={`flex gap-3 ${f.strong ? 'font-semibold text-white' : 'text-white/85'}`}>
            <span className="text-white/70">
              <CheckCircle />
            </span>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onCta}
        className="mt-10 w-full rounded-2xl bg-white px-6 py-4 text-center text-[16px] font-medium text-[#0f1b3d] transition-[background-color,transform] duration-150 hover:bg-white/90 active:scale-[0.98]"
      >
        {cta}
      </button>
    </BokehGradient>
  );
}

export default GrainPlanCard;
