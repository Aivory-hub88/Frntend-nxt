'use client';

import BastionHeroSection from './BastionHeroSection';

export default function BastionVisualHero() {
  return (
    <section className="relative min-h-screen flex items-end justify-center bg-[#050505] overflow-hidden pt-20 pb-16 md:pb-24">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 flex justify-center items-center">
        <div className="w-full flex justify-center" style={{ transform: 'scale(1.265) translateY(5%)' }}>
          <BastionHeroSection className="w-full h-auto object-contain" />
        </div>
      </div>
    </section>
  );
}
