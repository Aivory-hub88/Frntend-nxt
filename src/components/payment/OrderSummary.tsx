'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/context/LanguageContext';
import { formatCheckoutPrice, type CheckoutCurrency } from '@/lib/checkout-format';
import { getServiceInfo } from '@/lib/checkout-catalog';
import { validatePromoCode, type PromoQuote } from '@/lib/payment';

export interface OrderSummaryProps {
  productId: string;
  productName: string;
  priceUsd: number;
  invoiceNumber: string;
  /** 'subscription' shows a `/month` (or `/year`) suffix and billing note. */
  recurring: boolean;
  /** Billing period of a subscription; defaults to monthly. */
  interval?: 'one-time' | 'month' | 'year';
  /** The applied promo, if any. A preview: the server re-derives the charge. */
  promo?: PromoQuote | null;
  onPromoChange?: (promo: PromoQuote | null) => void;
}

// Film grain for the gradient panel: fractal noise, desaturated, tiled. Inline
// so the panel needs no extra request and the grain stays crisp at any size.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Three-colour field — deep navy, Aivory blue, warm orange — blended with soft
// radial pools rather than a straight linear ramp, so it reads as light.
const FIELD = [
  'radial-gradient(120% 70% at 15% 0%, #0a1f4d 0%, rgba(10,31,77,0) 70%)',
  'radial-gradient(90% 60% at 85% 35%, #2b63c6 0%, rgba(43,99,198,0) 75%)',
  'radial-gradient(110% 60% at 30% 100%, #f2601d 0%, rgba(242,96,29,0) 70%)',
  'radial-gradient(80% 50% at 95% 95%, #f59a3c 0%, rgba(245,154,60,0) 70%)',
  'linear-gradient(180deg, #0d2a63 0%, #1f4f9f 48%, #c8662f 100%)',
].join(', ');

export function OrderSummary({
  productId,
  productName,
  priceUsd,
  invoiceNumber,
  recurring,
  interval = 'month',
  promo = null,
  onPromoChange,
}: OrderSummaryProps) {
  const { language, exchangeRate } = useLanguage();
  const currency: CheckoutCurrency = language === 'id' ? 'IDR' : 'USD';
  const priceLabel = formatCheckoutPrice(priceUsd, currency, exchangeRate);
  const discountLabel = promo
    ? formatCheckoutPrice(promo.discountUsd, currency, exchangeRate)
    : '';
  const totalLabel = promo
    ? formatCheckoutPrice(promo.finalUsd, currency, exchangeRate)
    : priceLabel;

  const [codeDraft, setCodeDraft] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const applyPromo = async () => {
    const code = codeDraft.trim().toUpperCase();
    if (!code || !onPromoChange) return;
    setChecking(true);
    setPromoError(null);
    const result = await validatePromoCode(productId, code);
    setChecking(false);
    if (result.valid) {
      onPromoChange(result.quote);
      setCodeDraft('');
    } else {
      setPromoError(result.error);
    }
  };
  const info = getServiceInfo(productId);

  const payBefore = new Date();
  payBefore.setDate(payBefore.getDate() + 1);
  const formattedDate = payBefore.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const annual = recurring && interval === 'year';
  const intervalSuffix = !recurring
    ? ''
    : annual
      ? language === 'id' ? '/tahun' : '/year'
      : language === 'id' ? '/bulan' : '/month';

  return (
    <div
      className="relative isolate w-full min-h-screen overflow-hidden p-8 lg:p-12 text-white"
      style={{ backgroundImage: FIELD, backgroundColor: '#0d2a63' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.45] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: '220px 220px' }}
      />
      <h2 className="text-2xl font-semibold mb-2">Order Summary</h2>
      <p className="text-sm text-white/60 mb-8">Invoice #: {invoiceNumber}</p>

      <div className="flex items-center gap-2 text-sm text-white/75 mb-8 pb-8 border-b border-white/15">
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Pay before {formattedDate}
      </div>

      <div className="flex justify-between items-start mb-2">
        <div className="pr-4">
          <span className="font-medium block">{productName}</span>
          <span className="text-xs uppercase tracking-wide text-white/50">
            {recurring ? 'Subscription' : 'One-time purchase'}
          </span>
        </div>
        <span className="font-semibold whitespace-nowrap">
          {priceLabel}
          {intervalSuffix && (
            <span className="text-xs font-normal text-white/50">{intervalSuffix}</span>
          )}
        </span>
      </div>

      {info && (
        <>
          <p className="text-sm text-white/70 leading-relaxed mb-4">{info.description}</p>
          <ul className="space-y-1.5 mb-6">
            {info.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-white/85">
                <svg
                  className="w-4 h-4 mt-0.5 text-white shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </>
      )}

      {onPromoChange && (
        <div className="mb-6">
          {promo ? (
            <div className="flex items-center justify-between rounded-lg border border-white/25 bg-white/10 px-3 py-2.5 text-sm backdrop-blur-md">
              <span className="text-white">
                <span className="font-mono font-semibold">{promo.code}</span> applied
              </span>
              <button
                type="button"
                onClick={() => onPromoChange(null)}
                className="text-xs text-white/70 underline-offset-2 hover:text-white hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  value={codeDraft}
                  onChange={(e) => {
                    setCodeDraft(e.target.value.toUpperCase());
                    if (promoError) setPromoError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void applyPromo();
                    }
                  }}
                  placeholder="Promo code"
                  aria-label="Promo code"
                  maxLength={32}
                  className="min-w-0 flex-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2.5 font-mono text-sm text-white backdrop-blur-md placeholder:font-sans placeholder:text-white/55 focus:border-white/60 focus:outline-none focus:ring-1 focus:ring-white/60"
                />
                <button
                  type="button"
                  onClick={() => void applyPromo()}
                  disabled={checking || !codeDraft.trim()}
                  className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#0d2a63] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checking ? '…' : 'Apply'}
                </button>
              </div>
              {promoError && (
                <p className="mt-2 rounded-md bg-black/25 px-2 py-1 text-xs text-white">{promoError}</p>
              )}
            </>
          )}
        </div>
      )}

      {promo && (
        <div className="mb-4 flex justify-between text-sm text-white/90">
          <span>Promo {promo.code}</span>
          <span className="whitespace-nowrap">−{discountLabel}</span>
        </div>
      )}

      <div className="flex justify-between items-center pt-6 border-t border-white/20">
        <span className="font-semibold text-white/90">Total Amount Due</span>
        <span className="text-xl font-bold whitespace-nowrap">
          {totalLabel}
          {intervalSuffix && (
            <span className="text-sm font-normal text-white/55">{intervalSuffix}</span>
          )}
        </span>
      </div>

      {recurring && (
        <p className="mt-3 text-xs text-white/60 leading-relaxed">
          {annual
            ? 'Billed annually — 12 months of access in one payment.'
            : 'Billed monthly. You can cancel anytime from your dashboard.'}
        </p>
      )}
    </div>
  );
}
