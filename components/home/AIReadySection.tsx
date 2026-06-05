'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function AIReadySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full py-24 relative overflow-hidden`} style={{ background: 'transparent' }}>

      <div
        className="relative z-[1]"
        style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}
      >
        <div className="text-left">
          <h2
            className="text-white mb-3"
            style={{
              fontSize: '3.5rem',
              fontWeight: 400,
              fontFamily: "'Manrope', sans-serif",
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            AI is ready. The question is, are you?
          </h2>

          <p
            style={{
              fontSize: '1.25rem',
              color: '#b2b2b2',
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 300,
              lineHeight: 1.6,
              maxWidth: '720px',
            }}
          >
            Aivory™ helps you move from &ldquo;where do we start?&rdquo; to AI that&rsquo;s working
            inside your business. Assess your readiness, find the highest-impact opportunities, and
            launch the right AI systems with one clear plan in one platform.
          </p>

          <p
            style={{
              fontSize: '1.25rem',
              color: '#b2b2b2',
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 300,
              lineHeight: 1.6,
              maxWidth: '720px',
              marginTop: '24px',
            }}
          >
            No long discovery cycles. No bloated consulting timelines. No generic strategy decks.
            Just fast clarity, a roadmap built for your business, and the tools to put AI into action
            from day one.
          </p>

          <p
            style={{
              fontSize: '1.25rem',
              color: '#b2b2b2',
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 300,
              lineHeight: 1.6,
              maxWidth: '720px',
              marginTop: '24px',
            }}
          >
            AI should feel practical, not overwhelming. Aivory™ turns complexity into a clear path
            forward, so your team can move faster and see real business results.
          </p>

          <p
            className="text-white"
            style={{
              fontSize: '1.25rem',
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              lineHeight: 1.6,
              maxWidth: '720px',
              marginTop: '24px',
              whiteSpace: 'nowrap',
            }}
          >
            No guesswork. No wasted budget. No hidden cost. Just a clear path forward.
          </p>
        </div>
      </div>
    </div>
  );
}
