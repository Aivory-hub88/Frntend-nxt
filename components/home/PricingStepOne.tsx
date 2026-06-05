'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

/* ─── Arrow Icon (reused) ─── */
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

/* ─── Pricing Card Data ─── */
interface PricingCard {
  title: string;
  subtitle?: string;
  price: string;
  frequency: string;
  description: string;
  features: string[];
  cta: string;
  savings?: string;
}

const cards: PricingCard[] = [
  {
    title: 'AI Readiness\nDeep Diagnostic',
    price: '$29',
    frequency: 'One time',
    description: 'Know exactly where your business stands on AI before you build anything.',
    features: [
      'AI readiness score ·',
      'Business objective mapping ·',
      'Gap & constraint analysis ·',
      'AI opportunity identification ·',
      'Data & process readiness',
    ],
    cta: 'Start Deep Diagnostic',
  },
  {
    title: 'AI System\nBlueprint + Roadmap',
    price: '$85',
    frequency: 'One time',
    description: 'Your full AI architecture and execution plan, built around your business, not a template.',
    features: [
      '• Full AI system blueprint',
      '• Workflow architecture',
      '• Agent structure design',
      '• Deployment-ready plan',
      '• Phased implementation roadmap',
      '• KPI targets per phase',
    ],
    cta: 'Generate Blueprint',
  },
  {
    title: 'Full Stack Bundle',
    subtitle: 'Deep Diagnostic + Blueprint + Roadmap',
    price: '$99',
    frequency: 'One time',
    description: 'Everything in one. Know, plan, execute in order.',
    features: ['• Deep Diagnostic', '• Blueprint', '• Roadmap'],
    cta: 'View Deployment Plans',
    savings: 'Save $48 compare to buying separately',
  },
];

export default function PricingStepOne() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full bg-[#dfe4e5] text-[#494949] py-24 font-sans`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-20 text-center md:text-left">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2.5">
              <span className="text-[22px] md:text-[26px] font-extrabold text-[#494949]">Step 1</span>
              <StepIcon />
            </div>
            <div className="w-full h-[3px] bg-[#0ae8af] mt-2 rounded-full" />
          </div>
          <h2 className="text-5xl md:text-6xl font-normal tracking-tight mb-6">Start With Clarity.</h2>
          <p className="text-xl text-[#494949] font-light leading-relaxed">
            Know what to build, why it matters, and how to make it work.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16 mb-20 items-stretch">
          {cards.map((card) => (
            <div key={card.title} className="flex flex-col">
              {/* Title area */}
              <div className="min-h-[104px] pb-6">
                <h3 className="max-w-[410px] text-[24px] md:text-[28px] lg:text-[30px] font-normal leading-[1.02] text-[#494949] whitespace-pre-line">
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p className="mt-3 text-[14px] md:text-[15px] font-bold leading-tight text-[#8a8f8e]">
                    {card.subtitle}
                  </p>
                )}
              </div>

              {/* Price row */}
              <div className="flex items-center justify-between gap-3 border-t border-[#b0b5b4] border-b border-b-[#b0b5b4] py-8 sm:gap-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[42px] sm:text-[48px] md:text-[52px] font-extrabold leading-none">{card.price}</span>
                  <span className="pt-2 text-[15px] sm:text-[16px] md:text-[18px] font-bold leading-none text-[#8a8f8e]">{card.frequency}</span>
                </div>
                <ArrowUpRight className="h-10 w-10 shrink-0 text-[#0ae8af] md:h-12 md:w-12" />
              </div>

              {/* Description */}
              <p className="mt-8 max-w-[420px] text-[16px] md:text-[17px] font-medium leading-[1.35] text-[#494949]">
                {card.description}
              </p>

              {/* Features */}
              <ul className="mt-14 space-y-2 text-[15px] md:text-[16px] font-medium leading-[1.4] text-[#494949]">
                {card.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              {/* Savings badge */}
              {card.savings && (
                <div className="mt-auto pb-12 text-[16px] md:text-[17px] font-bold leading-tight text-[#4d925f]">
                  {card.savings}
                </div>
              )}

              {/* CTA */}
              <button
                type="button"
                className="group mt-auto pt-16 inline-flex items-center gap-2 self-start text-[16px] font-bold leading-none text-[#494949] transition-colors hover:text-[#303030] sm:text-[18px]"
              >
                <ArrowDownRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                <span className="pb-[6px] border-b-[12px] border-[#000000]">{card.cta}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
