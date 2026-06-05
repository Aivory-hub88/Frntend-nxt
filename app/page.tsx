import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import AIReadySection from '@/components/home/AIReadySection';
import FeatureCards from '@/components/home/FeatureCards';
import StatsSection from '@/components/home/StatsSection';
import PricingStepOne from '@/components/home/PricingStepOne';
import PricingStepTwo from '@/components/home/PricingStepTwo';
import PrivacySection from '@/components/home/PrivacySection';
import PreFooterCTA from '@/components/home/PreFooterCTA';
import Footer from '@/components/Footer';
import ScrollRevealProvider from '@/components/home/ScrollRevealProvider';

export default function HomePage() {
  return (
    <main className="relative">
      <ScrollRevealProvider />
      <section style={{ padding: 0 }} className="relative z-[1]">
        <Navbar />
        <HeroSection />
        <AIReadySection />
        <FeatureCards />
        <StatsSection />
        <PricingStepOne />
        <PricingStepTwo />
        <PrivacySection />
        <PreFooterCTA />
        <Footer />
      </section>
    </main>
  );
}
