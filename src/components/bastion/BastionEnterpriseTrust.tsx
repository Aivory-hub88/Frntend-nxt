import { FadeUp, FadeUpChild } from './FadeUp';

const badges = [
  'ISO 27001*',
  'SOC 2*',
  'Zero Trust Architecture',
  'Audit Logging',
  'Encrypted Communications',
  'Policy Governance'
];

export default function BastionEnterpriseTrust() {
  return (
    <section className="bg-[#050505] text-white py-32 border-t border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-16">
          <FadeUp className="flex flex-col justify-start">
            <h2 className="text-3xl md:text-5xl font-light leading-tight mb-8 text-[#FFFFFF]">
              Enterprise Ready.
            </h2>
            <p className="text-lg text-[#B3B3B3] font-light leading-relaxed">
              Built with enterprise-grade architecture, secure deployment models, comprehensive auditability, and operational transparency designed for organizations protecting mission-critical infrastructure.
            </p>
          </FadeUp>
        </div>
        
        <FadeUp staggerChildren={0.1} className="flex flex-wrap gap-4">
          {badges.map((badge, index) => (
            <FadeUpChild key={index} className="bg-[#101010] border border-[#1F1F1F] px-6 py-3 text-sm font-medium text-[#B3B3B3]">
              {badge}
            </FadeUpChild>
          ))}
        </FadeUp>
        
        <FadeUp className="mt-8">
          <p className="text-xs text-[#B3B3B3]/50 font-light">
            * Designed to support enterprise security practices. Formal certifications in progress.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
