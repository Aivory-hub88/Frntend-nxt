import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import Footer from '@/components/Footer';
import ScrollRevealProvider from '@/components/home/ScrollRevealProvider';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import PromoVideoSection from '@/components/home/landing/PromoVideoSection';
import HowItWorksSection from '@/components/home/landing/HowItWorksSection';
import CervoSection from '@/components/home/landing/CervoSection';
import WorkspaceSection from '@/components/home/landing/WorkspaceSection';
import WorkflowBuilderSection from '@/components/home/landing/WorkflowBuilderSection';
import LandingPricing from '@/components/home/landing/LandingPricing';
import ComparisonSection from '@/components/home/landing/ComparisonSection';
import PrivacyPanel from '@/components/home/landing/PrivacyPanel';
import ClosingCTA from '@/components/home/landing/ClosingCTA';
import SectionReveal from '@/components/home/landing/SectionReveal';
import styles from '@/components/home/landing/landing.module.css';
import { JsonLd, buildHomePageGraph, siteUrlFromHeaders } from '@/lib/seo';

export default function HomePage() {
  const siteUrl = siteUrlFromHeaders();

  return (
    <main className="relative">
      <JsonLd data={buildHomePageGraph(siteUrl)} />
      <ScrollRevealProvider />
      <section style={{ padding: 0 }} className="relative isolate z-[1] bg-[#03141b]">
        {/* Site-wide ambient wash. The interactive flower is intentionally
            mounted by Footer only, so the hero and content stay lightweight. */}
        <AmbientBackground className="fixed inset-0 z-0" />

        {/* The whole page lives in this one isolated stack, so the nav needs no portal. */}
        <Navbar inPlace />
        <HeroSection />

        {/* Everything between the hero and the footer: alternating light / dark
            bands on an opaque surface that covers the fixed ambient wash.
            `no-word-split` opts these sections out of ScrollRevealProvider's
            per-word reveal: it hid text again on scroll-up (reverse) and kept
            line breaks measured at load, so text re-wrapped badly on resize. */}
        <div id="landing-bands" className={`${styles.landing} no-word-split`}>
          <SectionReveal rootId="landing-bands" />
          <PromoVideoSection />
          <HowItWorksSection />
          <CervoSection />
          <WorkspaceSection />
          <WorkflowBuilderSection />
          <LandingPricing />
          <ComparisonSection />
          <PrivacyPanel />
          <ClosingCTA />
        </div>

        <Footer landingAmbient />
      </section>
    </main>
  );
}
