import { FadeUp, FadeUpChild } from './FadeUp';

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
    <section className="bg-transparent text-white py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeUp className="mb-20">
          <h2 className="text-3xl md:text-5xl font-light leading-tight text-[#FFFFFF] mb-6">
            Built for enterprise resilience.
          </h2>
          <div className="space-y-4 max-w-4xl text-lg text-[#B3B3B3] font-light leading-relaxed">
            <p>Modern security is measured by resilience. Not only by prevention.</p>
            <p>Bastion continuously monitors, analyses, and strengthens your defensive posture while maintaining operational continuity.</p>
          </div>
        </FadeUp>

        <FadeUp staggerChildren={0.1} className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16">
          {metrics.map((metric, index) => (
            <FadeUpChild key={index} className="flex flex-col">
              <span className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-2 md:mb-4 tracking-tight">
                {metric.value}
              </span>
              <span className="text-sm md:text-base text-[#B3B3B3] uppercase tracking-widest">
                {metric.label}
              </span>
            </FadeUpChild>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
