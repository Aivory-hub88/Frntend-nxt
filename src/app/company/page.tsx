import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/Footer";
import { CompanyHero } from "@/components/company/CompanyHero";
import { CompanyContent } from "@/components/company/CompanyContent";

export const metadata: Metadata = {
  title: "Company — Aivory",
  description:
    "Aivory helps ambitious teams understand complex operations, make clearer decisions, and build systems that last.",
};

export default function CompanyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] font-manrope">
      <Navbar />

      <main
        className="flex-1 bg-[#efeee8] text-[#11110f]"
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 300,
          background:
            "linear-gradient(to bottom, #050505 0, #050505 64px, #efeee8 64px, #efeee8 100%)",
        }}
      >
        <CompanyHero />
        <CompanyContent />
      </main>

      <Footer />
    </div>
  );
}
