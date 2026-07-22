import { FadeUp, FadeUpChild } from './FadeUp';
import { SpotlightButton } from '@/components/ui/SpotlightButton';

const badges = [
  'ISO 27001*',
  'SOC 2*',
  'Zero Trust Architecture',
  'Audit Logging',
  'Encrypted Communications',
  'Policy Governance',
];

export default function BastionEnterpriseTrust() {
  return (
    <section className="bg-transparent text-white py-32 border-t border-[#1F1F1F]">
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
            <FadeUpChild key={index}>
              <SpotlightButton
                icon={false}
                roundedClass="rounded-[10px]"
                className="!items-center normal-case text-left"
                style={{
                  textTransform: 'none',
                  backgroundColor: 'rgba(20, 20, 26, 0.3)',
                  borderWidth: '0.5px',
                  borderStyle: 'solid',
                  borderColor: 'rgba(255, 255, 255, 0.035)',
                  padding: '0.75rem 1.25rem',
                  boxShadow: 'none',
                }}
              >
                <span className="text-sm md:text-[15px] font-medium text-[#dadada] group-hover:text-white transition-colors">
                  {badge}
                </span>
              </SpotlightButton>
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
