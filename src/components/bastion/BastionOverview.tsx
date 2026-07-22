import { FadeUp, FadeUpChild } from './FadeUp';

export default function BastionOverview() {
  return (
    <section className="bg-transparent text-white py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <FadeUp className="flex flex-col justify-start">
            <h2 className="text-3xl md:text-5xl font-light leading-tight mb-8 text-[#FFFFFF]">
              Built for infrastructure that cannot afford uncertainty.
            </h2>
            <p className="text-lg text-[#B3B3B3] font-light leading-relaxed mb-6">
              Bastion is an AI-native security operating layer that continuously observes infrastructure behavior, understands evolving threats, and autonomously coordinates defensive actions across cloud, applications, APIs, and edge environments.
            </p>
            <p className="text-lg text-[#B3B3B3] font-light leading-relaxed">
              Rather than relying on static signatures or isolated security tools, Bastion builds operational context from every interaction and improves with every decision.
            </p>
          </FadeUp>

          <FadeUp staggerChildren={0.15} className="flex flex-col justify-center space-y-12">
            <FadeUpChild className="border-l border-[#1F1F1F] pl-6">
              <h3 className="text-xl font-medium mb-3 text-[#FFFFFF]">Observe</h3>
              <p className="text-[#B3B3B3] font-light leading-relaxed">
                Continuously analyzes infrastructure behavior across every layer.
              </p>
            </FadeUpChild>
            
            <FadeUpChild className="border-l border-[#1F1F1F] pl-6">
              <h3 className="text-xl font-medium mb-3 text-[#FFFFFF]">Reason</h3>
              <p className="text-[#B3B3B3] font-light leading-relaxed">
                Correlates weak signals into contextual understanding.
              </p>
            </FadeUpChild>
            
            <FadeUpChild className="border-l border-[#1F1F1F] pl-6">
              <h3 className="text-xl font-medium mb-3 text-[#FFFFFF]">Respond</h3>
              <p className="text-[#B3B3B3] font-light leading-relaxed">
                Executes autonomous defensive actions in real time.
              </p>
            </FadeUpChild>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
