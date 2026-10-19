'use client';

/**
 * /checkout/success — where Midtrans sends a customer after paying outside our
 * page (Snap's hosted page, an e-wallet app's return, the ShopeePay callback).
 * avry-payments sets it as the transaction's finish URL; Midtrans appends
 * `?order_id=…&transaction_status=…`.
 *
 * The query string is only a hint. A signed-in customer gets the real answer
 * from avry-payments' POST /confirm, which re-checks the order with Midtrans and
 * applies the plan if it has settled. Without a session we can only echo
 * Midtrans' hint and ask them to sign in.
 */

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { confirmOrder, type OrderConfirmation } from '@/lib/payment';

type View = 'checking' | 'paid' | 'paidHint' | 'activating' | 'pending' | 'failed' | 'signin' | 'unknown';

const PAID = new Set(['settlement', 'capture']);
const FAILED = new Set(['deny', 'cancel', 'expire', 'failure']);

const primaryBtn =
  'w-full py-4 text-[15px] font-semibold bg-[#0d0d0d] text-white hover:bg-[#1a1a1a] rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed';
const secondaryBtn =
  'w-full py-4 text-[15px] font-semibold border border-gray-300 text-[#1a1a1a] hover:bg-gray-50 rounded-lg transition';

function formatIdr(amount: number | null | undefined): string | null {
  if (amount === null || amount === undefined) return null;
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
}

/** Map a confirmation onto what the customer should see. */
export function viewFor(c: OrderConfirmation): View {
  if (c.granted) return 'paid';
  if (c.status === 'failed' || c.status === 'amount_mismatch') return 'failed';
  // Money arrived but the plan is not on yet (e.g. a grant retry in flight).
  if (c.status === 'paid_grant_failed') return 'activating';
  if (c.status === 'pending') return 'pending';
  return 'unknown';
}

/** Best guess from Midtrans' query string alone, for a visitor with no session. */
export function viewFromHint(transactionStatus: string | null): View {
  if (!transactionStatus) return 'unknown';
  if (PAID.has(transactionStatus)) return 'paid';
  if (FAILED.has(transactionStatus)) return 'failed';
  if (transactionStatus === 'pending') return 'pending';
  return 'unknown';
}

const COPY: Record<View, { title: string; body: string; tone: 'ok' | 'wait' | 'bad' }> = {
  checking: { title: 'Checking your payment…', body: 'This takes a moment.', tone: 'wait' },
  paid: {
    title: 'Payment successful',
    body: 'Your plan is active. A receipt is on its way to your email.',
    tone: 'ok',
  },
  // Midtrans says paid, but with no session we can't confirm the plan yet.
  paidHint: {
    title: 'Payment successful',
    body: 'Midtrans reports your payment as completed. Sign in to your dashboard to see your plan — it switches on as soon as the payment is confirmed.',
    tone: 'ok',
  },
  activating: {
    title: 'Payment received',
    body: 'We have your payment and are switching your plan on. This usually takes a minute — refresh to check again.',
    tone: 'wait',
  },
  pending: {
    title: 'Waiting for your payment',
    body: 'Complete the payment with the instructions Midtrans gave you (virtual account, QRIS or e-wallet). Your plan switches on automatically once it is paid, and we email you a receipt.',
    tone: 'wait',
  },
  failed: {
    title: 'Payment not completed',
    body: 'The payment was declined, cancelled or expired. No charge was made. You can try again with another method.',
    tone: 'bad',
  },
  signin: {
    title: 'Sign in to see your payment',
    body: 'Sign in with the account you paid with, then open your dashboard to see your plan and receipt.',
    tone: 'wait',
  },
  unknown: {
    title: 'We couldn’t find that payment',
    body: 'If you just paid, open your dashboard — your plan and receipt appear there once the payment settles.',
    tone: 'wait',
  },
};

function StatusIcon({ tone }: { tone: 'ok' | 'wait' | 'bad' }) {
  const bg = tone === 'ok' ? 'bg-green-500' : tone === 'bad' ? 'bg-red-500' : 'bg-amber-500';
  return (
    <div className={`w-16 h-16 rounded-full ${bg} flex items-center justify-center`}>
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {tone === 'ok' && <path d="M5 13l4 4L19 7" />}
        {tone === 'bad' && <path d="M6 6l12 12M18 6L6 18" />}
        {tone === 'wait' && (
          <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4l3 2" />
          </>
        )}
      </svg>
    </div>
  );
}

export default function CheckoutSuccessClient() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get('order_id');
  const hint = params.get('transaction_status');

  const [view, setView] = useState<View>('checking');
  const [order, setOrder] = useState<OrderConfirmation | null>(null);

  const check = useCallback(async () => {
    if (!orderId) {
      setView('unknown');
      return;
    }
    if (!isAuthenticated()) {
      // Midtrans' hint is all we have; still say plainly what it reported.
      const guess = viewFromHint(hint);
      setView(guess === 'unknown' ? 'signin' : guess === 'paid' ? 'paidHint' : guess);
      return;
    }
    setView('checking');
    const result = await confirmOrder(orderId);
    setOrder(result);
    const fallback = viewFromHint(hint);
    setView(result.ok ? viewFor(result) : fallback === 'paid' ? 'paidHint' : fallback);
  }, [orderId, hint]);

  useEffect(() => {
    void check();
  }, [check]);

  const copy = COPY[view];
  const amount = formatIdr(order?.amountIdr);
  const signedIn = typeof window !== 'undefined' && isAuthenticated();

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <StatusIcon tone={copy.tone} />
        <h1 className="mt-6 text-2xl font-semibold">{copy.title}</h1>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">{copy.body}</p>

        {order?.productName && (
          <div className="mt-8 w-full rounded-xl border border-gray-200 p-5 text-left text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Plan</span>
              <span className="font-medium">{order.productName}</span>
            </div>
            {amount && (
              <div className="mt-2 flex justify-between gap-4">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">{amount}</span>
              </div>
            )}
            {order.promoCode && (
              <div className="mt-2 flex justify-between gap-4">
                <span className="text-gray-500">Promo code</span>
                <span className="font-mono">{order.promoCode}</span>
              </div>
            )}
            {orderId && (
              <div className="mt-2 flex justify-between gap-4">
                <span className="text-gray-500">Order</span>
                <span className="font-mono text-xs break-all">{orderId}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 w-full flex flex-col gap-3">
          {view === 'signin' ? (
            <button
              type="button"
              className={primaryBtn}
              onClick={() => router.push('/login')}
            >
              Sign in
            </button>
          ) : view === 'failed' ? (
            <button type="button" className={primaryBtn} onClick={() => router.push('/pricing')}>
              Try again
            </button>
          ) : (
            <button type="button" className={primaryBtn} onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </button>
          )}
          {(view === 'pending' || view === 'activating' || view === 'unknown') && signedIn && (
            <button type="button" className={secondaryBtn} onClick={() => void check()}>
              Refresh status
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
