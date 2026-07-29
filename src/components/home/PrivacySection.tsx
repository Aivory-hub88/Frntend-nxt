'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

function ShieldIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} style={{ width: 56, height: 56 }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="privacyShieldBase" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="45.1%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="privacyShieldEdge" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d="M50 10 C50 10 15 20 15 20 C15 55 15 75 50 95 C85 75 85 55 85 20 C85 20 50 10 50 10 Z"
        fill="url(#privacyShieldBase)"
        stroke="url(#privacyShieldEdge)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M35 50 L45 62 L65 38" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CpuIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} style={{ width: 56, height: 56 }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="privacyCpuBase" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="45.1%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="privacyCpuEdge" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="60" height="60" rx="12" fill="url(#privacyCpuBase)" stroke="url(#privacyCpuEdge)" strokeWidth="3" />
      <rect x="35" y="35" width="30" height="30" rx="6" fill="url(#privacyCpuBase)" stroke="url(#privacyCpuEdge)" strokeWidth="2" />
      <path
        d="M30 10 V20 M50 10 V20 M70 10 V20 M30 80 V90 M50 80 V90 M70 80 V90 M10 30 H20 M10 50 H20 M10 70 H20 M80 30 H90 M80 50 H90 M80 70 H90"
        stroke="url(#privacyCpuBase)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GdprIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} style={{ width: 56, height: 56 }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="privacyGdprBase" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="45.1%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="privacyGdprEdge" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill="url(#privacyGdprBase)" stroke="url(#privacyGdprEdge)" strokeWidth="3" />
      <text x="50" y="58" fill="#FFFFFF" fontFamily="-apple-system, sans-serif" fontWeight="800" fontSize="26" textAnchor="middle">
        GDPR
      </text>
    </svg>
  );
}

function ServerOffIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} style={{ width: 56, height: 56 }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="privacyServerBase" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="45.1%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="privacyServerEdge" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {[15, 40, 65].map((y) => (
        <g key={y}>
          <rect x="25" y={y} width="50" height="20" rx="4" fill="url(#privacyServerBase)" stroke="url(#privacyServerEdge)" strokeWidth="2" />
          <circle cx="35" cy={y + 10} r="3" fill="#FFFFFF" />
          <circle cx="45" cy={y + 10} r="3" fill="#FFFFFF" />
        </g>
      ))}
      <path d="M20 80 L80 20" stroke="url(#privacyServerBase)" strokeWidth="8" strokeLinecap="round" />
      <path d="M20 80 L80 20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} style={{ width: 56, height: 56 }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="privacyLockBase" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="45.1%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="privacyLockEdge" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M30 45 V30 C30 18 70 18 70 30 V45" stroke="url(#privacyLockBase)" strokeWidth="12" strokeLinecap="round" />
      <path d="M30 45 V30 C30 18 70 18 70 30 V45" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      <rect x="20" y="45" width="60" height="45" rx="8" fill="url(#privacyLockBase)" stroke="url(#privacyLockEdge)" strokeWidth="3" />
      <circle cx="50" cy="62" r="6" fill="#FFFFFF" />
      <path d="M48 62 L46 75 H54 L52 62 Z" fill="#FFFFFF" />
    </svg>
  );
}

function ShieldLockIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} style={{ width: 56, height: 56 }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="privacyShieldLockBase" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="45.1%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="privacyShieldLockEdge" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d="M50 10 C50 10 15 20 15 20 C15 55 15 75 50 95 C85 75 85 55 85 20 C85 20 50 10 50 10 Z"
        fill="url(#privacyShieldLockBase)"
        stroke="url(#privacyShieldLockEdge)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M40 45 V35 C40 28 60 28 60 35 V45" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <rect x="34" y="45" width="32" height="26" rx="4" fill="url(#privacyShieldLockBase)" stroke="url(#privacyShieldLockEdge)" strokeWidth="2" />
      <circle cx="50" cy="55" r="4" fill="#FFFFFF" />
      <path d="M49 55 L48 62 H52 L51 55 Z" fill="#FFFFFF" />
    </svg>
  );
}

function ShareOffIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} style={{ width: 56, height: 56 }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="privacyShareBase" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="45.1%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="privacyShareEdge" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M30 50 L70 25 M30 50 L70 75" stroke="url(#privacyShareBase)" strokeWidth="8" strokeLinecap="round" />
      <circle cx="30" cy="50" r="12" fill="url(#privacyShareBase)" stroke="url(#privacyShareEdge)" strokeWidth="2" />
      <circle cx="70" cy="25" r="12" fill="url(#privacyShareBase)" stroke="url(#privacyShareEdge)" strokeWidth="2" />
      <circle cx="70" cy="75" r="12" fill="url(#privacyShareBase)" stroke="url(#privacyShareEdge)" strokeWidth="2" />
      <path d="M20 80 L80 20" stroke="url(#privacyShareBase)" strokeWidth="8" strokeLinecap="round" />
      <path d="M20 80 L80 20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} style={{ width: 56, height: 56 }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="privacyBriefcaseBase" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="45.1%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="privacyBriefcaseEdge" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M38 30 V18 C38 12 62 12 62 18 V30" stroke="url(#privacyBriefcaseBase)" strokeWidth="8" strokeLinecap="round" />
      <path d="M38 30 V18 C38 12 62 12 62 18 V30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <rect x="15" y="30" width="70" height="55" rx="8" fill="url(#privacyBriefcaseBase)" stroke="url(#privacyBriefcaseEdge)" strokeWidth="3" />
      <path d="M15 45 Q 50 60 85 45" fill="none" stroke="url(#privacyBriefcaseEdge)" strokeWidth="3" />
      <rect x="42" y="42" width="16" height="12" rx="3" fill="url(#privacyBriefcaseBase)" stroke="#FFFFFF" strokeWidth="2" />
    </svg>
  );
}

const privacyItems = [
  {
    text: "We don't train on your data.",
    icon: <ShieldIcon className="h-12 w-12 shrink-0" />,
  },
  {
    text: 'Processed & Stored Locally',
    icon: <CpuIcon className="h-12 w-12 shrink-0" />,
  },
  {
    text: 'GDPR compliant by design.',
    icon: <GdprIcon className="h-12 w-12 shrink-0" />,
  },
  {
    text: 'Zero server logging',
    icon: <ServerOffIcon className="h-12 w-12 shrink-0" />,
  },
  {
    text: 'End to end private',
    icon: <LockIcon className="h-12 w-12 shrink-0" />,
  },
  {
    text: 'Encrypted at rest',
    icon: <ShieldLockIcon className="h-12 w-12 shrink-0" />,
  },
  {
    text: 'No third-party sharing',
    icon: <ShareOffIcon className="h-12 w-12 shrink-0" />,
  },
  {
    text: 'Enterprise grade',
    icon: <BriefcaseIcon className="h-12 w-12 shrink-0" />,
  },
];

export default function PrivacySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      data-privacy-layout="editorial"
      data-privacy-icon-count="8"
      className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full border-t border-white/10 py-20 font-sans text-white md:py-28`}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="grid gap-10 pb-14 lg:grid-cols-12 lg:pb-20">
          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              Privacy &amp; security / 01
            </p>
            <h2
              className="no-word-split mt-5 max-w-lg text-3xl font-light leading-[1.12] tracking-[-0.03em] md:text-[44px]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
            >
              Data sovereignty is non-negotiable.
            </h2>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:self-end">
            <p className="max-w-2xl text-xl font-light leading-[1.55] tracking-[-0.015em] text-white/82 md:text-2xl">
              Your operational intelligence should remain under your control—at every layer of the system.
            </p>
            <p className="mt-7 max-w-xl text-[15px] font-light leading-7 text-white/55">
              Zero model training. Zero third-party logging. Your operational data remains entirely within your control.
            </p>
          </div>
        </div>

        <div className="grid border-l border-t border-white/10 md:grid-cols-2 xl:grid-cols-4">
          {privacyItems.map((item, index) => (
            <div
              key={item.text}
              className="group flex min-h-[210px] flex-col justify-between border-b border-r border-white/10 p-7 transition-colors hover:bg-white/[0.018] md:min-h-[230px] md:p-8"
            >
              <div className="flex items-start justify-between gap-6">
                <span className="text-white/80">{item.icon}</span>
                <span className="font-mono text-[9px] text-white/28">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="max-w-[220px] text-base font-light leading-7 text-white/78 md:text-lg">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
