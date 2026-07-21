'use client';

import { FadeUp } from './FadeUp';

export default function BastionContact() {
  return (
    <section className="bg-transparent text-white py-32 border-t border-[#1F1F1F] relative z-10">
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
            <form className="flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-widest text-[#808080] uppercase">First Name: <span className="text-red-500">*</span></label>
                <input type="text" className="bg-transparent border-b border-[#333333] focus:border-white outline-none py-2 text-white transition-colors" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-widest text-[#808080] uppercase">Last Name: <span className="text-red-500">*</span></label>
                <input type="text" className="bg-transparent border-b border-[#333333] focus:border-white outline-none py-2 text-white transition-colors" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-widest text-[#808080] uppercase">Job Title: <span className="text-red-500">*</span></label>
                <input type="text" className="bg-transparent border-b border-[#333333] focus:border-white outline-none py-2 text-white transition-colors" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-widest text-[#808080] uppercase">Company/Institution Name: <span className="text-red-500">*</span></label>
                <input type="text" className="bg-transparent border-b border-[#333333] focus:border-white outline-none py-2 text-white transition-colors" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-widest text-[#808080] uppercase">Business Email: <span className="text-red-500">*</span></label>
                <input type="email" className="bg-transparent border-b border-[#333333] focus:border-white outline-none py-2 text-white transition-colors" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-widest text-[#808080] uppercase">Phone Number:</label>
                <input type="tel" className="bg-transparent border-b border-[#333333] focus:border-white outline-none py-2 text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-widest text-[#808080] uppercase">Country: <span className="text-red-500">*</span></label>
                <select className="bg-transparent border-b border-[#333333] focus:border-white outline-none py-2 text-[#808080] appearance-none transition-colors" required defaultValue="">
                  <option value="" disabled>Select...</option>
                  <option value="ID" className="text-black">Indonesia</option>
                  <option value="SG" className="text-black">Singapore</option>
                  <option value="US" className="text-black">United States</option>
                  <option value="UK" className="text-black">United Kingdom</option>
                  <option value="OTHER" className="text-black">Other</option>
                </select>
              </div>
              
              <div className="pt-8">
                <button type="submit" className="w-full sm:w-auto bg-white text-black px-10 py-4 font-medium hover:bg-gray-200 transition-colors">
                  Submit
                </button>
              </div>
            </form>
          </div>
          
        </FadeUp>
      </div>
    </section>
  );
}
