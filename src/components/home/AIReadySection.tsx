'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function AIReadySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full py-16 md:py-24 relative overflow-hidden`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 relative z-[1]">
        <div className="text-center flex flex-col justify-center items-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 leading-tight text-white max-w-3xl">
            Aivory&trade; exists because AI adoption needed to be fixed.
          </h2>

          <p className="text-white/60 max-w-2xl font-light leading-relaxed mb-6">
            Aivory&trade; helps you move from <span className="text-white">&ldquo;where do we start?&rdquo;</span> to AI that&rsquo;s working inside your business.<br />
            <span className="text-white">Most businesses don&rsquo;t fail at AI because of the technology.</span> They fail because there&rsquo;s no clear starting point. No map. No structure. No plan that actually fits how they operate. So they stall.<br />
            Aivory fixes that.
          </p>

          <p className="text-white/60 max-w-2xl font-light leading-relaxed mb-6">
            <span className="text-white">No long discovery cycles. No bloated consulting timelines.<br /> No generic strategy decks.</span><br />
            Instead of traditional consulting, Aivory uses a high-intelligence deterministic engine to compress work that used to take weeks into clear AI decisions and workflows in minutes.
          </p>

          <p className="text-white/60 max-w-2xl font-light leading-relaxed">
            AI should feel practical, not overwhelming. Aivory&trade; turns complexity into a clear path forward, so your team can move faster and see real business results.
          </p>

          <p
            className="text-white font-normal leading-relaxed w-full md:whitespace-nowrap mt-6"
            style={{
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            No guesswork. No wasted budget. No false starts. Just execution.
          </p>
        </div>
      </div>
    </div>
  );
}
