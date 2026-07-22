'use client';

import { useState } from 'react';
import { FadeUp } from './FadeUp';
import { SpotlightButton } from '@/components/ui/SpotlightButton';

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/sales@aivory.uk';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function BastionContact() {
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
    <section className="bg-transparent text-white py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeUp className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">

          {/* Left Column - Large Text */}
          <div className="flex flex-col justify-start">
            <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.05] tracking-tight text-[#FFFFFF]">
              Talk to our team.
            </h2>
          </div>

          {/* Right Column - Form */}
          <div className="w-full">
            {status === 'success' ? (
              <p className="text-lg text-white/90">
                Thanks for reaching out — our team will be in touch shortly.
              </p>
            ) : (
              <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
                <input type="hidden" name="_subject" value="New Bastion contact form submission" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_cc" value="irfan.reichmann@aivory.uk,samuel@aivory.id" />

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-widest text-white uppercase">First Name: <span className="text-red-500">*</span></label>
                  <input type="text" name="first_name" className="bg-transparent border-b border-white focus:border-white outline-none py-2 text-white transition-colors" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-widest text-white uppercase">Last Name: <span className="text-red-500">*</span></label>
                  <input type="text" name="last_name" className="bg-transparent border-b border-white focus:border-white outline-none py-2 text-white transition-colors" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-widest text-white uppercase">Job Title: <span className="text-red-500">*</span></label>
                  <input type="text" name="job_title" className="bg-transparent border-b border-white focus:border-white outline-none py-2 text-white transition-colors" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-widest text-white uppercase">Company/Institution Name: <span className="text-red-500">*</span></label>
                  <input type="text" name="company_name" className="bg-transparent border-b border-white focus:border-white outline-none py-2 text-white transition-colors" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-widest text-white uppercase">Business Email: <span className="text-red-500">*</span></label>
                  <input type="email" name="business_email" className="bg-transparent border-b border-white focus:border-white outline-none py-2 text-white transition-colors" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-widest text-white uppercase">Phone Number:</label>
                  <input type="tel" name="phone_number" className="bg-transparent border-b border-white focus:border-white outline-none py-2 text-white transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-widest text-white uppercase">Country: <span className="text-red-500">*</span></label>
                  <select name="country" className="bg-transparent border-b border-white focus:border-white outline-none py-2 text-white appearance-none transition-colors" required defaultValue="">
                    <option value="" disabled>Select...</option>
                    <option value="ID" className="text-black">Indonesia</option>
                    <option value="SG" className="text-black">Singapore</option>
                    <option value="US" className="text-black">United States</option>
                    <option value="UK" className="text-black">United Kingdom</option>
                    <option value="OTHER" className="text-black">Other</option>
                  </select>
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-400">Something went wrong — please try again.</p>
                )}

                <div className="pt-8">
                  <SpotlightButton
                    type="submit"
                    disabled={status === 'submitting'}
                    roundedClass="rounded-[10px]"
                    className="text-xs md:text-sm"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Submit'}
                  </SpotlightButton>
                </div>
              </form>
            )}
          </div>

        </FadeUp>
      </div>
    </section>
  );
}
