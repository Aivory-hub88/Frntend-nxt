'use client';

import { TechnicalFrameButton } from '@/components/ui/TechnicalFrameButton';
import HeroDiagramGraphic, { HeroCardBackdrop } from '@/components/home/HeroDiagramGraphic';

// Booking destination is shared with /contact and PreFooterCTA — a real Cal
// instance, not Calendly's homepage (the bug that got the free-diagnostic
// "Schedule a debrief" card pulled).
const WALKTHROUGH_URL = 'https://book.aivory.uk/book/aivory-call';

/**
 * The hero is one light card carrying the Figma lockup: the diagram graphic
 * on top, then the CTAs and the trust bar on the card's own surface.
 *
 * `hero` opts the whole block out of ScrollRevealProvider's global `h2, p`
 * GSAP pass, which would otherwise hold the tagline and trust-bar copy at
 * opacity 0 on first paint.
 *
 * The card is flush to the top of the page and rounded only at the bottom:
 * the fixed navbar sits *inside* the card's own top gradient strip (see
 * Navbar's `onCard` state), rather than as a separate bar above it.
 */
export default function HeroSection() {
  return (
    <div className="hero relative w-full pb-16 md:pb-24">
      <div className="relative z-10 w-full animate-slide-up-1">
        <div className="relative overflow-hidden bg-[#ededed] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.65)]">
          <HeroCardBackdrop />

          <div className="relative">
            <HeroDiagramGraphic />
          </div>

          <div className="relative flex flex-col items-center gap-5 px-5 pb-9 sm:gap-6 md:px-10 md:pb-12">
            <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <TechnicalFrameButton href="/free-diagnostic" size="heroCompact" tone="dark" className="w-full sm:w-fit">
                START FREE OPERATIONS ASSESSMENT
              </TechnicalFrameButton>
              <TechnicalFrameButton
                href={WALKTHROUGH_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="heroCompact"
                tone="dark"
                className="w-full sm:w-fit"
              >
                BOOK A WALKTHROUGH
              </TechnicalFrameButton>
            </div>

            <p
              className="pointer-events-none select-none text-center text-[15px] font-light tracking-tight text-black/45 md:text-[16px]"
              style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
            >
              Self-guided <span className="text-black/25">&middot;</span> One sitting{' '}
              <span className="text-black/25">&middot;</span> No sales pitch
            </p>

            {/* Trust bar — the live wireframe stat layout, re-tuned for a
                light surface: near-black figures, and the positive NVIDIA
                lockup instead of the negative (white) one. */}
            <div className="pointer-events-none flex select-none flex-wrap items-center justify-center gap-x-8 gap-y-5 border-t border-black/[0.08] pt-6 sm:gap-x-10">
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[28px] font-light leading-none text-black md:text-[34px]"
                  style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
                >
                  500+
                </span>
                <span className="font-mono text-[10px] uppercase leading-[1.3] tracking-[0.08em] text-black/60 md:text-[11px]">
                  Businesses
                  <br />
                  running on
                  <br />
                  Aivory
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span
                  className="text-[28px] font-light leading-none text-black md:text-[34px]"
                  style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
                >
                  0
                </span>
                <span className="font-mono text-[10px] uppercase leading-[1.3] tracking-[0.08em] text-black/60 md:text-[11px]">
                  Training on
                  <br />
                  your data
                </span>
              </div>

              <img
                src="/images/nvidia-inception/nvidia-inception-program-badge-rgb-for-screen.svg"
                alt="NVIDIA Inception Program — Aivory AI is a member (2026 cohort)"
                className="h-[26px] w-auto shrink-0 md:h-[28px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
