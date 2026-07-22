import { FadeUp, FadeUpChild } from './FadeUp';

const domains = [
  {
    title: 'Visibility',
    description: 'Know every AI system operating across your organisation.',
  },
  {
    title: 'Governance',
    description: 'Apply policies consistently across every deployment.',
  },
  {
    title: 'Security',
    description: 'Protect sensitive information without slowing innovation.',
  },
  {
    title: 'Auditability',
    description: 'Maintain complete visibility and accountability across every AI interaction.',
  },
  {
    title: 'Operational Trust',
    description: 'Ensure every AI action meets strict regulatory and enterprise standards.',
  },
  {
    title: 'Continuous Assurance',
    description: 'Maintain long-term security and compliance as AI capabilities evolve.',
  },
];

export default function BastionDomains() {
  return (
    <section className="bg-transparent text-white py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeUp className="mb-16">
          <h2 className="text-3xl md:text-5xl font-light leading-tight text-[#FFFFFF]">
            Enterprise AI Assurance
          </h2>
        </FadeUp>
        <FadeUp staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {domains.map((domain, index) => (
            <FadeUpChild
              key={index}
              className="pt-4"
            >
              <h3 className="text-xl md:text-2xl font-light text-[#FFFFFF] mb-4">{domain.title}</h3>
              <p className="text-base md:text-lg text-[#B3B3B3] font-light leading-relaxed">
                {domain.description}
              </p>
            </FadeUpChild>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
