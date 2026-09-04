'use client';

import { useEffect, useRef } from 'react';
import { TechnicalFrameButton } from '@/components/ui/TechnicalFrameButton';
import { AivoryWorldGlobe } from '@/components/home/AivoryWorldGlobe';

// Booking destination is shared with /contact and PreFooterCTA — a real Cal
// instance, not Calendly's homepage (the bug that got the free-diagnostic
// "Schedule a debrief" card pulled).
const WALKTHROUGH_URL = 'https://book.aivory.uk/book/aivory-call';

// One entrance rhythm for the four hero rows. Kept as data so the stagger
// reads as a single decision instead of four magic numbers scattered through
// the JSX — ~150ms apart, tight enough to feel like one movement.
const ENTER_DELAYS = ['0.2s', '0.35s', '0.5s', '0.65s'] as const;

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (contentRef.current) {
            contentRef.current.style.transform = `translateY(${y * -0.35}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pointer-events-none"
      style={{ background: 'transparent' }}
    >
      <AivoryWorldGlobe />
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-4xl px-5 md:px-8 pt-16 pb-16 md:pt-24 md:pb-24"
        style={{ willChange: 'transform' }}
      >
        <div className="animate-slide-up-1" style={{ animationDelay: ENTER_DELAYS[0] }}>
          <h1
            className="silver-swipe-text text-[25px] md:text-[38px] font-light tracking-tight text-center leading-[1.15] text-balance pointer-events-none select-none"
            style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
          >
            Make AI Make Sense
            {/* silver-swipe-text paints its gradient on the h1 and clips it to
                the text, so any child inherits -webkit-text-fill-color:
                transparent with no background of its own and renders blank.
                The mark opts out with a solid fill of its own. */}
            <sup
              className="text-[0.55em] tracking-normal"
              style={{
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                // Manrope already draws the mark high inside its own em box
                // (its ink stops ~6px above the baseline at this size), so
                // <sup>'s default `vertical-align: super` stacks a second
                // rise on top and leaves it floating. Sitting it on the
                // baseline lands its top at the cap height of the wordmark.
                verticalAlign: 'baseline',
              }}
            >
              &reg;
            </sup>{' '}
            from mapping
            <br className="hidden md:block" />{' '}
            how your business actually runs
          </h1>
        </div>

        <div
          className="animate-slide-up-1 mt-9 md:mt-11 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          style={{ animationDelay: ENTER_DELAYS[1] }}
        >
          <TechnicalFrameButton
            href="/free-diagnostic"
            size="heroCompact"
            className="pointer-events-auto w-full sm:w-fit"
          >
            START FREE OPERATIONS ASSESSMENT
          </TechnicalFrameButton>
          <TechnicalFrameButton
            href={WALKTHROUGH_URL}
            target="_blank"
            rel="noopener noreferrer"
            size="heroCompact"
            className="pointer-events-auto w-full sm:w-fit bg-transparent text-white/65 hover:text-white"
          >
            BOOK A WALKTHROUGH
          </TechnicalFrameButton>
        </div>

        <p
          className="animate-slide-up-1 mt-7 md:mt-8 text-[17px] md:text-[19px] font-light tracking-tight text-white/55 pointer-events-none select-none"
          style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", animationDelay: ENTER_DELAYS[2] }}
        >
          Self-guided <span className="text-white/25">&middot;</span> One sitting{' '}
          <span className="text-white/25">&middot;</span> No sales pitch
        </p>

        {/* Credential row — badge and copy, no surface. The translucent
            rounded bar that used to bound them was there to stop the opaque
            white NVIDIA lockup reading as a stray sticker against the old
            bright hero; on the current dark ambient the badge no longer
            outshouts the type, so the chrome was only adding weight. The
            hairline rules went with it: the gap separates the two claims. */}
        <div
          className="animate-slide-up-1 mt-12 md:mt-14 flex justify-center"
          style={{ animationDelay: ENTER_DELAYS[3] }}
        >
          <div className="flex flex-col items-center gap-3.5 sm:flex-row sm:gap-7">
            {/* The official lockup already reads "NVIDIA Inception Program",
                so the copy deliberately never repeats "inception member". */}
            <img
              src="/images/nvidia-inception/nvidia-inception-program-badge-rgb-for-screen-negative.svg"
              alt="NVIDIA Inception Program — Aivory AI is a member (2026 cohort)"
              className="h-[25px] md:h-[27px] w-auto shrink-0"
            />

            <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.16em] text-white/70 pointer-events-none select-none">
              500+ businesses transforming
            </p>

            <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.16em] text-white/70 pointer-events-none select-none">
              Zero training on your data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
