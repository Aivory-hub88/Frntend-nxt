'use client';
import { useEffect } from 'react';

/**
 * Client component that applies GSAP ScrollTrigger reveal animations globally.
 * Targets section-level headings, paragraphs, grids, and dividers — same selectors
 * as the original index.html premium scroll reveal.
 *
 * PERF: GSAP + ScrollTrigger + SplitType (~210KB) are loaded via a dynamic
 * import inside an idle callback, so they are code-split out of the initial
 * page bundle and only downloaded once the browser is idle (after first paint
 * and hydration). This is safe because the reveal's hidden state (opacity: 0)
 * is applied by GSAP at runtime — never via CSS — so content stays fully
 * visible until the animation module loads. Reduced-motion users skip it
 * entirely and never download GSAP.
 *
 * Mount this once in page.tsx.
 */
export default function ScrollRevealProvider() {
  useEffect(() => {
    // Respect reduced motion — skip all animations (and skip loading GSAP).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const ric =
      window.requestIdleCallback ||
      ((cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({} as IdleDeadline), 300));
    const cic = window.cancelIdleCallback || window.clearTimeout;

    const id = ric(
      async () => {
        const mod = await import('@/hooks/useGsapScrollReveal');
        if (cancelled) return;
        // Alias to a non-"use"-prefixed name: this returns plain animation
        // helpers (no React hooks inside) and is called outside render.
        const setup = mod.useGsapScrollReveal;
        const { revealElements, revealGrids, revealDividers } = setup();
        // Section-level headings and paragraphs (hook filters out .hero,
        // .gsap-card, and .animate-on-scroll).
        revealElements('h2, p');
        revealGrids('main .grid');
        // Standalone decorative dividers, not section borders.
        revealDividers('.border-t:not(section)');
        cleanup = () => mod.killAllScrollTriggers();
      },
      { timeout: 1200 }
    );

    return () => {
      cancelled = true;
      cic(id as number);
      cleanup?.();
    };
  }, []);

  return null;
}
