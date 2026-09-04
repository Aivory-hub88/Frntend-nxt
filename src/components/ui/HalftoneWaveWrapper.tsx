'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

/**
 * Footer-only WebGL flower.
 *
 * The shader is deferred until the browser is idle and remains gated by the
 * flower's own IntersectionObserver. Reduced-motion users keep a static cool
 * fallback instead of downloading Three.js.
 */
const HalftoneWave = dynamic(
  () => import('./HalftoneWave').then((mod) => mod.HalftoneWave),
  { ssr: false }
);

function CssGradientFallback() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -right-[20%] -bottom-[30%] h-[100%] w-[85%] rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(36, 83, 88, 0.45) 0%, rgba(10, 45, 53, 0.24) 48%, transparent 74%)',
          filter: 'blur(70px)',
        }}
      />
    </div>
  );
}

export function HalftoneWaveWrapper({ purpleColor }: { purpleColor?: string } = {}) {
  const [useWebgl, setUseWebgl] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ric =
      window.requestIdleCallback ||
      ((cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({} as IdleDeadline), 300));
    const cic = window.cancelIdleCallback || window.clearTimeout;
    const id = ric(() => setUseWebgl(true), { timeout: 2000 });

    return () => cic(id as number);
  }, []);

  return (
    <div className="absolute inset-0">
      {useWebgl ? (
        <HalftoneWave active purpleColor={purpleColor} />
      ) : (
        <CssGradientFallback />
      )}
    </div>
  );
}
