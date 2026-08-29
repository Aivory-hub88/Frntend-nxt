'use client';

import type { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

/**
 * Card layout follows the Pangram Pangram / Apple product-card pattern:
 * eyebrow label, a short display headline, one supporting line, and a
 * minimal line mark anchored to the bottom of the card. The ornate tapestry
 * art it replaced read as decorative stock and sat outside the rest of the
 * site's restrained visual language.
 *
 * Icons are inline so they inherit `currentColor` and stay crisp on the
 * accent card, where the palette flips to dark-on-light.
 */
type Item = {
  tag: string;
  title: string;
  body: string;
  icon: ReactNode;
  /** Exactly one card carries the brand accent, as the section's focal point. */
  accent?: boolean;
};

/** Shared geometry so every mark reads at the same optical weight. */
const svg = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 0.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const privacyItems: Item[] = [
  {
    tag: 'no training',
    title: "We don't train on your data.",
    body: 'Your prompts, documents and outputs are never folded back into a model.',
    accent: true,
    icon: (
      <svg {...svg} aria-hidden="true">
        <rect x="8" y="8" width="8" height="8" rx="1.5" />
        <path d="M10 5V8M14 5V8M10 16v3M14 16v3M5 10h3M5 14h3M16 10h3M16 14h3" />
      </svg>
    ),
  },
  {
    tag: 'on-premise',
    title: 'Processed and stored locally.',
    body: 'Workloads run on infrastructure you own, inside your own network boundary.',
    icon: (
      <svg {...svg} aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="6" rx="1.5" />
        <rect x="3.5" y="13.5" width="17" height="6" rx="1.5" />
        <path d="M7 7.5h.01M7 16.5h.01" />
      </svg>
    ),
  },
  {
    tag: 'compliance',
    title: 'GDPR compliant by design.',
    body: 'Data minimisation, retention limits and erasure are built into the pipeline.',
    icon: (
      <svg {...svg} aria-hidden="true">
        <path d="M12 3.5l7 2.5v6c0 4-3 7.2-7 8.5-4-1.3-7-4.5-7-8.5V6l7-2.5z" />
        <path d="M9 12l2.2 2.2L15.5 10" />
      </svg>
    ),
  },
  {
    tag: 'no logs',
    title: 'Zero server logging.',
    body: 'No request bodies, no transcripts, no silent copies held for debugging.',
    icon: (
      <svg {...svg} aria-hidden="true">
        <path d="M6.5 3.5h7l4 4v13h-11z" />
        <path d="M13.5 3.5v4h4" />
        <path d="M9.5 14.5h5" />
      </svg>
    ),
  },
  {
    tag: 'end-to-end',
    title: 'End-to-end private.',
    body: 'Encrypted in transit from the first request through to the final response.',
    icon: (
      <svg {...svg} aria-hidden="true">
        <circle cx="4" cy="12" r="1.8" />
        <circle cx="20" cy="12" r="1.8" />
        <path d="M5.8 12h2.7M15.5 12h2.7" />
        <rect x="9" y="10.5" width="6" height="5.5" rx="1.2" />
        <path d="M10.5 10.5V9a1.5 1.5 0 013 0v1.5" />
      </svg>
    ),
  },
  {
    tag: 'at rest',
    title: 'Encrypted at rest.',
    body: 'Every stored record sits behind AES-256 with keys held on your side.',
    icon: (
      <svg {...svg} aria-hidden="true">
        <ellipse cx="12" cy="6.5" rx="7" ry="2.75" />
        <path d="M5 6.5v11c0 1.5 3.1 2.75 7 2.75s7-1.25 7-2.75v-11" />
        <path d="M9.5 13.5h5v4h-5zM10.75 13.5v-1.25a1.25 1.25 0 012.5 0v1.25" />
      </svg>
    ),
  },
  {
    tag: 'no sharing',
    title: 'No third-party sharing.',
    body: 'Nothing is passed to advertisers, brokers or analytics vendors. Ever.',
    icon: (
      <svg {...svg} aria-hidden="true">
        <path d="M10.5 14l-2.2 2.2a3.4 3.4 0 01-4.8-4.8L5.7 9.2" />
        <path d="M13.5 10l2.2-2.2a3.4 3.4 0 014.8 4.8L18.3 14.8" />
      </svg>
    ),
  },
  {
    tag: 'enterprise',
    title: 'Enterprise grade.',
    body: 'Role-based access, audit trails and single sign-on across every workspace.',
    icon: (
      <svg {...svg} aria-hidden="true">
        <path d="M5 20V6.5a1 1 0 011-1h7a1 1 0 011 1V20" />
        <path d="M14 20v-9h4a1 1 0 011 1v8" />
        <path d="M3.5 20h17" />
        <path d="M8 9h3M8 12.5h3M8 16h3M16.5 14h.01" />
      </svg>
    ),
  },
];

export default function PrivacySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      data-privacy-layout="editorial"
      data-privacy-icon-count="8"
      className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full border-t border-white/10 py-20 font-sans text-white md:py-28`}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="grid gap-10 pb-14 lg:grid-cols-12 lg:pb-20">
          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              Privacy &amp; security / 01
            </p>
            <h2
              className="no-word-split mt-5 max-w-lg text-3xl font-light leading-[1.12] tracking-[-0.03em] md:text-[44px]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
            >
              Data sovereignty is non-negotiable.
            </h2>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:self-end">
            <p
              className="max-w-2xl text-xl font-light leading-[1.55] tracking-[-0.015em] text-white/82 md:text-2xl"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
            >
              Your operational intelligence should remain under your control—at every layer of the system.
            </p>
            <p
              className="mt-7 max-w-xl text-[15px] font-light leading-7 text-white/55"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
            >
              Zero model training. Zero third-party logging. Your operational data remains entirely within your control.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {privacyItems.map((item) => (
            <article
              key={item.title}
              className={`privacy-card group flex min-h-[290px] flex-col rounded-[20px] border p-7 ${
                item.accent
                  ? 'privacy-card--accent border-transparent bg-[#c4c9b8] text-[#110f0e]'
                  : 'border-white/[0.07] bg-[#151312] text-white'
              }`}
            >
              <p
                className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                  item.accent ? 'text-[#110f0e]/55' : 'text-white/40'
                }`}
              >
                {item.tag}
              </p>

              <h3
                className="mt-4 text-[21px] font-light leading-[1.22] tracking-[-0.02em]"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
              >
                {item.title}
              </h3>

              <p
                className={`mt-3 text-[13.5px] font-light leading-[1.6] ${
                  item.accent ? 'text-[#110f0e]/65' : 'text-white/45'
                }`}
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
              >
                {item.body}
              </p>

              <div className="mt-auto flex items-end justify-between pt-10">
                <span
                  className={`privacy-card__mark block h-11 w-11 ${
                    item.accent ? 'text-[#110f0e]/75' : 'text-white/55'
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  aria-hidden="true"
                  className={`privacy-card__plus flex h-7 w-7 items-center justify-center rounded-full ${
                    item.accent ? 'bg-[#110f0e]/10 text-[#110f0e]/70' : 'bg-white/[0.06] text-white/50'
                  }`}
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round">
                    <path d="M6 1.5v9M1.5 6h9" />
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
