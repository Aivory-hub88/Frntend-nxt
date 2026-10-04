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
            <span className={s.dim}>Assess first, then license the platform.</span>
          </h2>
          <p className={s.lede}>
            Every transformation begins with understanding how your organisation operates. Assess first, build your
            transformation strategy, then deploy AI with confidence.
          </p>
          <div className={s.tabs} role="group" aria-label="Currency">
            {(['IDR', 'USD'] as const).map((c) => (
              <button
                key={c}
                type="button"
                className={s.tab}
                aria-pressed={activeCurrency === c}
                onClick={() => setCurrency(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <PaymentMethods />
        </div>
      </div>
      <PricingStepOne currency={activeCurrency} variant="landing" />
      <PricingStepTwo currency={activeCurrency} variant="landing" />
    </section>
  );
}
