import type { Metadata } from 'next';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/Footer';
import PricingStepOne from '@/components/home/PricingStepOne';
import PricingStepTwo from '@/components/home/PricingStepTwo';

export const metadata: Metadata = {
  title: 'Pricing — Aivory',
  description: 'Simple, transparent pricing. Buy once, own the output.',
};

export default function PricingPage() {
  return (
    <main className="relative bg-[#050505] min-h-screen pt-24 text-white font-manrope">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16 mt-12">
          <h1 className="text-[36px] md:text-[56px] font-light mb-4 tracking-tight text-white/90" style={{ fontFamily: "'Manrope', sans-serif" }}>Start Where It Makes Sense.</h1>
          <p className="text-[#c4c9b8] text-lg max-w-2xl mx-auto font-light">
            From first assessment to full deployment, pick the stage that fits
          </p>
        </div>
      </div>

      <div style={{ zoom: 0.85 }}>
        <PricingStepOne />
        <PricingStepTwo />
      </div>

      <Footer />
    </main>
  );
}
