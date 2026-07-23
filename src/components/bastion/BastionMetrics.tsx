'use client';

import { FadeUp, FadeUpChild } from './FadeUp';
import { ThinkingOrb, OrbState } from 'thinking-orbs';

const metrics: { value: string; label: string; state: OrbState }[] = [
  { value: '24/7', label: 'Continuous Monitoring', state: 'listening' },
  { value: 'Adaptive', label: 'Threat Response', state: 'solving' },
  { value: 'Enterprise', label: 'Operational Resilience', state: 'working' },
  { value: '100%', label: 'Security Visibility', state: 'searching' },
  { value: 'Continuous', label: 'Operational Intelligence', state: 'composing' },
  { value: 'Zero Trust', label: 'Access Protection', state: 'shaping' },
];

export default function BastionMetrics() {
  return (
    <section className="bg-transparent text-white py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <FadeUp className="mb-16">
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
        </FadeUp>

        {/* 6 Metrics Grid with unique ThinkingOrb state per item */}
        <FadeUp staggerChildren={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {metrics.map((metric, index) => (
            <FadeUpChild 
              key={index} 
              className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/25 hover:bg-white/[0.06] transition-all duration-300 backdrop-blur-md group shadow-lg"
            >
              <div className="shrink-0 flex items-center justify-center">
                <ThinkingOrb state={metric.state} size={64} theme="dark" />
              </div>
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
