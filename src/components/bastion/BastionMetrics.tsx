'use client';

import { FadeUp, FadeUpChild } from './FadeUp';

const AnimatedOrb = ({ size = 56 }: { size?: number }) => {
  const dots = [];
  const numDots = 40;
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
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_12s_linear_infinite]">
        {dots}
      </svg>
      <div className="absolute inset-0 m-auto rounded-full bg-white/5 blur-md animate-pulse" style={{ width: '70%', height: '70%' }} />
    </div>
  );
};

const metrics = [
  { value: '24/7', label: 'Continuous Monitoring' },
  { value: 'Adaptive', label: 'Threat Response' },
  { value: 'Enterprise', label: 'Operational Resilience' },
  { value: '100%', label: 'Security Visibility' },
  { value: 'Continuous', label: 'Operational Intelligence' },
  { value: 'Zero Trust', label: 'Access Protection' },
];

export default function BastionMetrics() {
  return (
    <section className="bg-transparent text-white py-32 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <FadeUp className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-[#B3B3B3] uppercase mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Autonomous Resilience
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight text-white mb-6 tracking-tight">
              Built for enterprise resilience.
            </h2>
            <div className="space-y-4 max-w-3xl text-lg text-[#B3B3B3] font-light leading-relaxed">
              <p>Modern security is measured by resilience. Not only by prevention.</p>
              <p>Bastion continuously monitors, analyses, and strengthens your defensive posture while maintaining operational continuity.</p>
            </div>
          </div>
          <div className="hidden lg:block shrink-0 mb-2">
            <AnimatedOrb size={84} />
          </div>
        </FadeUp>

        {/* 6 Metrics Grid with Animated Orb per item */}
        <FadeUp staggerChildren={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {metrics.map((metric, index) => (
            <FadeUpChild 
              key={index} 
              className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/25 hover:bg-white/[0.06] transition-all duration-300 backdrop-blur-md group shadow-lg"
            >
              <AnimatedOrb size={52} />
              <div className="flex flex-col min-w-0">
                <span className="text-3xl md:text-4xl font-light text-white mb-1 tracking-tight truncate">
                  {metric.value}
                </span>
                <span className="text-xs text-[#B3B3B3] uppercase tracking-widest font-mono font-medium truncate">
                  {metric.label}
                </span>
              </div>
            </FadeUpChild>
          ))}
        </FadeUp>

      </div>
    </section>
  );
}
