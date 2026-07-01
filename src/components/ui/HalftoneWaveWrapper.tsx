'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

/**
 * Page-wide ambient background.
 *
 * Perf strategy (P0):
 * - Mobile / tablet (< 1024px) or reduced-motion: render a pure-CSS gradient
 *   only. The heavy WebGL "halftone flower" (three.js, ~700KB) is NEVER
 *   downloaded on these devices — the dynamic chunk is only fetched when the
 *   WebGL component actually renders.
 * - Desktop: paint the CSS gradient immediately (instant ambient background,
 *   zero crash risk), then upgrade to the WebGL flower once the browser is
 *   idle so it never competes with LCP / hydration.
 */

const HalftoneWave = dynamic(
  () => import('./HalftoneWave').then((mod) => mod.HalftoneWave),
  { ssr: false }
);

function CssGradientFallback() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* central bloom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 42%, rgba(60,52,140,0.35) 0%, rgba(24,22,64,0.22) 38%, rgba(6,6,16,0.05) 62%, rgba(0,0,0,0) 80%)',
        }}
      />
      {/* soft indigo/blue accents echoing the flower petals */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(40% 40% at 30% 55%, rgba(38,30,110,0.28) 0%, rgba(0,0,0,0) 70%), radial-gradient(45% 45% at 72% 48%, rgba(30,42,120,0.26) 0%, rgba(0,0,0,0) 70%)',
        }}
      />
    </div>
  );
}

export function HalftoneWaveWrapper() {
  const [useWebgl, setUseWebgl] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Mobile / tablet / reduced-motion: stay on the CSS gradient forever.
    if (!isDesktop || prefersReduced) return;

    // Desktop: defer the heavy WebGL flower until the browser is idle.
    const ric =
      window.requestIdleCallback ||
      ((cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({} as IdleDeadline), 300));
    const cic = window.cancelIdleCallback || window.clearTimeout;
    const id = ric(() => setUseWebgl(true));
    return () => cic(id as number);
  }, []);

  if (useWebgl) return <HalftoneWave />;
  return <CssGradientFallback />;
}
