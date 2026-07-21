import Navbar from '@/components/home/Navbar';
import BastionHero from '@/components/bastion/BastionHero';
import BastionOverview from '@/components/bastion/BastionOverview';
import BastionDomains from '@/components/bastion/BastionDomains';
import BastionDeployment from '@/components/bastion/BastionDeployment';
import BastionEnterpriseTrust from '@/components/bastion/BastionEnterpriseTrust';
import BastionContact from '@/components/bastion/BastionContact';
import BastionFooter from '@/components/bastion/BastionFooter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bastion | Autonomous Infrastructure Defense | Aivory',
  description: 'Bastion is an AI-native security operating layer that continuously observes infrastructure behavior, understands evolving threats, and autonomously coordinates defensive actions.',
};

export default function BastionPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white font-manrope selection:bg-[#521cd5] selection:text-white">
      <Navbar />
      <BastionHero />
      <BastionOverview />
      <BastionDomains />
      <BastionDeployment />
      <BastionEnterpriseTrust />
      <BastionContact />
      <BastionFooter />
    </main>
  );
}
