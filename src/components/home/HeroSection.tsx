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
            Every operation runs on something.
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
            className="no-word-split silver-swipe-text mt-5 md:mt-6 text-[19px] md:text-[24px] font-light tracking-tight leading-[1.4] pointer-events-none select-none"
            style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
          >
            Map how your business actually works
            <br />
            Deploy intelligence where it actually matters
          </p>
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

        {/* Trust bar — one line, same &middot;-divided rhythm as the
            "Self-guided / One sitting / No sales pitch" tagline above it,
            rather than a separate badge+copy row with its own layout. The
            NVIDIA mark stays the official image lockup (shrunk to sit inline
            with the text) rather than becoming plain text: it's the badge
            that actually says "Inception Program", not a claim we make
            ourselves. */}
        <div
          className="animate-slide-up-1 mt-12 md:mt-14 flex justify-center"
          style={{ animationDelay: ENTER_DELAYS[3] }}
        >
          <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 max-w-xl text-center font-mono text-[11px] md:text-[12px] uppercase tracking-[0.16em] text-white/70 pointer-events-none select-none">
            <span>500+ businesses running on Aivory</span>
            <span className="text-white/25" aria-hidden="true">&middot;</span>
            <span>Zero training on your data</span>
            <span className="text-white/25" aria-hidden="true">&middot;</span>
            <span className="inline-flex items-center gap-1.5">
              <img
                src="/images/nvidia-inception/nvidia-inception-program-badge-rgb-for-screen-negative.svg"
                alt=""
                className="h-[14px] md:h-[15px] w-auto shrink-0"
              />
              NVIDIA Inception 2026
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
