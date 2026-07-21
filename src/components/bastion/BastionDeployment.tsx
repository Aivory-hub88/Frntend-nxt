import { FadeUp, FadeUpChild } from './FadeUp';
import { Cloud, Network, Server, HardDrive, Cpu, Box } from 'lucide-react';

const deployments = [
  { name: 'Cloud', icon: Cloud },
  { name: 'Hybrid Cloud', icon: Network },
  { name: 'Private Infrastructure', icon: Server },
  { name: 'On-Premises', icon: HardDrive },
  { name: 'Edge', icon: Cpu },
  { name: 'Container Platforms', icon: Box }
];

export default function BastionDeployment() {
  return (
    <section className="bg-[#050505] text-white py-32 border-t border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeUp className="mb-16">
          <h2 className="text-3xl md:text-5xl font-light leading-tight text-[#FFFFFF]">
            Deploy where your infrastructure lives.
          </h2>
        </FadeUp>
        
        <FadeUp staggerChildren={0.1} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {deployments.map((deployment, index) => {
            const Icon = deployment.icon;
            return (
              <FadeUpChild key={index} className="bg-[#101010] border border-[#1F1F1F] p-6 flex flex-col items-center justify-center text-center aspect-square hover:border-[#333333] transition-colors">
                <Icon className="w-8 h-8 mb-4 text-[#B3B3B3] font-light" strokeWidth={1} />
                <span className="text-sm font-medium text-[#FFFFFF]">{deployment.name}</span>
              </FadeUpChild>
            );
          })}
        </FadeUp>
      </div>
    </section>
  );
}
