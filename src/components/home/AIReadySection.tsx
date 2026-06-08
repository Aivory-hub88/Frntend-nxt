'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function AIReadySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full py-16 md:py-24 relative overflow-hidden bg-black`}>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 relative z-[1]">
        <div className="text-center flex flex-col justify-center items-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 leading-tight text-white max-w-3xl">
            AI is ready. The question is, are you?
          </h2>

          <p className="text-white/60 max-w-2xl font-light leading-relaxed mb-6">
            Aivory™ helps you move from &ldquo;where do we start?&rdquo; to AI that&rsquo;s working
            inside your business. Assess your readiness, find the highest-impact opportunities, and
            launch the right AI systems with one clear plan in one platform.
          </p>

          <p className="text-white/60 max-w-2xl font-light leading-relaxed mb-6">
            No long discovery cycles. No bloated consulting timelines. No generic strategy decks.
            Just fast clarity, a roadmap built for your business, and the tools to put AI into action
            from day one.
          </p>

          <p className="text-white/60 max-w-2xl font-light leading-relaxed">
            AI should feel practical, not overwhelming. Aivory™ turns complexity into a clear path
            forward, so your team can move faster and see real business results.
          </p>

          <p
            className="text-white text-base md:text-xl font-extrabold leading-relaxed max-w-[720px] mt-6"
            style={{
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            No guesswork. No wasted budget. No hidden cost. Just a clear path forward.
          </p>
        </div>
      </div>
    </div>
  );
}
