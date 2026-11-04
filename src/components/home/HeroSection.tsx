'use client';

import { TechnicalFrameButton } from '@/components/ui/TechnicalFrameButton';
import HeroDiagramGraphic, { HeroCardBackdrop, WALKTHROUGH_URL } from '@/components/home/HeroDiagramGraphic';

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
        <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#ededed] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.65)]">
          <HeroCardBackdrop />

          {/* The card is at least one full screen tall; `my-auto` centres the
              diagram (and the mobile CTAs under it) in whatever is left, so
              the next section never peeks in at the bottom. */}
          <div className="relative my-auto w-full">
          {/* Below lg the canvas has no CTA cards, so its bottom ~8% of width is
              empty; pull the fallback buttons up into it. */}
          <div className="relative -mb-[8%] lg:mb-0">
            <HeroDiagramGraphic />
          </div>

          {/* lg+ renders the CTAs as cards inside the diagram canvas; this row is the
              full-size fallback for tablets and phones. */}
          <div className="relative flex flex-col items-center gap-5 px-5 pb-9 sm:gap-6 md:px-10 md:pb-12 lg:hidden">
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

          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
