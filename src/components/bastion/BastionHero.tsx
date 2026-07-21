import { FadeUp, FadeUpChild } from './FadeUp';
import Link from 'next/link';

export default function BastionHero() {
  return (
    <section className="relative flex items-center justify-center bg-[#050505] text-white py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full text-center">
        <FadeUp staggerChildren={0.2} className="flex flex-col items-center">
          <FadeUpChild>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8 text-[#FFFFFF]">
              Autonomous<br />Infrastructure Defense.
            </h1>
          </FadeUpChild>
          
          <FadeUpChild>
            <p className="text-xl md:text-2xl text-[#B3B3B3] font-light max-w-3xl mx-auto leading-relaxed mb-12">
              Every interaction is observed. Every anomaly is understood. Every decision is made before threats become incidents.
            </p>
          </FadeUpChild>
          
        </FadeUp>
      </div>
    </section>
  );
}
