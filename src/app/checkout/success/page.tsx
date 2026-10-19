import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutSuccessClient from "./CheckoutSuccessClient";

export const metadata: Metadata = {
  title: "Payment status — Aivory",
  description: "The status of your Aivory payment.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
