"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function AIReadySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? "is-visible" : ""} w-full pt-16 md:pt-24 pb-4 md:pb-6 relative`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 relative z-[1]">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12 mb-6">
          {/* Left Column */}
          <div className="w-full md:w-1/2 flex justify-start">
            <h2
              className="text-3xl sm:text-4xl md:text-[31px] lg:text-[38px] font-light tracking-tight leading-[1.1] text-white m-0 text-left"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
            >
              Transformation requires
              <br />
              operational{" "}
              <span
                className="inline-block"
                style={{ 
                  color: "#e4effd", 
                  paddingRight: "0.25em", 
                  marginRight: "-0.25em" 
                }}
              >
                clarity.
              </span>
            </h2>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 flex flex-col justify-start text-left">
            {/* Real blocks with their own spacing rather than stacked <br/>s:
                double line breaks inside one <p> give every gap the same
                height as a wrapped line, so the four beats read as one flat
                list. `text-balance` splits the opening sentence into even
                lines instead of running the first to the edge and stranding
                a single word ("done.") underneath it.

                The two assertions carry the full-white emphasis -- the turn
                ("We reverse the model.") and the payoff ("Then scale with
                governed AI agents.") -- while the steps between them stay at
                the base weight so the block still reads as one thought. */}
            <div className="text-white/80 font-light leading-relaxed text-[14px] md:text-[16px] max-w-2xl space-y-4 md:space-y-5 [&>p]:m-0">
              <p className="text-balance">
                Most organisations deploy AI before understanding how work actually gets done.
              </p>
              <p>
                <span className="text-white font-light">We reverse the model.</span>
                <br />
                Map the operation.
              </p>
              <p>Get a blueprint of quick-win automations.</p>
              <p className="text-white font-light">
                Then scale with governed AI agents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
