'use client';

import { useRef, useEffect } from 'react';
import { FadeUp, FadeUpChild } from './FadeUp';

const s = "stroke-white/20 stroke-[0.5] fill-transparent";

const SvgIso = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 z-0">
    <path d="M50 20 L20 30 V60 C20 85 45 105 50 110 C55 105 80 85 80 60 V30 Z" className={s} />
    <circle cx="50" cy="55" r="15" className={s} />
    <circle cx="50" cy="55" r="5" className={s} />
  </svg>
);

const SvgSoc = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 z-0">
    <circle cx="30" cy="40" r="4" className={s} />
    <circle cx="70" cy="40" r="4" className={s} />
    <circle cx="50" cy="60" r="4" className={s} />
    <circle cx="30" cy="80" r="4" className={s} />
    <circle cx="70" cy="80" r="4" className={s} />
    <line x1="30" y1="44" x2="50" y2="56" className={s} />
    <line x1="70" y1="44" x2="50" y2="56" className={s} />
    <line x1="50" y1="64" x2="30" y2="76" className={s} />
    <line x1="50" y1="64" x2="70" y2="76" className={s} />
    <rect x="20" y="30" width="60" height="60" rx="4" className={s} strokeDasharray="4 4" />
  </svg>
);

const SvgZeroTrust = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 z-0">
    <circle cx="50" cy="60" r="10" className={s} />
    <path d="M30 60 A20 20 0 0 1 70 60" className={s} />
    <path d="M70 60 A20 20 0 0 1 30 60" className={s} strokeDasharray="4 4" />
    <path d="M20 60 A30 30 0 0 1 80 60" className={s} strokeDasharray="6 6" />
    <path d="M80 60 A30 30 0 0 1 20 60" className={s} />
    <circle cx="50" cy="20" r="4" className={s} />
    <circle cx="50" cy="100" r="4" className={s} />
    <circle cx="10" cy="60" r="4" className={s} />
    <circle cx="90" cy="60" r="4" className={s} />
  </svg>
);

const SvgAudit = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 z-0">
    <rect x="25" y="25" width="50" height="70" rx="2" className={s} />
    <line x1="35" y1="40" x2="65" y2="40" className={s} />
    <line x1="35" y1="55" x2="55" y2="55" className={s} />
    <line x1="35" y1="70" x2="65" y2="70" className={s} strokeDasharray="2 2" />
    <line x1="35" y1="85" x2="45" y2="85" className={s} />
    <circle cx="70" cy="85" r="8" className={s} />
    <line x1="75" y1="90" x2="82" y2="97" className={s} />
  </svg>
);

const SvgCrypto = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 z-0">
    <path d="M20 60 Q35 30 50 60 T80 60" className={s} />
    <path d="M20 50 Q35 20 50 50 T80 50" className={s} strokeDasharray="2 4" />
    <path d="M20 70 Q35 40 50 70 T80 70" className={s} strokeDasharray="2 4" />
    <circle cx="50" cy="60" r="6" className={s} />
    <circle cx="20" cy="60" r="3" className={s} />
    <circle cx="80" cy="60" r="3" className={s} />
  </svg>
);

const SvgPolicy = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 z-0">
    <rect x="30" y="30" width="40" height="60" rx="4" className={s} />
    <line x1="20" y1="45" x2="80" y2="45" className={s} />
    <line x1="20" y1="75" x2="80" y2="75" className={s} />
    <circle cx="50" cy="60" r="10" className={s} />
    <circle cx="50" cy="60" r="4" className={s} />
    <line x1="50" y1="20" x2="50" y2="30" className={s} />
    <line x1="50" y1="90" x2="50" y2="100" className={s} />
  </svg>
);

const trustItems = [
  { name: 'ISO 27001*', bg: SvgIso },
  { name: 'SOC 2*', bg: SvgSoc },
  { name: 'Zero Trust Architecture', bg: SvgZeroTrust },
  { name: 'Audit Logging', bg: SvgAudit },
  { name: 'Encrypted Communications', bg: SvgCrypto },
  { name: 'Policy Governance', bg: SvgPolicy }
];

function TrustCard({ item }: { item: typeof trustItems[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Bg = item.bg;

  useEffect(() => {
    const startTime = Math.random() * 10000;
    let animationFrameId: number;
    let isHovering = false;

    const animate = (time: number) => {
      if (cardRef.current && !isHovering) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const radiusX = rect.width / 2;
        const radiusY = rect.height / 2;
        const speed = 0.001; 
        const angle = (time + startTime) * speed;
        
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY - radiusY * Math.sin(angle);
        
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const el = cardRef.current;
    if (el) {
      el.addEventListener('mouseenter', () => isHovering = true);
      el.addEventListener('mouseleave', () => isHovering = false);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (el) {
        el.removeEventListener('mouseenter', () => isHovering = true);
        el.removeEventListener('mouseleave', () => isHovering = false);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <FadeUpChild className="w-full">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="group relative bg-black rounded-[24px] border border-white/10 overflow-hidden aspect-[4/3] md:aspect-[3/2] transition-colors hover:border-white/20 flex items-end p-6 md:p-8 spotlight-card auto-spotlight w-full"
      >
        <div className="!absolute inset-0 z-0 pointer-events-none">
          <Bg />
        </div>
        <div className="!absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />
        <span className="relative z-20 text-sm md:text-base font-medium text-[#EAEAEA] group-hover:text-white transition-colors pointer-events-none">
          {item.name}
        </span>
      </div>
    </FadeUpChild>
  );
}

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

        <FadeUp staggerChildren={0.1} className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {trustItems.map((item, index) => (
            <TrustCard key={index} item={item} />
          ))}
        </FadeUp>

        <FadeUp className="mt-8">
          <p className="text-xs text-[#B3B3B3]/50 font-light text-center md:text-left">
            * Designed to support enterprise security practices. Formal certifications in progress.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
