import Navbar from '@/components/home/Navbar';
import BastionVisualHero from '@/components/bastion/BastionVisualHero';
import BastionHero from '@/components/bastion/BastionHero';
import BastionOverview from '@/components/bastion/BastionOverview';
import BastionMetrics from '@/components/bastion/BastionMetrics';
import BastionDeployment from '@/components/bastion/BastionDeployment';
import BastionEnterpriseTrust from '@/components/bastion/BastionEnterpriseTrust';
import BastionClosing from '@/components/bastion/BastionClosing';
import BastionContact from '@/components/bastion/BastionContact';
import Footer from '@/components/Footer';
import BastionBackground from '@/components/bastion/BastionBackground';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bastion | Autonomous Infrastructure Defense | Aivory',
  description: 'Bastion is an AI-native security operating layer that continuously observes infrastructure behavior, understands evolving threats, and autonomously coordinates defensive actions.',
};

export default function BastionPage() {
  return (
    <main className="relative bg-black min-h-screen text-white font-manrope selection:bg-[#165444] selection:text-white">
      
      {/* Global Ambient Background Gradient Wash (Fixed across ENTIRE page in #165444 emerald teal) */}
      <BastionBackground mode="gradient-only" className="fixed inset-0 z-0 pointer-events-none overflow-hidden" />

      {/* 1. Hero Section (Flower Animation ONLY appears here with #165444 palette) */}
      <div className="relative overflow-hidden min-h-screen z-10">
        <BastionBackground mode="flower-only" scale={1} className="absolute inset-0 z-0 pointer-events-none overflow-hidden" />
        <div className="relative z-10">
          <Navbar />
          <BastionVisualHero />
          <BastionHero />
        </div>
      </div>

      {/* 2. Middle & Footer Sections (Gradient Wash Only, NO Flower Animation) */}
      <div className="relative z-10">
        <BastionOverview />
        <BastionMetrics />
        <BastionDeployment />
        <BastionEnterpriseTrust />
        <BastionClosing />
        <BastionContact />
        <Footer />
      </div>

    </main>
  );
}
