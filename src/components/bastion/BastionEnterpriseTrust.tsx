'use client';

import { useRef, useEffect } from 'react';
import { FadeUp, FadeUpChild } from './FadeUp';
import { ShieldCheck, Lock, Network, FileSearch, Fingerprint, SlidersHorizontal } from 'lucide-react';
import { MetallicBorder } from './MetallicBorder';

const trustItems = [
  { 
    name: 'ISO 27001*', 
    desc: 'Adhering to international standards for information security management.',
    icon: ShieldCheck 
  },
  { 
    name: 'SOC 2*', 
    desc: 'Designed with strict security, availability, and confidentiality controls.',
    icon: Lock 
  },
  { 
    name: 'Zero Trust Architecture', 
    desc: 'Never trust, always verify. Granular access controls across all services.',
    icon: Network 
  },
  { 
    name: 'Audit Logging', 
    desc: 'Comprehensive immutable audit trails for all system and user activities.',
    icon: FileSearch 
  },
  { 
    name: 'Encrypted Communications', 
    desc: 'End-to-end encryption for data in transit using TLS 1.3 and at rest.',
    icon: Fingerprint 
  },
  { 
    name: 'Policy Governance', 
    desc: 'Centralized enforcement of security policies across multi-cloud environments.',
    icon: SlidersHorizontal 
  }
];

function TrustCard({ item, index }: { item: typeof trustItems[0], index: number }) {
  const Icon = item.icon;
  
  return (
    <FadeUpChild className="w-full">
      <MetallicBorder borderRadius="16px">
        <div className="group relative w-full h-full bg-[#050505] rounded-[16px] border border-white/5 overflow-hidden transition-all duration-500 hover:bg-[#0a0a0a] p-8 flex flex-col justify-between min-h-[220px]">
          
          {/* Subtle glowing radial background on hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/[0.06] group-hover:border-white/20 transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.0)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <Icon className="w-5 h-5 text-white/50 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-[#EAEAEA] group-hover:text-white transition-colors duration-300">
                {item.name}
              </h3>
              <p className="text-sm text-[#777777] leading-relaxed font-light group-hover:text-[#A0A0A0] transition-colors duration-300">
                {item.desc}
              </p>
            </div>
          </div>

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-bl-full pointer-events-none transform translate-x-8 -translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
        </div>
      </MetallicBorder>
    </FadeUpChild>
  );
}

export default function BastionEnterpriseTrust() {
  return (
    <section className="bg-transparent text-white py-32 border-t border-white/5 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl mb-20">
          <FadeUp className="flex flex-col justify-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-8 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#EAEAEA] animate-pulse" />
              <span className="text-xs font-mono text-white/70 uppercase tracking-widest">Enterprise Ready</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6 text-[#FFFFFF] tracking-tight">
              Trust every deployment.
            </h2>
            <div className="text-lg md:text-xl text-[#888888] font-light leading-relaxed">
              <p>Security should accelerate innovation, not slow it down. Bastion enables organisations to scale digital infrastructure with confidence through continuous protection and enterprise-grade resilience.</p>
            </div>
          </FadeUp>
        </div>

        <FadeUp staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustItems.map((item, index) => (
            <TrustCard key={index} item={item} index={index} />
          ))}
        </FadeUp>

        <FadeUp className="mt-16 flex justify-start">
          <p className="text-xs text-[#555555] font-mono tracking-wide">
            * Designed to support enterprise security practices. Formal certifications in progress.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
