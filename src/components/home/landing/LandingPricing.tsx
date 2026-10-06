'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/context/LanguageContext';
import PricingStepOne from '@/components/home/PricingStepOne';
import PricingStepTwo from '@/components/home/PricingStepTwo';
import PaymentMethods from '@/components/home/PaymentMethods';
import s from './landing.module.css';

// Same plans, currency logic and checkout (PlanConfirmModal) as /pricing; the
// step components render in their 'landing' variant inside a light band.
export default function LandingPricing() {
  const { language } = useLanguage();
  const [currency, setCurrency] = useState<'IDR' | 'USD' | null>(null);

  useEffect(() => {
    setCurrency(language === 'id' ? 'IDR' : 'USD');
  }, [language]);

  const activeCurrency = currency || 'USD';

  return (
    <section id="pricing-section" className={`${s.band} ${s.light}`}>
      <div className={s.wrap}>
        <div className={s.head}>
          <span className={s.eyebrow}>Pricing</span>
          <h2 className={s.h2}>
            Priced for progress.
            <br />
            <span className={s.dim}>Assess first, then choose how you operate.</span>
          </h2>
          <p className={s.lede}>
            Every transformation begins with understanding how your organisation operates. Assess first, build your
            transformation strategy, then deploy AI with confidence.
          </p>
          {/* Same translucent, rounded, sticky toggle as /pricing. */}
          <div className="sticky top-24 z-50 flex justify-center">
            <div className="bg-white/60 p-1.5 rounded-full inline-flex border border-[#494949]/10 shadow-sm backdrop-blur-md" role="group" aria-label="Currency">
              {(['IDR', 'USD'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={activeCurrency === c}
                  onClick={() => setCurrency(c)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeCurrency === c ? 'bg-[#c4c9b8] text-[#1a1a1a] shadow-sm' : 'text-[#494949]/60 hover:text-[#494949]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <PaymentMethods />
        </div>
      </div>
      <PricingStepOne currency={activeCurrency} variant="landing" />
      <PricingStepTwo currency={activeCurrency} variant="landing" />
    </section>
  );
}
