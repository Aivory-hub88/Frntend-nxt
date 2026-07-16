"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function AIReadySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? "is-visible" : ""} w-full py-16 md:py-24 relative`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 relative z-[1]">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12 mb-20">
          {/* Left Column */}
          <div className="w-full md:w-1/2 flex justify-start">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] text-white m-0 text-left"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Where do
              <br />
              we{" "}
              <span className="italic inline-block pr-6 sm:pr-2" style={{ color: "#e4effd" }}>
                start?
              </span>
            </h2>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 flex flex-col justify-start text-left">
            <p className="text-white/80 font-light leading-relaxed text-lg md:text-xl m-0 max-w-xl">
              That&rsquo;s the question that stops most AI adoption before it
              begins.{" "}
              <span className="text-white font-medium">Aivory answers it.</span>
              <br />
              <br />
              Assess your readiness. Get a plan built for your business. Launch
              it.{" "}
              <span className="text-white font-medium">
                Not a consultant. A system.
              </span>
              <br />
              <br />
              No guesswork. No noise.
            </p>
            <p
              className="text-white font-medium leading-relaxed mt-12 text-2xl md:text-3xl lg:text-4xl"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              AI that works, from day one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
