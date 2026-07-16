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

const privacyPoints = [
  { text: 'We don\'t train\non your data.', icon: <ShieldIcon className="w-6 h-6 shrink-0 text-[#D4AF37]" /> },
  { text: 'Processed locally.\nStored locally.', icon: <CpuIcon className="w-6 h-6 shrink-0 text-[#D4AF37]" /> },
  { text: 'GDPR compliant\nby design.', icon: <GdprIcon className="w-6 h-6 shrink-0" /> },
];

const badges = [
  { label: 'Zero server logging', icon: 'ti ti-server-off' },
  { label: 'End to end private', icon: 'ti ti-lock' },
  { label: 'Encrypted at rest', icon: 'ti ti-shield-lock' },
  { label: 'No third-party sharing', icon: 'ti ti-share-off' },
  { label: 'Enterprise grade', icon: 'ti ti-briefcase' },
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

            {/* Privacy Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl">
              {privacyPoints.map((point) => (
                <SpotlightButton 
                  key={point.text} 
                  icon={point.icon}
                  roundedClass="rounded-md"
                  className="!items-start h-full"
                >
                  <p className="text-sm md:text-[15px] font-medium leading-snug whitespace-pre-line text-[#dadada] group-hover:text-white transition-colors">{point.text}</p>
                </SpotlightButton>
              ))}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-4">
              {badges.map((badge) => (
                <SpotlightButton 
                  key={badge.label}
                  icon={<i className={`${badge.icon} text-[#a3aa96] shrink-0 text-[16px]`}></i>}
                  roundedClass="rounded-sm"
                  className="text-xs md:text-sm normal-case font-medium uppercase-override-disabled"
                  style={{ textTransform: 'none' }}
                >
                  {badge.label}
                </SpotlightButton>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
