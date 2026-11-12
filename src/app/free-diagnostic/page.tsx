import type { Metadata } from "next";
import FreeSignupClient from "./FreeSignupClient";

const TITLE = "Free AI Readiness Analysis — Business Operations Diagnostic";
const DESCRIPTION =
  "Create a free Aivory account and run 2 AI readiness analyses of your business operations in your dashboard. No card needed.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/free-diagnostic",
  },
  openGraph: {
    type: "website",
    title: `${TITLE} | Aivory`,
    description: DESCRIPTION,
    url: "/free-diagnostic",
    images: ["/hero-video-poster.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Aivory`,
    description: DESCRIPTION,
    images: ["/hero-video-poster.jpg"],
  },
};

export default function FreeDiagnosticPage() {
  return <FreeSignupClient />;
}
