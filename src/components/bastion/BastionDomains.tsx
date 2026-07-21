import { FadeUp, FadeUpChild } from './FadeUp';

const domains = [
  {
    title: 'Situational Awareness',
    description: 'Maintains continuous operational visibility across infrastructure.'
  },
  {
    title: 'Behavioral Identity',
    description: 'Recognizes trusted and untrusted behavior beyond static identities.'
  },
  {
    title: 'Threat Reasoning',
    description: 'Correlates telemetry into meaningful security decisions.'
  },
  {
    title: 'Autonomous Containment',
    description: 'Responds immediately without disrupting legitimate operations.'
  },
  {
    title: 'Deception Architecture',
    description: 'Redirects hostile actors into controlled environments.'
  },
  {
    title: 'Continuous Evolution',
    description: 'Improves defensive intelligence after every interaction.'
  }
];

export default function BastionDomains() {
  return (
    <section className="bg-[#050505] text-white py-32 border-t border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeUp className="mb-16">
          <h2 className="text-3xl md:text-5xl font-light leading-tight text-[#FFFFFF]">
            Defense Intelligence Domains
          </h2>
        </FadeUp>
        <FadeUp staggerChildren={0.1} className="flex flex-col max-w-4xl">
          {domains.map((domain, index) => (
            <FadeUpChild 
              key={index} 
              className="border-b border-[#1F1F1F] pb-12 mb-12 last:border-b-0 last:pb-0 last:mb-0"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] mb-6">{domain.title}</h3>
              <p className="text-lg md:text-xl text-[#B3B3B3] font-light leading-relaxed">
                {domain.description}
              </p>
            </FadeUpChild>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
