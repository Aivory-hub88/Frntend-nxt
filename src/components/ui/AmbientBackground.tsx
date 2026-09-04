interface AmbientBackgroundProps {
  className?: string;
  variant?: 'landing' | 'legacy-footer';
}

const GRAIN_TEXTURE =
  'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.72%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")';

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

  const baseGradient =
    'linear-gradient(145deg, #020d13 0%, #041b23 48%, #06252b 72%, #03131a 100%)';
  const leftGradient = legacyFooter
    ? 'linear-gradient(165deg, rgba(0, 13, 19, 0.95) 4%, rgba(5, 54, 65, 0.72) 58%, rgba(3, 20, 27, 0.2) 100%)'
    : 'linear-gradient(165deg, rgba(0, 13, 19, 0.98) 4%, rgba(5, 54, 65, 0.84) 58%, rgba(3, 20, 27, 0.28) 100%)';
  const rightGradient = legacyFooter
    ? 'linear-gradient(155deg, rgba(59, 109, 106, 0.52) 0%, rgba(15, 62, 67, 0.5) 42%, rgba(3, 22, 29, 0.08) 100%)'
    : 'linear-gradient(155deg, rgba(59, 109, 106, 0.7) 0%, rgba(15, 62, 67, 0.64) 42%, rgba(3, 22, 29, 0.12) 100%)';
  const centerGradient = legacyFooter
    ? 'radial-gradient(ellipse at center, rgba(43, 91, 91, 0.24) 0%, rgba(8, 42, 49, 0.16) 48%, transparent 76%)'
    : 'radial-gradient(ellipse at center, rgba(43, 91, 91, 0.12) 0%, rgba(8, 42, 49, 0.08) 48%, transparent 76%)';
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
        className={`absolute inset-0 ${legacyFooter ? 'opacity-[0.055] mix-blend-soft-light' : 'opacity-[0.14] mix-blend-overlay'}`}
        style={{
          backgroundImage: GRAIN_TEXTURE,
          backgroundSize: legacyFooter ? '200px 200px' : '160px 160px',
        }}
      />

      <div
        className="absolute inset-0 opacity-40"
        style={{ background: lowerWash }}
      />
    </div>
  );
}
