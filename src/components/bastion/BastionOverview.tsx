'use client';

import { FadeUp, FadeUpChild } from './FadeUp';
import { ThinkingOrb } from 'thinking-orbs';

export default function BastionOverview() {
  return (
    <section className="bg-transparent text-white py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <FadeUp className="flex flex-col justify-start">
            <div className="flex items-center gap-8 md:gap-12 mb-8">
              <div role="heading" aria-level={2} className="text-3xl md:text-5xl font-light leading-tight text-[#FFFFFF]">
                Adaptive defense for <br className="hidden md:block" /> modern enterprises.
              </div>
              <div className="flex-shrink-0">
                <ThinkingOrb state="solving" size={64} theme="dark" />
              </div>
            </div>
            <p className="text-lg text-[#B3B3B3] font-light leading-relaxed mb-6">
              Enterprise threats evolve continuously. Traditional security reacts after compromise.
            </p>
            <p className="text-lg text-[#B3B3B3] font-light leading-relaxed">
              Bastion combines AI-powered detection, adaptive defense, and continuous monitoring to protect digital assets before threats become incidents.
            </p>
          </FadeUp>

          <FadeUp staggerChildren={0.15} className="space-y-12">
            <FadeUpChild className="border-l-2 border-white/20 pl-6 py-2">
              <h3 className="text-xl font-light text-white mb-2">Autonomous Operations</h3>
              <p className="text-[#B3B3B3] font-light leading-relaxed">
                Security logic executes continuously without human intervention, analyzing millions of telemetry signals per second.
              </p>
            </FadeUpChild>

            <FadeUpChild className="border-l-2 border-white/20 pl-6 py-2">
              <h3 className="text-xl font-light text-white mb-2">Zero-Trust Posture</h3>
              <p className="text-[#B3B3B3] font-light leading-relaxed">
                Every request, endpoint, and data transaction is continuously verified in real time against contextual risk parameters.
              </p>
            </FadeUpChild>

            <FadeUpChild className="border-l-2 border-white/20 pl-6 py-2">
              <h3 className="text-xl font-light text-white mb-2">Resilient Infrastructure</h3>
              <p className="text-[#B3B3B3] font-light leading-relaxed">
                Designed to isolate anomalies instantly while maintaining critical operational uptime across cloud environments.
              </p>
            </FadeUpChild>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
