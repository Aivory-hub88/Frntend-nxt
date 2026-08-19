import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import AIReadySection from '@/components/home/AIReadySection';
import FeatureCards from '@/components/home/FeatureCards';
import StatsSection from '@/components/home/StatsSection';
import EnterpriseComparisonSection from '@/components/home/EnterpriseComparisonSection';
import PricingClientWrapper from '@/app/pricing/PricingClientWrapper';
import PrivacySection from '@/components/home/PrivacySection';
import PreFooterCTA from '@/components/home/PreFooterCTA';
import Footer from '@/components/Footer';
import ScrollRevealProvider from '@/components/home/ScrollRevealProvider';
import { HalftoneWaveWrapper } from '@/components/ui/HalftoneWaveWrapper';
import BastionBackground from '@/components/bastion/BastionBackground';
import { DarkSectionSpotlight } from '@/components/ui/DarkSectionSpotlight';
import { JsonLd, buildHomePageGraph, siteUrlFromHeaders } from '@/lib/seo';

export default function HomePage() {
  const siteUrl = siteUrlFromHeaders();

  return (
    <main className="relative">
      <JsonLd data={buildHomePageGraph(siteUrl)} />
      <ScrollRevealProvider />
      <section style={{ padding: 0 }} className="relative z-[1] bg-black">
        {/* Global Ambient Background Gradient Wash (Fixed across ENTIRE page in #165444 emerald teal) */}
        <BastionBackground mode="gradient-only" className="fixed inset-0 z-0 pointer-events-none overflow-hidden" />
        
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

            <div className="w-full pt-16 md:pt-24 pb-2 md:pb-4 px-6 flex flex-col items-center justify-center text-center">
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-[#B3B3B3] leading-relaxed max-w-3xl"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
              >
                Beyond AI chat.<br />
                <span className="text-white font-light">Built to understand how your business actually operates.</span>
              </h2>
            </div>

            <FeatureCards />

            <div>
              <StatsSection />
            </div>

            <EnterpriseComparisonSection />

            <div>
              <PricingClientWrapper />
            </div>

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
