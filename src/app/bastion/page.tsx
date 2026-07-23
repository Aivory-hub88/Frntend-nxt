import Navbar from '@/components/home/Navbar';
import BastionVisualHero from '@/components/bastion/BastionVisualHero';
import BastionHero from '@/components/bastion/BastionHero';
import BastionOverview from '@/components/bastion/BastionOverview';
import BastionDomains from '@/components/bastion/BastionDomains';
import BastionMetrics from '@/components/bastion/BastionMetrics';
import BastionCapabilities from '@/components/bastion/BastionCapabilities';
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
      {/* Global static background gradient for the ENTIRE page */}
      <BastionBackground />
      
      <div className="relative z-10">
        <Navbar />
        <BastionVisualHero />
        <BastionHero />
        <BastionOverview />
        <BastionDomains />
        <BastionMetrics />
        <BastionCapabilities />
        <BastionDeployment />
        <BastionEnterpriseTrust />
        <BastionClosing />
        <BastionContact />
        <Footer />
      </div>
    </main>
  );
}
