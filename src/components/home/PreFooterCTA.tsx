'use client';

import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { TechnicalFrameButton } from '@/components/ui/TechnicalFrameButton';
import { PlanConfirmModal } from '@/components/payment/PlanConfirmModal';
import { PRODUCT_IDS } from '@/lib/pricing';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const fieldClassName =
  'border-b border-white/25 bg-transparent py-3 text-white outline-none transition-colors focus:border-white';
const labelClassName = 'font-mono text-[10px] uppercase tracking-[0.18em] text-white/55';

export default function PreFooterCTA() {
  const { ref, isVisible } = useScrollAnimation();
  const [status, setStatus] = useState<SubmitState>('idle');
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const fields = Object.fromEntries(new FormData(e.currentTarget));
      const res = await fetch('/api/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: 'intake', ...fields }),
      });

      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error('Submission failed');
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
            <h2
              className="no-word-split mt-5 max-w-lg text-3xl font-light leading-[1.12] tracking-[-0.03em] md:text-[44px]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
            >
              Start your transformation.
            </h2>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:self-end">
            <div className="max-w-2xl space-y-3 text-[15px] font-light leading-7 text-white/62 md:text-base">
              <p>Every transformation begins with understanding how your organisation operates.</p>
              <p>Tell us about your business, your operational challenges, and where you want to go.</p>
              <p>We&apos;ll help identify where AI can create measurable business value.</p>
            </div>
            <div className="mt-8">
              <TechnicalFrameButton type="button" onClick={() => setShowAssessmentModal(true)}>
                Begin Assessment
              </TechnicalFrameButton>
            </div>
          </div>
        </div>

        <div className="grid gap-12 border-b border-t border-white/10 py-16 md:py-20 lg:grid-cols-12">
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
                  <TechnicalFrameButton
                    type="submit"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Sending...' : 'Start Conversation'}
                  </TechnicalFrameButton>

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

      {showAssessmentModal && (
        <PlanConfirmModal
          productId={PRODUCT_IDS.DEEP_DIAGNOSTIC}
          onClose={() => setShowAssessmentModal(false)}
        />
      )}
    </section>
  );
}
