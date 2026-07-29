'use client';

import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/sales@aivory.uk';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

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
    icon: <ShieldIcon className="h-6 w-6 shrink-0" />,
  },
  {
    title: 'Transformation Design',
    description:
      'Design future operating models, intelligent workflows, governance frameworks, and AI deployment strategies tailored to your organisation.',
    icon: <CpuIcon className="h-6 w-6 shrink-0" />,
  },
  {
    title: 'Enterprise Implementation',
    description:
      'Deploy governed AI systems, operational workflows, and enterprise integrations with measurable business outcomes.',
    icon: <LayersIcon className="h-6 w-6 shrink-0" />,
  },
  {
    title: 'Executive Enablement',
    description:
      'Prepare leadership and operational teams with the knowledge, governance, and frameworks required to manage long-term transformation.',
    icon: <BriefcaseIcon className="h-6 w-6 shrink-0" />,
  },
];

const fieldClassName =
  'border-b border-white/25 bg-transparent py-3 text-white outline-none transition-colors focus:border-white';
const labelClassName = 'font-mono text-[10px] uppercase tracking-[0.18em] text-white/55';

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
    <section
      id="prefooter-cta"
      ref={ref}
      data-prefooter-layout="editorial"
      className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} relative isolate w-full overflow-hidden border-t border-white/10 py-20 font-sans text-white md:py-28`}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="grid gap-10 pb-14 lg:grid-cols-12 lg:pb-20">
          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              Strategic engagement / 01
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2
              className="no-word-split text-3xl font-light leading-[1.12] tracking-[-0.03em] md:text-[44px]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
            >
              Start your transformation.
            </h2>
            <div className="mt-7 max-w-2xl space-y-3 text-[15px] font-light leading-7 text-white/62 md:text-base">
              <p>Every transformation begins with understanding how your organisation operates.</p>
              <p>Tell us about your business, your operational challenges, and where you want to go.</p>
              <p>We&apos;ll help identify where AI can create measurable business value.</p>
            </div>
          </div>
        </div>

        <ol
          className="border-b border-white/10"
          data-service-layout="numbered-rows"
          data-service-icon-count="4"
        >
          {services.map((service, index) => (
            <li
              key={service.title}
              className="group grid gap-5 border-t border-white/10 py-8 transition-colors hover:bg-white/[0.018] md:py-10 lg:grid-cols-12 lg:items-start"
            >
              <span className="font-mono text-[10px] text-white/35 lg:col-span-1">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="text-white/80 lg:col-span-1">{service.icon}</div>
              <h3 className="text-xl font-light tracking-[-0.015em] text-white/92 md:text-2xl lg:col-span-3">
                {service.title}
              </h3>
              <p className="max-w-2xl text-sm font-light leading-7 text-white/55 lg:col-span-6 lg:col-start-7">
                {service.description}
              </p>
            </li>
          ))}
        </ol>

        <div className="grid gap-12 border-b border-white/10 py-16 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              Transformation intake / 02
            </p>
            <h3 className="mt-5 max-w-sm text-3xl font-light leading-[1.15] tracking-[-0.025em] md:text-[40px]">
              Tell us where the operation needs to move.
            </h3>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {status === 'success' ? (
              <div className="border-y border-white/15 py-8 text-lg font-light leading-8 text-white/88">
                Thank you for reaching out — our strategic transformation team will be in touch shortly.
              </div>
            ) : (
              <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <input type="hidden" name="_subject" value="New Enterprise Transformation Inquiry" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_cc" value="irfan.reichmann@aivory.uk,samuel@aivory.id" />

                <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className={labelClassName}>
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="first_name" className={fieldClassName} required />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClassName}>
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="last_name" className={fieldClassName} required />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClassName}>
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="job_title" className={fieldClassName} required />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClassName}>
                      Company / Organisation <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="company_name" className={fieldClassName} required />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClassName}>
                      Business Email <span className="text-red-500">*</span>
                    </label>
                    <input type="email" name="business_email" className={fieldClassName} required />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClassName}>Phone Number</label>
                    <input type="tel" name="phone_number" className={fieldClassName} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClassName}>
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select name="country" className={`${fieldClassName} appearance-none`} required defaultValue="">
                      <option value="" disabled className="text-black">Select...</option>
                      <option value="ID" className="text-black">Indonesia</option>
                      <option value="SG" className="text-black">Singapore</option>
                      <option value="US" className="text-black">United States</option>
                      <option value="UK" className="text-black">United Kingdom</option>
                      <option value="OTHER" className="text-black">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClassName}>
                      Company Size <span className="text-red-500">*</span>
                    </label>
                    <select name="company_size" className={`${fieldClassName} appearance-none`} required defaultValue="">
                      <option value="" disabled className="text-black">Select...</option>
                      <option value="1-10" className="text-black">1–10</option>
                      <option value="11-50" className="text-black">11–50</option>
                      <option value="51-250" className="text-black">51–250</option>
                      <option value="251-1000" className="text-black">251–1000</option>
                      <option value="1000+" className="text-black">1000+</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClassName}>
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <select name="industry" className={`${fieldClassName} appearance-none`} required defaultValue="">
                      <option value="" disabled className="text-black">Select...</option>
                      <option value="Government" className="text-black">Government</option>
                      <option value="Financial Services" className="text-black">Financial Services</option>
                      <option value="Healthcare" className="text-black">Healthcare</option>
                      <option value="Manufacturing" className="text-black">Manufacturing</option>
                      <option value="Retail" className="text-black">Retail</option>
                      <option value="Logistics" className="text-black">Logistics</option>
                      <option value="Technology" className="text-black">Technology</option>
                      <option value="Education" className="text-black">Education</option>
                      <option value="Other" className="text-black">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClassName}>
                      Primary Objective <span className="text-red-500">*</span>
                    </label>
                    <select name="primary_objective" className={`${fieldClassName} appearance-none`} required defaultValue="">
                      <option value="" disabled className="text-black">Select...</option>
                      <option value="Improve Business Operations" className="text-black">Improve Business Operations</option>
                      <option value="Process Automation" className="text-black">Process Automation</option>
                      <option value="AI Strategy" className="text-black">AI Strategy</option>
                      <option value="Enterprise Transformation" className="text-black">Enterprise Transformation</option>
                      <option value="Customer Experience" className="text-black">Customer Experience</option>
                      <option value="Operational Efficiency" className="text-black">Operational Efficiency</option>
                      <option value="Other" className="text-black">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className={labelClassName}>
                      Current AI Adoption <span className="text-red-500">*</span>
                    </label>
                    <select name="current_ai_adoption" className={`${fieldClassName} appearance-none`} required defaultValue="">
                      <option value="" disabled className="text-black">Select...</option>
                      <option value="Exploring AI" className="text-black">Exploring AI</option>
                      <option value="Early Adoption" className="text-black">Early Adoption</option>
                      <option value="Scaling AI" className="text-black">Scaling AI</option>
                      <option value="Mature AI Operations" className="text-black">Mature AI Operations</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className={labelClassName}>
                      Message <span className="text-white/35">(Optional)</span>
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="Tell us about your organisation, your operational challenges, or what you're looking to achieve."
                      className={`${fieldClassName} placeholder:text-white/30`}
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-400">Something went wrong — please try again.</p>
                )}

                <div className="flex flex-col items-start gap-5 pt-6">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex min-h-[46px] items-center bg-white px-7 text-[11px] font-medium uppercase tracking-[0.14em] text-black transition-colors hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Start Conversation'}
                  </button>

                  <p className="text-sm font-light text-white/55 md:text-base">
                    Prefer speaking with our team?{' '}
                    <a href="/contact" className="border-b border-white/35 pb-1 text-white/78 transition-colors hover:border-white hover:text-white">
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
