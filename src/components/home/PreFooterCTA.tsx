'use client';

import { useState, useRef, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { SpotlightButton } from '@/components/ui/SpotlightButton';

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/sales@aivory.uk';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

/* ─── Glass Icons ─── */
function ShieldIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glassBase1" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="45.1%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="glassEdge1" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d="M50 10 C50 10 15 20 15 20 C15 55 15 75 50 95 C85 75 85 55 85 20 C85 20 50 10 50 10 Z"
        fill="url(#glassBase1)"
        stroke="url(#glassEdge1)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M35 50 L45 62 L65 38" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CpuIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glassBase2" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="45.1%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="glassEdge2" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="60" height="60" rx="12" fill="url(#glassBase2)" stroke="url(#glassEdge2)" strokeWidth="3" />
      <rect x="35" y="35" width="30" height="30" rx="6" fill="url(#glassBase2)" stroke="url(#glassEdge2)" strokeWidth="2" />
    </svg>
  );
}

function LayersIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glassBase3" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="45.1%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="glassEdge3" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M50 20 L85 38 L50 56 L15 38 Z" fill="url(#glassBase3)" stroke="url(#glassEdge3)" strokeWidth="3" />
      <path d="M15 52 L50 70 L85 52" stroke="url(#glassEdge3)" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 66 L50 84 L85 66" stroke="url(#glassEdge3)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glassBase4" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="45.1%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="glassEdge4" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M38 30 V18 C38 12 62 12 62 18 V30" stroke="url(#glassBase4)" strokeWidth="8" strokeLinecap="round" />
      <rect x="15" y="30" width="70" height="55" rx="8" fill="url(#glassBase4)" stroke="url(#glassEdge4)" strokeWidth="3" />
    </svg>
  );
}

const services = [
  {
    title: 'Operational Assessment',
    description:
      'Understand how your organisation operates today, identify operational bottlenecks, and uncover the highest-value transformation opportunities.',
    icon: <ShieldIcon className="w-6 h-6 shrink-0" />,
  },
  {
    title: 'Transformation Design',
    description:
      'Design future operating models, intelligent workflows, governance frameworks, and AI deployment strategies tailored to your organisation.',
    icon: <CpuIcon className="w-6 h-6 shrink-0" />,
  },
  {
    title: 'Enterprise Implementation',
    description:
      'Deploy governed AI systems, operational workflows, and enterprise integrations with measurable business outcomes.',
    icon: <LayersIcon className="w-6 h-6 shrink-0" />,
  },
  {
    title: 'Executive Enablement',
    description:
      'Prepare leadership and operational teams with the knowledge, governance, and frameworks required to manage long-term transformation.',
    icon: <BriefcaseIcon className="w-6 h-6 shrink-0" />,
  },
];

const ServiceCard = ({ service }: { service: (typeof services)[0] }) => {
  return (
    <SpotlightButton
      icon={false}
      roundedClass="rounded-[10px]"
      className="!items-start h-full w-full normal-case p-8 text-left group"
      style={{
        textTransform: 'none',
        backgroundColor: 'rgba(20, 20, 26, 0.3)',
        borderWidth: '0.5px',
        borderStyle: 'solid',
        borderColor: 'rgba(255, 255, 255, 0.035)',
        boxShadow: 'none',
      }}
    >
      <div className="flex flex-col gap-4 relative z-10 w-full text-left">
        <div className="flex items-center gap-3">
          {service.icon}
          <h3 className="text-xl font-normal text-white group-hover:text-white transition-colors">
            {service.title}
          </h3>
        </div>
        <p className="text-[#dadada] font-light leading-relaxed text-base">
          {service.description}
        </p>
      </div>
    </SpotlightButton>
  );
};

export default function PreFooterCTA() {
  const { ref, isVisible } = useScrollAnimation();
  const [status, setStatus] = useState<SubmitState>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });

      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
      e.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="prefooter-cta" ref={ref} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full text-white pt-12 pb-24 font-sans`}>
      <div style={{ zoom: 0.78 }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <SpotlightButton
            className="mb-6 pointer-events-auto hover:-translate-y-0 w-fit"
            style={{
              borderWidth: '0.5px',
              borderStyle: 'solid',
              borderColor: 'rgba(255,255,255,0.1)',
              width: 'fit-content',
              cursor: 'default',
            }}
            icon={false}
            roundedClass="rounded-[10px]"
          >
            STRATEGIC ENGAGEMENT
          </SpotlightButton>
          <h2 className="no-word-split text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.2] mb-6" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}>
            Start your transformation.
          </h2>
          <div className="text-[#dadada] text-lg md:text-xl font-light mb-14 max-w-4xl space-y-3">
            <p>Every transformation begins with understanding how your organisation operates.</p>
            <p>Tell us about your business, your operational challenges, and where you want to go.</p>
            <p>We'll help identify where AI can create measurable business value.</p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>

          {/* Enterprise Contact Form */}
          <div className="mt-16 pt-16 border-t border-white/10">
            <h3 className="text-2xl md:text-3xl font-light text-white mb-8">
              Strategic Transformation Intake
            </h3>

            {status === 'success' ? (
              <div className="p-8 rounded-xl border border-white/15 bg-white/5 text-lg text-white/90">
                Thank you for reaching out — our strategic transformation team will be in touch shortly.
              </div>
            ) : (
              <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <input type="hidden" name="_subject" value="New Enterprise Transformation Inquiry" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_cc" value="irfan.reichmann@aivory.uk,samuel@aivory.id" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  {/* First Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-widest text-white/70 uppercase font-mono">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      className="bg-transparent border-b border-white/30 focus:border-white outline-none py-2.5 text-white transition-colors"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-widest text-white/70 uppercase font-mono">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      className="bg-transparent border-b border-white/30 focus:border-white outline-none py-2.5 text-white transition-colors"
                      required
                    />
                  </div>

                  {/* Job Title */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-widest text-white/70 uppercase font-mono">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="job_title"
                      className="bg-transparent border-b border-white/30 focus:border-white outline-none py-2.5 text-white transition-colors"
                      required
                    />
                  </div>

                  {/* Company / Organisation */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-widest text-white/70 uppercase font-mono">
                      Company / Organisation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      className="bg-transparent border-b border-white/30 focus:border-white outline-none py-2.5 text-white transition-colors"
                      required
                    />
                  </div>

                  {/* Business Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-widest text-white/70 uppercase font-mono">
                      Business Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="business_email"
                      className="bg-transparent border-b border-white/30 focus:border-white outline-none py-2.5 text-white transition-colors"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-widest text-white/70 uppercase font-mono">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      className="bg-transparent border-b border-white/30 focus:border-white outline-none py-2.5 text-white transition-colors"
                    />
                  </div>

                  {/* Country */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-widest text-white/70 uppercase font-mono">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      className="bg-transparent border-b border-white/30 focus:border-white outline-none py-2.5 text-white appearance-none transition-colors"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled className="text-black">
                        Select...
                      </option>
                      <option value="ID" className="text-black">
                        Indonesia
                      </option>
                      <option value="SG" className="text-black">
                        Singapore
                      </option>
                      <option value="US" className="text-black">
                        United States
                      </option>
                      <option value="UK" className="text-black">
                        United Kingdom
                      </option>
                      <option value="OTHER" className="text-black">
                        Other
                      </option>
                    </select>
                  </div>

                  {/* Company Size */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-widest text-white/70 uppercase font-mono">
                      Company Size <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="company_size"
                      className="bg-transparent border-b border-white/30 focus:border-white outline-none py-2.5 text-white appearance-none transition-colors"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled className="text-black">
                        Select...
                      </option>
                      <option value="1-10" className="text-black">
                        1–10
                      </option>
                      <option value="11-50" className="text-black">
                        11–50
                      </option>
                      <option value="51-250" className="text-black">
                        51–250
                      </option>
                      <option value="251-1000" className="text-black">
                        251–1000
                      </option>
                      <option value="1000+" className="text-black">
                        1000+
                      </option>
                    </select>
                  </div>

                  {/* Industry */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-widest text-white/70 uppercase font-mono">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="industry"
                      className="bg-transparent border-b border-white/30 focus:border-white outline-none py-2.5 text-white appearance-none transition-colors"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled className="text-black">
                        Select...
                      </option>
                      <option value="Government" className="text-black">
                        Government
                      </option>
                      <option value="Financial Services" className="text-black">
                        Financial Services
                      </option>
                      <option value="Healthcare" className="text-black">
                        Healthcare
                      </option>
                      <option value="Manufacturing" className="text-black">
                        Manufacturing
                      </option>
                      <option value="Retail" className="text-black">
                        Retail
                      </option>
                      <option value="Logistics" className="text-black">
                        Logistics
                      </option>
                      <option value="Technology" className="text-black">
                        Technology
                      </option>
                      <option value="Education" className="text-black">
                        Education
                      </option>
                      <option value="Other" className="text-black">
                        Other
                      </option>
                    </select>
                  </div>

                  {/* Primary Objective */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-widest text-white/70 uppercase font-mono">
                      Primary Objective <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="primary_objective"
                      className="bg-transparent border-b border-white/30 focus:border-white outline-none py-2.5 text-white appearance-none transition-colors"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled className="text-black">
                        Select...
                      </option>
                      <option value="Improve Business Operations" className="text-black">
                        Improve Business Operations
                      </option>
                      <option value="Process Automation" className="text-black">
                        Process Automation
                      </option>
                      <option value="AI Strategy" className="text-black">
                        AI Strategy
                      </option>
                      <option value="Enterprise Transformation" className="text-black">
                        Enterprise Transformation
                      </option>
                      <option value="Customer Experience" className="text-black">
                        Customer Experience
                      </option>
                      <option value="Operational Efficiency" className="text-black">
                        Operational Efficiency
                      </option>
                      <option value="Other" className="text-black">
                        Other
                      </option>
                    </select>
                  </div>

                  {/* Current AI Adoption */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[11px] tracking-widest text-white/70 uppercase font-mono">
                      Current AI Adoption <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="current_ai_adoption"
                      className="bg-transparent border-b border-white/30 focus:border-white outline-none py-2.5 text-white appearance-none transition-colors"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled className="text-black">
                        Select...
                      </option>
                      <option value="Exploring AI" className="text-black">
                        Exploring AI
                      </option>
                      <option value="Early Adoption" className="text-black">
                        Early Adoption
                      </option>
                      <option value="Scaling AI" className="text-black">
                        Scaling AI
                      </option>
                      <option value="Mature AI Operations" className="text-black">
                        Mature AI Operations
                      </option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[11px] tracking-widest text-white/70 uppercase font-mono">
                      Message <span className="text-white/40">(Optional)</span>
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="Tell us about your organisation, your operational challenges, or what you're looking to achieve."
                      className="bg-transparent border-b border-white/30 focus:border-white outline-none py-2.5 text-white placeholder:text-white/30 transition-colors"
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-400">Something went wrong — please try again.</p>
                )}

                {/* Primary Button & Secondary CTA */}
                <div className="pt-6 flex flex-col items-start gap-4">
                  <SpotlightButton
                    type="submit"
                    disabled={status === 'submitting'}
                    roundedClass="rounded-[10px]"
                    className="text-xs md:text-sm px-8 py-4"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Start Conversation'}
                  </SpotlightButton>

                  <p className="text-sm md:text-base text-[#dadada] font-light mt-2">
                    Prefer speaking with our team?{' '}
                    <a href="/contact" className="underline hover:text-white transition-colors font-medium">
                      Schedule a Discovery Call.
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
