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
  /** 'subscription' shows a `/month` suffix and recurring note. */
  recurring: boolean;
  /** The applied promo, if any. A preview: the server re-derives the charge. */
  promo?: PromoQuote | null;
  onPromoChange?: (promo: PromoQuote | null) => void;
}

export function OrderSummary({
  productId,
  productName,
  priceUsd,
  invoiceNumber,
  recurring,
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

  const intervalSuffix = recurring ? (language === 'id' ? '/bulan' : '/month') : '';

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen p-8 lg:p-12 text-[#1a1a1a]">
      <h2 className="text-2xl font-semibold mb-2">Order Summary</h2>
      <p className="text-sm text-gray-500 mb-8">Invoice #: {invoiceNumber}</p>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
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
          <span className="text-xs uppercase tracking-wide text-gray-400">
            {recurring ? 'Subscription' : 'One-time purchase'}
          </span>
        </div>
        <span className="font-semibold whitespace-nowrap">
          {priceLabel}
          {intervalSuffix && (
            <span className="text-xs font-normal text-gray-400">{intervalSuffix}</span>
          )}
        </span>
      </div>

      {info && (
        <>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">{info.description}</p>
          <ul className="space-y-1.5 mb-6">
            {info.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4 mt-0.5 text-green-500 shrink-0"
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
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm">
              <span className="text-green-800">
                <span className="font-mono font-semibold">{promo.code}</span> applied
              </span>
              <button
                type="button"
                onClick={() => onPromoChange(null)}
                className="text-xs text-gray-500 underline-offset-2 hover:text-[#1a1a1a] hover:underline"
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
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-mono text-sm text-[#1a1a1a] placeholder:font-sans placeholder:text-gray-400 focus:border-[#4a90e2] focus:outline-none focus:ring-1 focus:ring-[#4a90e2]"
                />
                <button
                  type="button"
                  onClick={() => void applyPromo()}
                  disabled={checking || !codeDraft.trim()}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checking ? '…' : 'Apply'}
                </button>
              </div>
              {promoError && <p className="mt-2 text-xs text-red-600">{promoError}</p>}
            </>
          )}
        </div>
      )}

      {promo && (
        <div className="mb-4 flex justify-between text-sm text-green-700">
          <span>Promo {promo.code}</span>
          <span className="whitespace-nowrap">−{discountLabel}</span>
        </div>
      )}

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <span className="font-semibold text-gray-700">Total Amount Due</span>
        <span className="text-xl font-bold whitespace-nowrap">
          {totalLabel}
          {intervalSuffix && (
            <span className="text-sm font-normal text-gray-400">{intervalSuffix}</span>
          )}
        </span>
      </div>

      {recurring && (
        <p className="mt-3 text-xs text-gray-400 leading-relaxed">
          Recurring monthly. You can cancel anytime from your dashboard.
        </p>
      )}
    </div>
  );
}
