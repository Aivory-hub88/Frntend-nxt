'use client';

import type { ReactNode } from 'react';
import { BokehGradient, type BokehScene, type LeafFigure } from '@/components/ui/BokehGradient';

/* One "tri" scene per card (see BokehGradient): three colours in 60/30/10 —
   a dominant field, one large soft shape, a small glow in the far corner —
   mixed in Oklab, with a dark seam where the first two meet. On the landing
   the card stays neutral and the scene sits in a window behind title and
   price, so it reads as one colour moment and the copy below stays dark. */

export interface PlanWorld {
  scene: BokehScene;
  figure?: LeafFigure;
}

/** colours: seam, dominant (60), secondary (30), accent (10), sheen. */
const tri = (
  seam: string,
  dominant: string,
  secondary: string,
  accent: string,
  sheen: string,
  seed: number,
  figure?: LeafFigure,
): PlanWorld => ({
  scene: { colors: [seam, dominant, secondary, accent, sheen, sheen], mode: 'tri', scale: 0.55, seed, light: 0.35, shadow: 0.55 },
  figure,
});

/** Aivory's own trio: deep blue field, a periwinkle-steel shape, a warm orange glow. The shape
    is dark enough for white copy (4.8:1); the old silver survives only as the thin sheen. */
const AIVORY_BLUE = ['#0a1838', '#1d4a9a', '#5a6fb0', '#e46a24', '#9aaedc'] as const;
const INDIGO_ORCHID_PEACH = ['#160f40', '#3a3aa8', '#b05ad0', '#f2a07a', '#f0d0f0'] as const;
/** Dusty teal sky and burnt orange with an amber glow: the "for Government" dusk crossed with the
    Cervo banner's teal and coral, so Enterprise reads apart from Operational's blue. */
const TEAL_EMBER_AMBER = ['#0f1a1c', '#4f6f7a', '#c4562a', '#e8a850', '#f2ede2'] as const;

// Step 1 keeps its own colour scenes; Step 2 uses the tri scenes. Both sit in a window,
// and every card carries the weave figure, its centre and bend different on each card.
/** Fresh: deep emerald and jade under a clear sky blue, a cool mint glint. */
export const WORLD_FRESH: PlanWorld = {
  scene: { colors: ['#032a22', '#05624a', '#0a9468', '#1fae78', '#1a8fc0', '#8fe0c0'], mode: 'field', scale: 0.8, seed: 3.1, light: 0.15, shadow: 0.5, exposure: 0.92 },
  figure: { kind: 'weave', origin: [1.2, 0.2], seed: 2 },
};

/** Dusk: navy sky over a slate haze, an orange horizon below. */
export const WORLD_DUSK: PlanWorld = {
  scene: { colors: ['#06132b', '#0f3a78', '#2c5ea8', '#6f7f9e', '#de621e', '#f29a45'], mode: 'horizon', scale: 0.7, seed: 7.4, light: 0.15, shadow: 0.35 },
  figure: { kind: 'weave', origin: [1.2, 0.6], seed: 3 },
};

/** Platinum: deep violet into light purple, platinum light, a touch of red-orange. */
export const WORLD_PLATINUM: PlanWorld = {
  scene: { colors: ['#221a44', '#4a3e86', '#7866b2', '#a7a3bd', '#dc5634', '#e4e3ec'], mode: 'field', scale: 0.85, seed: 1.7, light: 0.42, shadow: 0.45, exposure: 0.86 },
  figure: { kind: 'weave', origin: [1.2, 0.1], seed: 4 },
};

export const STEP_TWO_WORLDS = [
  tri(...AIVORY_BLUE, 1.3, { kind: 'weave', origin: [1.05, 0.3], seed: 5 }),
  tri(...INDIGO_ORCHID_PEACH, 2.7, { kind: 'weave', origin: [1.05, 0.75], seed: 6 }),
  tri(...TEAL_EMBER_AMBER, 4.1, { kind: 'weave', origin: [1.05, 0.2], seed: 7 }),
];

function CheckCircle() {
  return (
    <svg className="mt-[3px] h-[18px] w-[18px] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="10" cy="10" r="8.3" />
      <path d="M6.6 10.2l2.3 2.3 4.6-4.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Inline, not the `grid` class: the landing's GSAP reveal hides every
// `main .grid` until it scrolls in, which would fade each card part separately.
const SUBGRID = { display: 'grid' } as const;

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
  priceSuffixStrong = false,
  note,
  features,
  cta,
  onCta,
  surface = 'full',
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
  /** Bold suffix, for a count that matters to the buyer ("3 uses"). */
  priceSuffixStrong?: boolean;
  note?: string;
  features: GrainPlanFeature[];
  cta: string;
  onCta: () => void;
  /** 'full' paints the whole card; 'window' keeps the card neutral and puts the gradient in a tile behind title and price, the way ElevenLabs frames its one colour moment. */
  surface?: 'full' | 'window';
}) {
  const win = surface === 'window';
  const head = (
    <>
      {/* The badge sits in the corner so every title starts on the same line. */}
      <div className="relative">
        {badge && (
          <span className="absolute right-0 top-0.5 inline-flex items-center whitespace-nowrap rounded-full border border-white/80 px-3 py-[3px] text-[12px] font-medium">
            {badge}
          </span>
        )}
        <h3 className={`whitespace-pre-line text-[28px] font-normal leading-[1.08] tracking-[-0.02em] md:text-[30px] ${badge ? 'pr-[6.5rem]' : ''}`}>
          {title}
        </h3>
      </div>

      <div>{subtitle && <div className="mt-3 max-w-[300px] text-[14px] leading-[1.4] text-white/75">{subtitle}</div>}</div>

      <div className="pt-9">
        <div className="flex items-baseline gap-2 whitespace-nowrap">
          <span className={`${priceSmall ? 'text-[34px] md:text-[38px]' : 'text-[46px] md:text-[52px]'} font-normal leading-none tracking-[-0.02em]`}>
            {price}
          </span>
          <span className={`text-[17px] ${priceSuffixStrong ? 'font-bold text-white' : 'text-white/75'}`}>{priceSuffix}</span>
        </div>
        {note && <p className="mt-2 text-[13px] font-bold text-white/85">{note}</p>}
      </div>
    </>
  );
  const ink = win
    ? { body: 'text-[#4e4e4e]', item: 'text-[#292524]', strong: 'font-semibold text-[#0c0a09]', tick: 'text-[#777169]', rule: 'border-[#e2dfdb]', btn: 'bg-[#0c0a09] text-white hover:bg-[#292524]' }
    : { body: 'text-white/80', item: 'text-white/85', strong: 'font-semibold text-white', tick: 'text-white/70', rule: 'border-white/20', btn: 'bg-white text-[#0f1b3d] hover:bg-white/90' };
  const body = (
    <>
      <div>{description && <p className={`pt-4 text-[15px] leading-[1.5] ${ink.body}`}>{description}</p>}</div>

      <ul className={`mt-7 space-y-3 border-t pt-6 text-[15px] leading-[1.4] ${ink.rule}`}>
        {features.map((f) => (
          <li key={f.text} className={`flex gap-3 ${f.strong ? ink.strong : ink.item}`}>
            <span className={ink.tick}>
              <CheckCircle />
            </span>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-end pt-10">
        <button
          type="button"
          onClick={onCta}
          className={`w-full rounded-2xl px-6 py-4 text-center text-[16px] font-medium transition-[background-color,transform] duration-150 active:scale-[0.98] ${ink.btn}`}
        >
          {cta}
        </button>
      </div>
    </>
  );

  // Six rows on a subgrid of the cards' grid, so title, sub-headline, price,
  // description, features and CTA line up across every card in the row. The
  // parent grid must leave rows to auto-placement; each card spans six.
  if (win) {
    return (
      <div className="row-span-6 grid-cols-[minmax(0,1fr)] grid-rows-subgrid gap-y-0 rounded-[28px] bg-[#f0efed] p-2 pb-8" style={SUBGRID}>
        <BokehGradient
          scene={world.scene}
          figure={world.figure}
          className="row-span-3 grid-rows-subgrid gap-y-0 rounded-[22px] p-6 pb-7 text-white md:p-7"
          style={SUBGRID}
        >
          {head}
        </BokehGradient>
        <div className="row-span-3 grid-rows-subgrid gap-y-0 px-5 md:px-6" style={SUBGRID}>{body}</div>
      </div>
    );
  }

  return (
    <BokehGradient
      scene={world.scene}
      figure={world.figure}
      className="row-span-6 grid-cols-[minmax(0,1fr)] grid-rows-subgrid gap-y-0 rounded-[28px] p-7 text-white shadow-[0_18px_44px_rgba(20,24,60,0.18)] md:p-8"
      style={SUBGRID}
    >
      {head}
      {body}
    </BokehGradient>
  );
}

export default GrainPlanCard;