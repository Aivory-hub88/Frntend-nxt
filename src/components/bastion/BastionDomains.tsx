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
        
        <FadeUp staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain, index) => (
            <FadeUpChild key={index} className="bg-[#101010] border border-[#1F1F1F] p-8 hover:border-[#333333] transition-colors flex flex-col justify-between min-h-[200px]">
              <div>
                <h3 className="text-lg font-medium text-[#FFFFFF] mb-4">{domain.title}</h3>
                <p className="text-[#B3B3B3] font-light leading-relaxed text-sm">
                  {domain.description}
                </p>
              </div>
            </FadeUpChild>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
