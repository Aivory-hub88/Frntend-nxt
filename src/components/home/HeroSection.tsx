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
      className="relative w-full min-h-screen flex flex-col items-start justify-center overflow-hidden pointer-events-none"
      style={{ background: 'transparent' }}
    >
      <AivoryWorldGlobe />
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-start justify-center text-left w-full max-w-2xl px-5 md:px-8 lg:px-20 pt-16 pb-16 md:pt-24 md:pb-24"
        style={{ willChange: 'transform' }}
      >
        <div className="animate-slide-up-1 w-full" style={{ animationDelay: ENTER_DELAYS[0] }}>
          <h1
            className="silver-swipe-text text-[28px] md:text-[42px] font-light tracking-tight text-left leading-[1.15] text-balance pointer-events-none select-none"
            style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
          >
            Every operation runs on something
            <br className="hidden md:block" />{' '}
            Make it Aivory
          </h1>

          {/* no-word-split: opts this out of ScrollRevealProvider's global
              `h2, p` GSAP SplitType pass. That reveal wraps each word in its
              own transformed/will-change layer, which fights the gradient's
              own background-clip:text compositing layer here and paints the
              two lines stacked on top of each other instead of one above the
              other. The hero already animates this in on load via the
              parent's `animate-slide-up-1`, so no reveal behaviour is lost. */}
          <p
            className="no-word-split silver-swipe-text mt-5 md:mt-6 text-[19px] md:text-[24px] font-light tracking-tight leading-[1.4] text-left pointer-events-none select-none"
            style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
          >
            Map how your business actually works
            <br />
            Deploy intelligence where it actually matters
          </p>
        </div>

        <p
          className="animate-slide-up-1 w-full mt-5 md:mt-6 text-[17px] md:text-[19px] font-light tracking-tight text-white/55 pointer-events-none select-none"
          style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", animationDelay: ENTER_DELAYS[1] }}
        >
          Self-guided <span className="text-white/25">&middot;</span> One sitting{' '}
          <span className="text-white/25">&middot;</span> No sales pitch
        </p>

        <div
          className="animate-slide-up-1 w-full mt-9 md:mt-11 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 sm:gap-4"
          style={{ animationDelay: ENTER_DELAYS[2] }}
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

        {/* Trust bar — one line, pipe-divided, third item is the NVIDIA
            badge image alone (no repeated "Inception Program" text next to
            it — the lockup already says that).
            no-word-split: this <p> would otherwise be swept up by
            ScrollRevealProvider's global `h2, p` GSAP SplitType pass, same
            as the subheadline above. That pass runs on a requestIdleCallback
            well after first paint, which is why it doesn't show up in a
            quick post-deploy check: it wraps every word in its own
            block-level `.line`/`.word` layer, which both destroys this
            row's flex/gap layout (the pipes end up glued to the next word,
            and the badge gets forced onto its own line) and leaves the
            later words permanently at opacity 0, since this element is
            already in view on load and never crosses the reveal's scroll
            trigger. The hero already animates this in via the parent's
            animate-slide-up-1, so excluding it loses no behaviour. */}
        <div
          className="animate-slide-up-1 w-full mt-12 md:mt-14 flex justify-start"
          style={{ animationDelay: ENTER_DELAYS[3] }}
        >
          <p className="no-word-split flex flex-wrap items-center justify-start gap-x-3 gap-y-2 max-w-2xl text-left font-mono text-[11px] md:text-[12px] uppercase tracking-[0.16em] text-white/70 pointer-events-none select-none">
            <span>500+ businesses running on Aivory</span>
            <span className="text-white/25" aria-hidden="true">|</span>
            <span>Zero training on your data</span>
            <span className="text-white/25" aria-hidden="true">|</span>
            <img
              src="/images/nvidia-inception/nvidia-inception-program-badge-rgb-for-screen-negative.svg"
              alt="NVIDIA Inception Program — Aivory AI is a member (2026 cohort)"
              className="h-[22px] md:h-[24px] w-auto shrink-0"
            />
          </p>
        </div>
      </div>
    </div>
  );
}
