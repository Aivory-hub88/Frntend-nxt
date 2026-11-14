'use client';

/**
 * Google Pay, drawn on Aivory's own checkout instead of inside Snap.
 *
 * The button is Google's own (createButton), so it carries the real mark and
 * follows their brand rules. Midtrans is the gateway: the payments service
 * hands us an authJwt for this origin, Google returns an encrypted token for
 * the customer's card, and that token is charged through Core API.
 */
import React, { useEffect, useRef, useState } from 'react';
import { getGooglePayConfig } from '@/lib/payment';

const PAY_JS = 'https://pay.google.com/gp/p/js/pay.js';

type GPayClient = {
  isReadyToPay: (req: unknown) => Promise<{ result: boolean }>;
  createButton: (opts: Record<string, unknown>) => HTMLElement;
  loadPaymentData: (req: unknown) => Promise<{
    paymentMethodData: { tokenizationData: { token: string } };
  }>;
};

declare global {
  interface Window {
    google?: { payments?: { api?: { PaymentsClient: new (o: unknown) => GPayClient } } };
  }
}

function loadPayJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.payments?.api) return resolve();
    const existing = document.querySelector(`script[src="${PAY_JS}"]`);
    const script = (existing as HTMLScriptElement) ?? document.createElement('script');
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Google Pay could not be loaded')));
    if (!existing) {
      script.src = PAY_JS;
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

export interface GooglePayButtonProps {
  /** Shown in Google's sheet; the amount actually charged is set server-side. */
  totalPrice: string;
  currencyCode: string;
  disabled?: boolean;
  /** Called with Google's token object once the customer approves. */
  onToken: (token: Record<string, unknown>) => void;
  onError: (message: string) => void;
}

export default function GooglePayButton({
  totalPrice,
  currencyCode,
  disabled,
  onToken,
  onError,
}: GooglePayButtonProps) {
  const holder = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  // The button is created once; keep callbacks fresh without recreating it.
  const latest = useRef({ onToken, onError, disabled, totalPrice, currencyCode });
  latest.current = { onToken, onError, disabled, totalPrice, currencyCode };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const config = await getGooglePayConfig();
        await loadPayJs();
        const api = window.google?.payments?.api;
        if (!api || cancelled) return;

        const client = new api.PaymentsClient({
          environment: config.is_production ? 'PRODUCTION' : 'TEST',
        });
        const card = {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['VISA', 'MASTERCARD', 'JCB'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'midtrans',
              gatewayMerchantId: config.gateway_merchant_id,
            },
          },
        };
        const base = { apiVersion: 2, apiVersionMinor: 0, allowedPaymentMethods: [card] };

        const ready = await client.isReadyToPay(base);
        if (cancelled) return;
        if (!ready.result) {
          setState('unavailable');
          return;
        }

        const button = client.createButton({
          buttonColor: 'black',
          buttonType: 'pay',
          buttonSizeMode: 'fill',
          buttonRadius: 8,
          onClick: async () => {
            if (latest.current.disabled) return;
            try {
              const data = await client.loadPaymentData({
                ...base,
                merchantInfo: {
                  merchantName: 'Aivory',
                  ...(config.auth_jwt ? { authJwt: config.auth_jwt } : {}),
                },
                transactionInfo: {
                  totalPriceStatus: 'ESTIMATED',
                  totalPrice: latest.current.totalPrice,
                  currencyCode: latest.current.currencyCode,
                },
              });
              latest.current.onToken(JSON.parse(data.paymentMethodData.tokenizationData.token));
            } catch (e) {
              // Closing Google's sheet is not an error.
              if ((e as { statusCode?: string })?.statusCode === 'CANCELED') return;
              latest.current.onError(
                (e as { statusMessage?: string })?.statusMessage ||
                  (e instanceof Error ? e.message : 'Google Pay could not complete'),
              );
            }
          },
        });
        button.style.width = '100%';
        button.style.height = '48px';
        holder.current?.replaceChildren(button);
        setState('ready');
      } catch (e) {
        if (cancelled) return;
        setState('unavailable');
        latest.current.onError(e instanceof Error ? e.message : 'Google Pay is unavailable');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div ref={holder} className={state === 'ready' ? '' : 'hidden'} />
      {state === 'loading' && <p className="text-sm text-gray-500">Loading Google Pay…</p>}
      {state === 'unavailable' && (
        <p className="text-sm text-gray-500">
          Google Pay is not available on this device or browser. Choose another payment method.
        </p>
      )}
    </div>
  );
}
