'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

import { useLanguage } from '@/components/context/LanguageContext';

/* ─── Icons ─── */
function ArrowUpRight({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function ArrowDownRight({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 7v10H7" />
      <path d="M7 7l10 10" />
    </svg>
  );
}

function StepIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#494949" aria-hidden="true">
      <rect x="4" y="4" width="4" height="4" rx="1.3" />
      <rect x="16" y="4" width="4" height="4" rx="1.3" />
      <rect x="10" y="10" width="4" height="4" rx="1.3" />
      <rect x="4" y="16" width="4" height="4" rx="1.3" />
      <rect x="16" y="16" width="4" height="4" rx="1.3" />
    </svg>
  );
}

/* ─── Plan Data ─── */
interface Plan {
  name: string;
  description: string;
  price: number;
  frequency: string;
  features: string[];
  cta: string;
}

const plans: Plan[] = [
  {
    name: 'Foundation',
    description: 'For individuals and solo professionals starting their AI journey.',
    price: 20,
    frequency: '(month)',
    features: [
      '50 IC/month',
      'Aivory™ Agentic on-demand consultation',
      '3 active workflows',
      '5 JSON exports/month',
      'Deploy to n8n (optional)',
      '1 active agent',
      'Telegram or Slack',
    ],
    cta: 'Start With Foundation',
  },
  {
    name: 'Pro',
    description: 'For SMEs and founders running AI operations daily.',
    price: 44,
    frequency: '(month)',
    features: [
      '300 IC/month',
      'Aivory™ Agentic response',
      '10 active workflows',
      'Unlimited JSON exports',
      'Conditional logic & branching',
      '3 active agents',
      'Telegram & Slack',
      'Multi-step agent flows',
    ],
    cta: 'Start With Pro',
  },
  {
    name: 'Enterprise',
    description: 'For SMEs and founders running AI operations daily.',
    price: 499,
    frequency: '(month)',
    features: [
      '2,000 IC/month',
      'Dedicated account manager',
      'Unlimited workflows',
      'Unlimited exports',
      'Advanced orchestration',
      'Unlimited agents',
      'Custom integrations',
      'SLA guarantee',
      'Multi-team workspace',
    ],
    cta: 'Contact Sales',
  },
];

export default function PricingStepTwo() {
  const { ref, isVisible } = useScrollAnimation();
  const { formatPrice, language } = useLanguage();

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section ref={ref} onMouseMove={handleMouseMove} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} spotlight-section w-full bg-[#dfe4e5] text-[#494949] py-24 font-sans`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="mb-20 text-center md:text-left">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2.5">
              <span className="text-[22px] md:text-[26px] font-extrabold text-[#494949]">Step 2</span>
              <StepIcon />
            </div>
            <div className="w-full h-[3px] bg-[#c4c9b8] mt-2 rounded-full" />
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-tight mb-6">Ready to Deploy? Pick Your Plan</h2>
          <p className="text-xl text-[#494949] font-light leading-relaxed">
            Everything you need to deploy, manage, build workflow from natural language, launch agents and scale AI operations from one platform.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 mb-20 items-stretch gap-y-12 md:gap-y-0">
          {plans.map((plan, idx) => (
            <div 
              key={plan.name} 
              className={`flex flex-col ${
                idx === 0 ? 'md:pr-10 pb-12 border-b border-[#b0b5b4] md:border-b-0 md:pb-0' : idx === 1 ? 'md:px-10 md:border-x border-[#b0b5b4] pb-12 border-b md:border-b-0 md:pb-0' : 'md:pl-10'
              }`}
            >
              {/* Title */}
              <div className="flex-grow flex flex-col">
                <div className="min-h-[96px] pb-6">
                  <h3 className="max-w-[380px] text-[22px] md:text-[24px] lg:text-[26px] font-normal leading-[1.05] text-[#494949]">
                    {plan.name}
                  </h3>
                  <p className="mt-3 max-w-[340px] text-[14px] md:text-[15px] font-medium leading-[1.25] text-[#494949]">
                    {plan.description}
                  </p>
                </div>

              {/* Price */}
              <div className="flex items-center justify-start gap-3 py-6 mt-2">
                <span className={`${language === 'id' ? 'text-[28px] sm:text-[32px] md:text-[38px]' : 'text-[42px] sm:text-[48px] md:text-[52px]'} font-extrabold leading-none whitespace-nowrap text-[#1a1a1a]`}>
                  {formatPrice(plan.price)}
                </span>
                <div className="flex flex-col pt-1">
                  <span className="text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-none text-[#494949] mb-[6px]">
                    {language === 'id' ? plan.frequency.replace('(month)', '(bulan)') : plan.frequency}
                  </span>
                  <div className="w-full h-[5px] bg-[#c4c9b8]" />
                </div>
              </div>

              {/* Features */}
              <ul className="mt-14 space-y-2 text-[15px] md:text-[16px] font-medium leading-[1.35] text-[#494949]">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              </div>

              {/* CTA */}
              <div className="pt-10 mt-auto">
                <button
                  type="button"
                  className="w-full bg-[#c4c9b8] text-[#494949] py-[14px] px-4 text-[15px] md:text-[16px] font-medium text-center transition-colors hover:bg-[#b0b5a4]"
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* IC Explanation */}
        <div className="mx-auto mt-24 max-w-5xl border-t-2 border-[#6f7473] pt-8">
          <p className="text-[16px] md:text-[17px] font-bold leading-[1.65] text-[#494949]">
            Intelligence Credits (IC) fuel Aivory™ reasoning — every consultation, workflow generation, and agent
            configuration runs on IC. Think of it as the fuel tank for your AI system. Need more? Top up anytime.
          </p>
        </div>

        {/* Bottom note */}
        <div className="mt-16 text-center">
          <p className="text-[15px] md:text-[17px] font-medium leading-tight text-[#494949]">
            No hidden fees. No locked contracts. Cancel anytime. Your AI system, your pace.
          </p>
        </div>
      </div>
    </section>
  );
}
