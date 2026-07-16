'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { SpotlightButton } from '@/components/ui/SpotlightButton';

/* ─── Custom Icons ─── */
function ShieldIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldBase" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8C7322" />
          <stop offset="1" stopColor="#3D320E" />
        </linearGradient>
        <linearGradient id="shieldHighlight" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4AF37" stopOpacity="0.8" />
          <stop offset="0.5" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="shieldInner" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B5952F" />
          <stop offset="1" stopColor="#5C4B16" />
        </linearGradient>
        <filter id="glowShield" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Outer Base (Dark/Shadow) */}
      <path d="M50 5 L10 20 V45 C10 70 30 90 50 95 C70 90 90 70 90 45 V20 L50 5 Z" fill="url(#shieldBase)" />
      
      {/* Outer Highlight */}
      <path d="M50 5 L10 20 V45 C10 70 30 90 50 95 C70 90 90 70 90 45 V20 L50 5 Z" fill="url(#shieldHighlight)" />
      
      {/* Inner Raised Area */}
      <path d="M50 15 L20 26 V45 C20 63 35 78 50 82 C65 78 80 63 80 45 V26 L50 15 Z" fill="url(#shieldInner)" />
      
      {/* Inner Edge Highlight */}
      <path d="M50 15 L20 26 V45 C20 63 35 78 50 82 C65 78 80 63 80 45 V26 L50 15 Z" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.6" />
      
      {/* Center Checkmark with Glow */}
      <path d="M35 50 L45 60 L65 35" stroke="#F8EAB7" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glowShield)" />
    </svg>
  );
}

function CpuIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cpuBase" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3D320E" />
          <stop offset="1" stopColor="#1F1907" />
        </linearGradient>
        <linearGradient id="cpuChip" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A68A27" />
          <stop offset="1" stopColor="#5C4B16" />
        </linearGradient>
        <linearGradient id="cpuPin" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4AF37" />
          <stop offset="1" stopColor="#A68A27" />
        </linearGradient>
        <filter id="glowCpu" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Pins Top */}
      <rect x="25" y="5" width="8" height="15" fill="url(#cpuPin)" rx="2" />
      <rect x="46" y="5" width="8" height="15" fill="url(#cpuPin)" rx="2" />
      <rect x="67" y="5" width="8" height="15" fill="url(#cpuPin)" rx="2" />
      
      {/* Pins Bottom */}
      <rect x="25" y="80" width="8" height="15" fill="url(#cpuPin)" rx="2" />
      <rect x="46" y="80" width="8" height="15" fill="url(#cpuPin)" rx="2" />
      <rect x="67" y="80" width="8" height="15" fill="url(#cpuPin)" rx="2" />
      
      {/* Pins Left */}
      <rect x="5" y="25" width="15" height="8" fill="url(#cpuPin)" rx="2" />
      <rect x="5" y="46" width="15" height="8" fill="url(#cpuPin)" rx="2" />
      <rect x="5" y="67" width="15" height="8" fill="url(#cpuPin)" rx="2" />
      
      {/* Pins Right */}
      <rect x="80" y="25" width="15" height="8" fill="url(#cpuPin)" rx="2" />
      <rect x="80" y="46" width="15" height="8" fill="url(#cpuPin)" rx="2" />
      <rect x="80" y="67" width="15" height="8" fill="url(#cpuPin)" rx="2" />

      {/* Base Board */}
      <rect x="15" y="15" width="70" height="70" rx="8" fill="url(#cpuBase)" stroke="#8C7322" strokeWidth="2" />
      
      {/* Inner Chip (Raised) */}
      <rect x="30" y="30" width="40" height="40" rx="4" fill="url(#cpuChip)" />
      
      {/* Chip Bevel Highlight */}
      <rect x="30" y="30" width="40" height="40" rx="4" fill="none" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.8" />
      
      {/* Glowing Circuit Center */}
      <rect x="42" y="42" width="16" height="16" rx="2" fill="#F8EAB7" filter="url(#glowCpu)" />
      <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
    </svg>
  );
}

function GdprIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <polygon id="star" points="0,-4 1.17,-0.38 5,-0.38 1.91,1.86 3.09,5.62 0,3.38 -3.09,5.62 -1.91,1.86 -5,-0.38 -1.17,-0.38" fill="#FFCC00" />
      </defs>
      <circle cx="50" cy="50" r="50" fill="#003399" />
      <use href="#star" x="50" y="15" />
      <use href="#star" x="67.5" y="19.689" />
      <use href="#star" x="80.311" y="32.5" />
      <use href="#star" x="85" y="50" />
      <use href="#star" x="80.311" y="67.5" />
      <use href="#star" x="67.5" y="80.311" />
      <use href="#star" x="50" y="85" />
      <use href="#star" x="32.5" y="80.311" />
      <use href="#star" x="19.689" y="67.5" />
      <use href="#star" x="15" y="50" />
      <use href="#star" x="19.689" y="32.5" />
      <use href="#star" x="32.5" y="19.689" />
      <text x="50" y="56" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="22" textAnchor="middle">GDPR</text>
    </svg>
  );
}
function ServerOffIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="srvBase" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2A2A2A" />
          <stop offset="1" stopColor="#111111" />
        </linearGradient>
        <linearGradient id="srvHighlight" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#555555" />
          <stop offset="1" stopColor="#222222" />
        </linearGradient>
      </defs>
      <rect x="20" y="10" width="60" height="80" rx="8" fill="url(#srvBase)" stroke="#555555" strokeWidth="2" />
      <rect x="25" y="25" width="50" height="10" rx="2" fill="url(#srvHighlight)" />
      <rect x="25" y="45" width="50" height="10" rx="2" fill="url(#srvHighlight)" />
      <rect x="25" y="65" width="50" height="10" rx="2" fill="url(#srvHighlight)" />
      <path d="M15 85 L85 15" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lockBase" x1="0" y1="40" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A68A27" />
          <stop offset="1" stopColor="#5C4B16" />
        </linearGradient>
      </defs>
      <path d="M30 40 V25 C30 15 70 15 70 25 V40" stroke="#888888" strokeWidth="10" strokeLinecap="round" />
      <rect x="20" y="40" width="60" height="50" rx="8" fill="url(#lockBase)" stroke="#D4AF37" strokeWidth="2" />
      <circle cx="50" cy="65" r="8" fill="#111111" />
      <path d="M48 65 L46 80 H54 L52 65 Z" fill="#111111" />
    </svg>
  );
}

function ShieldLockIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldLockBase" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3D320E" />
          <stop offset="1" stopColor="#1F1907" />
        </linearGradient>
      </defs>
      <path d="M50 5 L10 20 V45 C10 70 30 90 50 95 C70 90 90 70 90 45 V20 L50 5 Z" fill="url(#shieldLockBase)" stroke="#D4AF37" strokeWidth="3" />
      <path d="M40 45 V35 C40 28 60 28 60 35 V45" stroke="#A68A27" strokeWidth="6" strokeLinecap="round" />
      <rect x="35" y="45" width="30" height="25" rx="4" fill="#D4AF37" />
      <circle cx="50" cy="57" r="4" fill="#111111" />
    </svg>
  );
}

function ShareOffIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shareGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A68A27" />
          <stop offset="1" stopColor="#5C4B16" />
        </linearGradient>
      </defs>
      <circle cx="25" cy="50" r="12" fill="url(#shareGrad)" />
      <circle cx="75" cy="25" r="12" fill="url(#shareGrad)" />
      <circle cx="75" cy="75" r="12" fill="url(#shareGrad)" />
      <path d="M35 45 L65 30" stroke="url(#shareGrad)" strokeWidth="6" strokeLinecap="round" />
      <path d="M35 55 L65 70" stroke="url(#shareGrad)" strokeWidth="6" strokeLinecap="round" />
      <path d="M15 85 L85 15" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="briefcaseBase" x1="0" y1="20" x2="0" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#333333" />
          <stop offset="1" stopColor="#111111" />
        </linearGradient>
      </defs>
      <path d="M40 25 V15 C40 10 60 10 60 15 V25" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round" />
      <rect x="15" y="25" width="70" height="60" rx="6" fill="url(#briefcaseBase)" stroke="#5C4B16" strokeWidth="3" />
      <rect x="15" y="25" width="70" height="15" fill="#222222" />
      <rect x="30" y="35" width="10" height="10" rx="2" fill="#D4AF37" />
      <rect x="60" y="35" width="10" height="10" rx="2" fill="#D4AF37" />
    </svg>
  );
}

const privacyPoints = [
  { text: 'We don\'t train on your data.', icon: <ShieldIcon className="w-6 h-6 shrink-0 text-[#D4AF37]" /> },
  { text: 'Processed & Stored Locally', icon: <CpuIcon className="w-6 h-6 shrink-0 text-[#D4AF37]" /> },
  { text: 'GDPR compliant by design.', icon: <GdprIcon className="w-6 h-6 shrink-0" /> },
];

const badges = [
  { text: 'Zero server logging', icon: <ServerOffIcon className="w-6 h-6 shrink-0" /> },
  { text: 'End to end private', icon: <LockIcon className="w-6 h-6 shrink-0" /> },
  { text: 'Encrypted at rest', icon: <ShieldLockIcon className="w-6 h-6 shrink-0" /> },
  { text: 'No third-party sharing', icon: <ShareOffIcon className="w-6 h-6 shrink-0" /> },
  { text: 'Enterprise grade', icon: <BriefcaseIcon className="w-6 h-6 shrink-0" /> },
];

const trustBadges = ['Enterprise Grade', 'GDPR Compliant', 'SOC 2 Ready'];

export default function PrivacySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full text-white pt-24 pb-12 font-sans`}>
      <div style={{ zoom: 0.85 }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
            <div className="text-sm font-medium">Privacy &amp; Security</div>

          </div>
          <h2 className="no-word-split text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight leading-[1.2] mb-10">
            Your data stays<br />where it belongs.
          </h2>

          <div className="border-t border-white/20 pt-8 mt-12">
            <p className="text-lg md:text-xl font-light mb-12">
              No training. No logging. No exceptions. Everything runs in your browser.
            </p>

            {/* Privacy & Badges Stack (3-2-3) */}
            <div className="flex flex-col gap-6 md:gap-8 w-full max-w-5xl mx-auto items-center mt-12 mb-16">
              {/* Row 1: 3 boxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
                {privacyPoints.map((point) => (
                  <SpotlightButton 
                    key={point.text} 
                    icon={point.icon}
                    roundedClass="rounded-md"
                    className="!items-start h-full w-full normal-case"
                    style={{ textTransform: 'none' }}
                  >
                    <p className="text-sm md:text-[15px] font-medium leading-snug whitespace-pre-line text-[#dadada] group-hover:text-white transition-colors">{point.text}</p>
                  </SpotlightButton>
                ))}
              </div>
              
              {/* Row 2: 2 boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full md:max-w-3xl mx-auto">
                {badges.slice(0, 2).map((badge) => (
                  <SpotlightButton 
                    key={badge.text}
                    icon={badge.icon}
                    roundedClass="rounded-md"
                    className="!items-start h-full w-full normal-case"
                    style={{ textTransform: 'none', backgroundColor: 'rgba(20, 20, 26, 0.3)' }}
                  >
                    <p className="text-sm md:text-[15px] font-medium leading-snug whitespace-pre-line text-[#dadada] group-hover:text-white transition-colors">{badge.text}</p>
                  </SpotlightButton>
                ))}
              </div>
              
              {/* Row 3: 3 boxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
                {badges.slice(2, 5).map((badge) => (
                  <SpotlightButton 
                    key={badge.text}
                    icon={badge.icon}
                    roundedClass="rounded-md"
                    className="!items-start h-full w-full normal-case"
                    style={{ textTransform: 'none', backgroundColor: 'rgba(20, 20, 26, 0.3)' }}
                  >
                    <p className="text-sm md:text-[15px] font-medium leading-snug whitespace-pre-line text-[#dadada] group-hover:text-white transition-colors">{badge.text}</p>
                  </SpotlightButton>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
