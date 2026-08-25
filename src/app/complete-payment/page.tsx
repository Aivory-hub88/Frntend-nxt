import type { Metadata } from "next";
import CompletePaymentClient from "./CompletePaymentClient";

export const metadata: Metadata = {
  title: "Complete your purchase — Aivory",
  description: "Finish checkout to keep your Aivory account.",
  alternates: {
    canonical: "/complete-payment",
  },
  robots: { index: false, follow: false },
};

export default function CompletePaymentPage() {
  return <CompletePaymentClient />;
}
