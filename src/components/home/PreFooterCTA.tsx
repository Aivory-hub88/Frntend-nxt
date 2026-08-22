'use client';

import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { TechnicalFrameButton } from '@/components/ui/TechnicalFrameButton';
import { PlanConfirmModal } from '@/components/payment/PlanConfirmModal';
import { PRODUCT_IDS } from '@/lib/pricing';
import { FAQ_ENTITIES } from '@/lib/seo';

export default function PreFooterCTA() {
  const { ref, isVisible } = useScrollAnimation();
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

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
            <h2
              className="no-word-split mt-5 max-w-lg text-3xl font-light leading-[1.12] tracking-[-0.03em] md:text-[44px]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
            >
              Start your transformation.
            </h2>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:self-end">
            <div className="max-w-2xl text-[15px] font-light leading-7 text-white/62 md:text-base">
              <p>
                Every transformation begins with understanding how your organisation operates. Tell
                us about your business, your operational challenges, and where you want to go
                &mdash; we&apos;ll help identify where AI can create measurable business value.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <TechnicalFrameButton
                type="button"
                size="compact"
                onClick={() => setActiveProductId(PRODUCT_IDS.DEEP_DIAGNOSTIC)}
              >
                Begin Assessment
              </TechnicalFrameButton>
              <TechnicalFrameButton
                type="button"
                size="compact"
                className="bg-transparent text-white/70 hover:text-white"
                onClick={() => setActiveProductId(PRODUCT_IDS.FULL_STACK)}
              >
                Complete Package
              </TechnicalFrameButton>
              <TechnicalFrameButton
                href="https://book.aivory.uk/book/aivory-call"
                target="_blank"
                rel="noopener noreferrer"
                size="compact"
                className="bg-transparent text-white/70 hover:text-white"
              >
                Book a Call
              </TechnicalFrameButton>
            </div>
          </div>
        </div>

        <div className="grid gap-12 border-b border-t border-white/10 py-16 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              Questions / 02
            </p>
            <h3 className="mt-5 max-w-sm text-3xl font-light leading-[1.15] tracking-[-0.025em] md:text-[40px]">
              Clear answers about Aivory.
            </h3>
          </div>

          <div className="border-b border-white/10 lg:col-span-7 lg:col-start-6">
            {FAQ_ENTITIES.map((entry, index) => (
              <details key={entry.question} className="group border-t border-white/10" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-start gap-5 py-6 marker:content-none md:py-7">
                  <span className="pt-1 font-mono text-[9px] text-white/28">{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex-1 text-base font-light leading-7 text-white/85 md:text-lg">{entry.question}</span>
                  <span className="text-xl font-light text-white/35 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-3xl pb-7 pl-9 text-sm font-light leading-7 text-white/52 md:pb-9">{entry.answer}</p>
              </details>
            ))}

            <p className="pt-8 text-sm font-light text-white/55 md:text-base">
              Prefer speaking with our team?{' '}
              <a
                href="https://book.aivory.uk/book/aivory-call"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-white/35 pb-1 text-white/78 transition-colors hover:border-white hover:text-white"
              >
                Schedule a Discovery Call.
              </a>
            </p>
          </div>
        </div>
      </div>

      {activeProductId && (
        <PlanConfirmModal
          productId={activeProductId}
          onClose={() => setActiveProductId(null)}
        />
      )}
    </section>
  );
}
