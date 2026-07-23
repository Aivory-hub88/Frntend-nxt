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
    <main className="relative bg-black min-h-screen text-white font-manrope selection:bg-[#521cd5] selection:text-white">
      
      {/* 1. Hero Section (With Flower Animation Background) */}
      <div className="relative overflow-hidden min-h-screen">
        <BastionBackground className="absolute inset-0 z-0 pointer-events-none overflow-hidden" />
        <div className="relative z-10">
          <Navbar />
          <BastionVisualHero />
          <BastionHero />
        </div>
      </div>

      {/* 2. Middle Sections (Pure Solid Black Background, NO Flower Animation) */}
      <div className="relative z-10 bg-black">
        <BastionOverview />
        <BastionMetrics />
        <BastionDeployment />
        <BastionEnterpriseTrust />
      </div>

      {/* 3. Footer / Closing Section (With Flower Animation Background) */}
      <div className="relative overflow-hidden">
        <BastionBackground className="absolute inset-0 z-0 pointer-events-none overflow-hidden" />
        <div className="relative z-10">
          <BastionClosing />
          <BastionContact />
          <Footer />
        </div>
      </div>

    </main>
  );
}
