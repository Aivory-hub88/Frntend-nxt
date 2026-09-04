interface AmbientBackgroundProps {
  className?: string;
  variant?: 'landing' | 'legacy-footer';
}

const GRAIN_TEXTURE =
  'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.72%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")';

// Higher-contrast film-grain overlay for the landing hero: the plain
// feTurbulence noise above renders as low-amplitude colour static, which
// stays essentially invisible blended at low opacity over a dark surface.
// This chain desaturates the turbulence to luminance, then a feComponentTransfer
// linear ramp (slope 3 / intercept -1, i.e. anything below/above the 0.5
// midpoint clips toward black/white) pushes it into distinct light and dark
// speckles the way real photographic grain reads, so mix-blend-mode: overlay
// has actual contrast to work with instead of a near-flat grey.
const GRAIN_TEXTURE_STRONG =
  'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22g%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22 result=%22t%22/%3E%3CfeColorMatrix in=%22t%22 type=%22matrix%22 values=%220.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0%22 result=%22gray%22/%3E%3CfeComponentTransfer in=%22gray%22%3E%3CfeFuncR type=%22linear%22 slope=%223%22 intercept=%22-1%22/%3E%3CfeFuncG type=%22linear%22 slope=%223%22 intercept=%22-1%22/%3E%3CfeFuncB type=%22linear%22 slope=%223%22 intercept=%22-1%22/%3E%3CfeFuncA type=%22linear%22 slope=%220%22 intercept=%221%22/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23g)%22/%3E%3C/svg%3E")';

/**
 * Grainy navy/teal ambient surface for the landing page and its footer.
 * Landing uses stronger teal washes and grain; legacy footer keeps the
 * previously deployed, subtler treatment on non-home routes.
 */
export function AmbientBackground({
  className = 'absolute inset-0',
  variant = 'landing',
}: AmbientBackgroundProps) {
  const legacyFooter = variant === 'legacy-footer';

  // Landing sits a stop darker through the middle than the legacy footer: the
  // old #041b23 / #06252b mid stops laid a lit diagonal band straight across
  // the hero, flattening the globe and the type against it.
  const baseGradient = legacyFooter
    ? 'linear-gradient(145deg, #020d13 0%, #041b23 48%, #06252b 72%, #03131a 100%)'
    : 'linear-gradient(145deg, #08181e 0%, #03151b 48%, #04191f 72%, #020e13 100%)';
  // The left blob covers the whole upper-left quadrant of the hero, so it is
  // the layer that decides that quadrant's colour: held flat at #08181e
  // across its body (the 105px blur still feathers the edge) rather than
  // ramping, which used to leave the lower half of the quadrant reading
  // darker than the corner.
  const leftGradient = legacyFooter
    ? 'linear-gradient(165deg, rgba(0, 13, 19, 0.95) 4%, rgba(5, 54, 65, 0.72) 58%, rgba(3, 20, 27, 0.2) 100%)'
    : 'linear-gradient(165deg, rgba(8, 24, 30, 1) 4%, rgba(8, 24, 30, 1) 72%, rgba(8, 24, 30, 0.35) 100%)';
  const rightGradient = legacyFooter
    ? 'linear-gradient(155deg, rgba(59, 109, 106, 0.52) 0%, rgba(15, 62, 67, 0.5) 42%, rgba(3, 22, 29, 0.08) 100%)'
    : 'linear-gradient(155deg, rgba(26, 56, 57, 0.5) 0%, rgba(9, 36, 41, 0.5) 42%, rgba(2, 16, 21, 0.1) 100%)';
  const centerGradient = legacyFooter
    ? 'radial-gradient(ellipse at center, rgba(43, 91, 91, 0.24) 0%, rgba(8, 42, 49, 0.16) 48%, transparent 76%)'
    : 'radial-gradient(ellipse at center, rgba(43, 91, 91, 0.05) 0%, rgba(8, 42, 49, 0.035) 48%, transparent 76%)';
  const lowerWash = legacyFooter
    ? 'radial-gradient(70% 58% at 54% 92%, rgba(76, 118, 113, 0.16) 0%, rgba(19, 61, 65, 0.08) 45%, transparent 76%)'
    : 'radial-gradient(70% 58% at 54% 92%, rgba(76, 118, 113, 0.16) 0%, rgba(19, 61, 65, 0.08) 45%, transparent 76%)';

  return (
    <div
      className={`${className} overflow-hidden pointer-events-none bg-[#03141b]`}
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ background: baseGradient }} />

      <div
        className="aivory-ambient-blob aivory-ambient-blob--left absolute -left-[28%] -top-[24%] h-[72%] w-[78%] rounded-full"
        style={{ background: leftGradient, filter: 'blur(105px)' }}
      />

      <div
        className="aivory-ambient-blob aivory-ambient-blob--right absolute -bottom-[30%] -right-[22%] h-[82%] w-[84%] rounded-full"
        style={{ background: rightGradient, filter: 'blur(125px)' }}
      />

      <div
        className="aivory-ambient-blob aivory-ambient-blob--center absolute left-[22%] top-[28%] h-[55%] w-[56%] rounded-full"
        style={{ background: centerGradient, filter: 'blur(90px)' }}
      />

      <div
        className="absolute inset-0 opacity-40"
        style={{ background: lowerWash }}
      />

      {/* Grain sits last (painted over the blobs and the lower wash) so
          nothing dilutes it. Landing gets the high-contrast texture above;
          legacy-footer keeps the original subtle static untouched. */}
      <div
        className={`absolute inset-0 ${legacyFooter ? 'opacity-[0.055] mix-blend-soft-light' : 'opacity-[0.2] mix-blend-overlay'}`}
        style={{
          backgroundImage: legacyFooter ? GRAIN_TEXTURE : GRAIN_TEXTURE_STRONG,
          backgroundSize: legacyFooter ? '200px 200px' : '150px 150px',
        }}
      />
    </div>
  );
}
