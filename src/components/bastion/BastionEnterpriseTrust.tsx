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
    <section className="bg-transparent text-white py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-16">
          <FadeUp className="flex flex-col justify-start">
            <h2 className="text-3xl md:text-5xl font-light leading-tight mb-8 text-[#FFFFFF]">
              Trust every deployment.
            </h2>
            <div className="space-y-4 text-lg text-[#B3B3B3] font-light leading-relaxed">
              <p>Every deployment should be visible. Every workflow should be governed. Every decision should be accountable.</p>
              <p>Deploy AI securely. Protect every workflow. Govern every decision. Build operational trust from day one.</p>
              <p className="text-white font-normal pt-2">Bastion makes enterprise AI trustworthy at scale.</p>
            </div>
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
