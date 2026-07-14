'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

/* ─── Arrow Icon ─── */
function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 7v10H7" />
      <path d="M7 7l10 10" />
    </svg>
  );
}

const privacyPoints = [
  { text: 'We don\'t train\non your data.' },
  { text: 'Processed locally.\nStored locally.' },
  { text: 'GDPR compliant\nby design.' },
];

const badges = [
  'GDPR ready',
  'No Data Training',
  'Local Processing Only',
  'Zero Server Logging',
  'End to End Private',
];

const trustBadges = ['Enterprise Grade', 'GDPR Compliant', 'SOC 2 Ready'];

export default function PrivacySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full text-white pt-24 pb-12 font-sans`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
            <div className="text-sm font-medium">Privacy &amp; Security</div>
            <div className="flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 rounded-full border border-[#a3aa96]/30 bg-[#a3aa96]/[0.06] px-3 py-1 text-[11px] font-medium text-[#c3c9b8]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#a3aa96]" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
          <h2 className="no-word-split text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight leading-[1.2] mb-10">
            Your data stays<br />where it belongs.
          </h2>

          <div className="border-t border-white/20 pt-8 mt-12">
            <p className="text-lg md:text-xl font-light mb-12">
              No training. No logging. No exceptions. Everything runs in your browser.
            </p>

            {/* Privacy Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl">
              {privacyPoints.map((point) => (
                <div key={point.text} className="flex items-start gap-4">
                  <ArrowIcon className="w-6 h-6 shrink-0 mt-0.5" />
                  <p className="text-xl font-medium leading-snug whitespace-pre-line">{point.text}</p>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-4">
              {badges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 border border-white/20 px-4 py-2.5 text-xs md:text-sm font-medium hover:border-[#a3aa96] hover:bg-white/5 transition-all cursor-pointer"
                >
                  <ArrowIcon className="w-4 h-4 text-[#a3aa96]" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
