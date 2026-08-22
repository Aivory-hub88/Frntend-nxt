'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function VideoDemoSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full relative overflow-hidden`}
      style={{ padding: '40px 0 90px 0' }}
    >
      <div className="relative z-[1] mx-auto max-w-[820px] px-5 lg:px-8">
        <div className="overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.035] backdrop-blur-md">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
            <span className="h-[10px] w-[10px] rounded-full bg-[#e5665a]" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#e0b64f]" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#6bb35a]" />
            <div
              className="ml-3 flex-1 truncate rounded-md border border-white/[0.07] bg-white/[0.04] px-3 py-1 text-center text-[11px] text-white/40 sm:text-[12px]"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Aivory
            </div>
          </div>

          {/* Video */}
          <div className="relative w-full bg-black leading-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              className="block w-full h-auto"
            >
              <source src="/aivory-console-demo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
