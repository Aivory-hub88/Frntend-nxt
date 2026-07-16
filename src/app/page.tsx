import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import AIReadySection from '@/components/home/AIReadySection';
import FeatureCards from '@/components/home/FeatureCards';
import StatsSection from '@/components/home/StatsSection';
import PricingClientWrapper from '@/app/pricing/PricingClientWrapper';
import PrivacySection from '@/components/home/PrivacySection';
import PreFooterCTA from '@/components/home/PreFooterCTA';
import Footer from '@/components/Footer';
import ScrollRevealProvider from '@/components/home/ScrollRevealProvider';
import { HalftoneWaveWrapper } from '@/components/ui/HalftoneWaveWrapper';
import { DarkSectionSpotlight } from '@/components/ui/DarkSectionSpotlight';

export default function HomePage() {
  return (
    <main className="relative">
      <ScrollRevealProvider />
      <section style={{ padding: 0 }} className="relative z-[1] bg-black">
        {/* Global seamless background for the ENTIRE page, down to the footer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="w-full h-full">
            <HalftoneWaveWrapper />
          </div>
        </div>

        <Navbar />
        <HeroSection />
        
        {/* Unscaled content (100% scale to match product page) */}
        <DarkSectionSpotlight className="relative bg-transparent">
          <div className="relative z-10">
            <AIReadySection />
            <FeatureCards />
            
            {/* Unscaled content */}
            <div>
              <StatsSection />
            </div>

            {/* Pricing Section */}
            <div>
              <PricingClientWrapper />
            </div>

            {/* Unscaled content */}
            <div>
              <PrivacySection />
              <PreFooterCTA />
            </div>
          </div>
        </DarkSectionSpotlight>
        
        <Footer />
      </section>
    </main>
  );
}
