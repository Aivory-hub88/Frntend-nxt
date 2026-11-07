import type { Metadata } from "next";
import FreeDiagnosticClient from "./FreeDiagnosticClient";

export const metadata: Metadata = {
  title: "Free AI Readiness Analysis — Business Operations Diagnostic",
  description:
    'Free AI readiness analysis: 12 questions score your process, data, strategy and governance maturity. Instant report card.',
  alternates: {
    canonical: "/free-diagnostic",
  },
  openGraph: {
    type: "website",
    title: "Free AI Readiness Analysis — Business Operations Diagnostic | Aivory",
    description:
      "Take Aivory's free AI readiness and operational maturity analysis. Twelve questions score your process, data, strategy, governance, and people maturity, and produce a downloadable report card.",
    url: "/free-diagnostic",
    images: ["/hero-video-poster.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Readiness Analysis — Business Operations Diagnostic | Aivory",
    description:
      "Take Aivory's free AI readiness and operational maturity analysis. Twelve questions score your process, data, strategy, governance, and people maturity, and produce a downloadable report card.",
    images: ["/hero-video-poster.jpg"],
  },
};

export default function FreeDiagnosticPage() {
  return <FreeDiagnosticClient />;
}