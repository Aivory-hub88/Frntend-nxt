'use client';

import { FadeUp, FadeUpChild } from './FadeUp';

const AnimatedOrb = ({ size = 84 }: { size?: number }) => {
  const dots = [];
  const numDots = 48;
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  
  for (let i = 0; i < numDots; i++) {
    const t = i / (numDots - 1);
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = 2 * Math.PI * i / goldenRatio;
    
    const x = Math.sin(inclination) * Math.cos(azimuth);
    const y = Math.sin(inclination) * Math.sin(azimuth);
    const z = Math.cos(inclination);
    
    const radius = 40;
    const cx = 50 + x * radius;
    const cy = 50 + y * radius;
    const r = 1 + (z + 1) * 0.75;
    const opacity = 0.3 + (z + 1) * 0.35;
    
    dots.push(
      <circle key={i} cx={cx} cy={cy} r={r} fill="#FFFFFF" opacity={opacity} />
    );
  }
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_12s_linear_infinite]">
        {dots}
      </svg>
      <div className="absolute inset-0 m-auto rounded-full bg-white/5 blur-lg animate-pulse" style={{ width: '70%', height: '70%' }} />
    </div>
  );
};

export default function BastionOverview() {
  return (
    <section className="bg-transparent text-white py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <FadeUp className="flex flex-col justify-start">
            <div role="heading" aria-level={2} className="text-3xl md:text-5xl font-light leading-tight mb-8 text-[#FFFFFF]">
              Govern AI with confidence.
              <span className="inline-block ml-4 align-middle translate-y-[-4px]">
                <AnimatedOrb size={84} />
              </span>
            </div>
            <p className="text-lg text-[#B3B3B3] font-light leading-relaxed mb-6">
              Enterprise AI requires more than intelligence. It requires governance, visibility, security, and operational trust.
            </p>
            <p className="text-lg text-[#B3B3B3] font-light leading-relaxed">
              Bastion helps organisations protect every AI deployment with enterprise-grade governance, policy enforcement, and complete operational visibility.
            </p>
          </FadeUp>

          <FadeUp staggerChildren={0.15} className="flex flex-col justify-center space-y-12">
            <FadeUpChild className="border-l border-[#1F1F1F] pl-6">
              <h3 className="text-xl font-medium mb-3 text-[#FFFFFF]">Visibility</h3>
              <p className="text-[#B3B3B3] font-light leading-relaxed">
                Know every AI system operating across your organisation.
              </p>
            </FadeUpChild>

            <FadeUpChild className="border-l border-[#1F1F1F] pl-6">
              <h3 className="text-xl font-medium mb-3 text-[#FFFFFF]">Governance</h3>
              <p className="text-[#B3B3B3] font-light leading-relaxed">
                Apply policies consistently across every deployment.
              </p>
            </FadeUpChild>

            <FadeUpChild className="border-l border-[#1F1F1F] pl-6">
              <h3 className="text-xl font-medium mb-3 text-[#FFFFFF]">Security</h3>
              <p className="text-[#B3B3B3] font-light leading-relaxed">
                Protect sensitive information without slowing innovation.
              </p>
            </FadeUpChild>

            <FadeUpChild className="border-l border-[#1F1F1F] pl-6">
              <h3 className="text-xl font-medium mb-3 text-[#FFFFFF]">Auditability</h3>
              <p className="text-[#B3B3B3] font-light leading-relaxed">
                Maintain complete visibility and accountability across every AI interaction.
              </p>
            </FadeUpChild>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
