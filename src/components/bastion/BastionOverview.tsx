import { FadeUp, FadeUpChild } from './FadeUp';

export default function BastionOverview() {
  return (
    <section className="bg-transparent text-white py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <FadeUp className="flex flex-col justify-start">
            <h2 className="text-3xl md:text-5xl font-light leading-tight mb-8 text-[#FFFFFF]">
              Govern AI with confidence.
            </h2>
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
