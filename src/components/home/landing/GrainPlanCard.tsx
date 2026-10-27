'use client';

import type { ReactNode } from 'react';
import { GrainGradient, type GrainPalette } from '@/components/ui/GrainGradient';

/* Card worlds for the landing pricing band. No contours: the colour field and
   grain carry the card, the way the reference plan cards do. */

/** Indigo field, a warm ember rising in the bottom-right corner. */
export const PLAN_INDIGO: GrainPalette = {
  base: 'linear-gradient(160deg, #4450c4 0%, #4f5fd0 40%, #2e3394 78%, #b8442c 100%)',
  blobs: ['#7282e4', '#3b3fa6', '#5d6ad8', '#25288a', '#e0582c'],
};

/** Sky blue on the left breaking into deep red and orange. */
export const PLAN_SKY_EMBER: GrainPalette = {
  base: 'linear-gradient(120deg, #4a8ee0 0%, #3f7fd6 32%, #c23a22 58%, #a5281a 82%, #e8742a 100%)',
  blobs: ['#5c9ee9', '#c8341c', '#4a86d8', '#9e2418', '#ee7a2c'],
};

/** Indigo and plum along the top, red, orange and amber below. */
export const PLAN_EMBER: GrainPalette = {
  base: 'linear-gradient(170deg, #3d43a4 0%, #8c2f5a 28%, #d0402a 52%, #b8241f 72%, #f29a1f 100%)',
  blobs: ['#4a4fb8', '#2a1e44', '#e2452a', '#f0a21f', '#a51d1d'],
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
  palette,
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
  palette: GrainPalette;
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
    <GrainGradient
      palette={palette}
      contours={false}
      blur={48}
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
    </GrainGradient>
  );
}

export default GrainPlanCard;
