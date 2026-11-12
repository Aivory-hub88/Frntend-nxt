'use client';

import { GrainGradient, type GrainPalette } from '@/components/ui/GrainGradient';

const WORDMARK_MASK = 'url(/aivory-wordmark.svg) center / contain no-repeat';

/**
 * The 2026 wordmark filled with a grainy gradient through its own shape, for
 * white headers (checkout, free-analysis signup). Each page passes the
 * left-to-right palette of its own side panel.
 */
export function GradientWordmark({ palette, className = 'h-6' }: { palette: GrainPalette; className?: string }) {
  return (
    <div
      role="img"
      aria-label="Aivory"
      className={`relative aspect-[205/30] ${className}`}
      style={{ WebkitMask: WORDMARK_MASK, mask: WORDMARK_MASK }}
    >
      <GrainGradient palette={palette} contours={false} hover={false} blur={8} className="h-full w-full" />
    </div>
  );
}

export default GradientWordmark;
