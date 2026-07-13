'use client';

/**
 * CheckoutForm — the full checkout flow for /checkout/[productId].
 *
 * Flow: (sign in / sign up) → payment method → channel-specific data entry
 * (card + billing / e-wallet phone / QRIS) → PIN → OTP → processing → success.
 *
 * Sign-in/sign-up is REAL: it calls the live backend auth service via
 * `@/lib/auth` (login / signup), the same one the rest of the site uses.
 *
 * PAYMENT IS A MOCK. `MOCK_PAYMENT` is `true` because Card / GoPay / DANA /
 * QRIS are not yet enabled on the Midtrans merchant account. No card number,
 * PIN, OTP, or phone number entered here is transmitted or stored anywhere —
 * `runMockPayment` just simulates a gateway round-trip. When the channels go
 * live, flip `MOCK_PAYMENT` to `false`: `runRealPayment` is already wired to
 * `createPaymentTransaction` + `startMidtransSnap` from `@/lib/payment`.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/context/LanguageContext';
import { login, signup, getUser, type User } from '@/lib/auth';
import {
  createPaymentTransaction,
  startMidtransSnap,
  isMidtransAvailable,
} from '@/lib/payment';
import { formatCheckoutPrice, type CheckoutCurrency } from '@/lib/checkout-format';

// Flip to false once Card/GoPay/DANA/QRIS are activated on the Midtrans
// merchant account — the real gateway path (runRealPayment) is ready.
const MOCK_PAYMENT: boolean = true;

type Step =
  | 'auth'
  | 'method'
  | 'details'
  | 'pin'
  | 'otp'
  | 'processing'
  | 'success';
type Channel = 'credit_card' | 'gopay' | 'dana' | 'qris';

export interface CheckoutFormProps {
  productId: string;
  productName: string;
  priceUsd: number;
  initialAuthed: boolean;
  onComplete: () => void;
}

const CHANNELS: { id: Channel; label: string; badge: React.ReactNode }[] = [
  {
    id: 'credit_card',
    label: 'Credit / Debit Card',
    badge: (
      <div className="flex gap-1">
        <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-blue-800 border border-gray-200">
          VISA
        </div>
        <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
          <div className="w-3 h-3 bg-red-500 rounded-full mix-blend-multiply opacity-80 -mr-1" />
          <div className="w-3 h-3 bg-yellow-400 rounded-full mix-blend-multiply opacity-80" />
        </div>
      </div>
    ),
  },
  {
    id: 'gopay',
    label: 'GoPay (E-Wallet)',
    badge: (
      <div className="px-2 h-5 bg-blue-500 rounded flex items-center justify-center text-[10px] font-bold text-white">
        gopay
      </div>
    ),
  },
  {
    id: 'dana',
    label: 'DANA (E-Wallet)',
    badge: (
      <div className="px-2 h-5 bg-[#118EEA] rounded flex items-center justify-center text-[10px] font-bold text-white">
        DANA
      </div>
    ),
  },
  {
    id: 'qris',
    label: 'QRIS',
    badge: (
      <div className="px-2 h-5 bg-[#EE1D52] rounded flex items-center justify-center text-[10px] font-bold text-white tracking-wide">
        QRIS
      </div>
    ),
  },
];

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

const inputClass =
  'w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[15px] text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] transition';
const labelClass =
  'block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5';
const primaryBtn =
  'w-full py-4 text-[15px] font-semibold bg-[#0d0d0d] text-white hover:bg-[#1a1a1a] rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed';
const backBtn =
  'text-[13px] text-gray-500 hover:text-[#1a1a1a] transition-colors mb-6 inline-flex items-center gap-1';

function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** Row of single-digit boxes with auto-advance + backspace-to-previous. */
function DigitBoxes({
  length,
  value,
  onChange,
  mask,
}: {
  length: number;
  value: string;
  onChange: (v: string) => void;
  mask?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(length, ' ').split('');

  const setDigit = (idx: number, char: string) => {
    const arr = value.split('');
    arr[idx] = char;
    onChange(arr.join('').slice(0, length));
  };

  const handleChange = (idx: number, raw: string) => {
    // Accept multi-digit input (paste, autofill, or fast typing that outruns
    // focus) by distributing digits across the boxes from `idx` onward.
    const incoming = raw.replace(/\D/g, '');
    if (!incoming) return;
    const arr = value.padEnd(length, ' ').split('');
    let cursor = idx;
    for (const ch of incoming) {
      if (cursor >= length) break;
      arr[cursor] = ch;
      cursor += 1;
    }
    onChange(arr.join('').replace(/ +$/g, ''));
    refs.current[Math.min(cursor, length - 1)]?.focus();
  };

  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (value[idx]) {
        setDigit(idx, '');
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus();
        setDigit(idx - 1, '');
      }
    }
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type={mask ? 'password' : 'text'}
          inputMode="numeric"
          maxLength={1}
          value={digits[i] === ' ' ? '' : digits[i]}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-14 text-center text-[20px] text-[#1a1a1a] border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] transition"
        />
      ))}
    </div>
  );
}

/**
 * Decorative QR placeholder — reads as a real QR in screenshots but encodes
 * nothing and is not scannable. Deterministic (no Math.random) so server and
 * client render identical markup.
 */
const QR_SIZE = 25;
const QR_MATRIX: boolean[][] = (() => {
  const finders: Array<[number, number]> = [
    [0, 0],
    [0, QR_SIZE - 7],
    [QR_SIZE - 7, 0],
  ];
  const finderPixel = (r: number, c: number) => {
    if (r === 0 || r === 6 || c === 0 || c === 6) return true;
    if (r === 1 || r === 5 || c === 1 || c === 5) return false;
    return true;
  };
  const m: boolean[][] = [];
  for (let r = 0; r < QR_SIZE; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < QR_SIZE; c++) {
      const zone = finders.find(
        ([zr, zc]) => r >= zr && r < zr + 7 && c >= zc && c < zc + 7
      );
      if (zone) row.push(finderPixel(r - zone[0], c - zone[1]));
      else if (r === 6 || c === 6) row.push((r + c) % 2 === 0);
      else row.push((r * 13 + c * 7 + r * c * 3) % 5 < 2);
    }
    m.push(row);
  }
  return m;
})();

function QrPlaceholder() {
  return (
    <div className="w-[200px] h-[200px] p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
      <svg
        viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
        width="100%"
        height="100%"
        shapeRendering="crispEdges"
      >
        <rect x={0} y={0} width={QR_SIZE} height={QR_SIZE} fill="#fff" />
        {QR_MATRIX.map((row, r) =>
          row.map((on, c) =>
            on ? (
              <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#1a1a1a" />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}

function MidtransBadge() {
  return (
    <div className="mt-12 flex justify-center">
      <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50/50 rounded px-3 py-1.5">
        <span className="text-[10px] font-semibold text-blue-400 tracking-wider">
          POWERED BY
        </span>
        <span className="text-sm font-bold text-blue-500 tracking-tight">
          midtrans
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CheckoutForm({
  productId,
  productName,
  priceUsd,
  initialAuthed,
  onComplete,
}: CheckoutFormProps) {
  const router = useRouter();
  const { language, setLanguage, exchangeRate } = useLanguage();
  const currency: CheckoutCurrency = language === 'id' ? 'IDR' : 'USD';
  const priceLabel = formatCheckoutPrice(priceUsd, currency, exchangeRate);

  const [step, setStep] = useState<Step>(initialAuthed ? 'method' : 'auth');
  const [channel, setChannel] = useState<Channel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);

  // Auth
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirm, setAuthConfirm] = useState('');
  const [authCompany, setAuthCompany] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingPostal, setBillingPostal] = useState('');
  const [billingCountry, setBillingCountry] = useState('Indonesia');

  // E-wallet fields
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    setCurrentUser(getUser());
  }, []);

  const payBefore = useRef<Date>(
    (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d;
    })()
  ).current;
  const dateStr = payBefore
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase();
  const timeStr = payBefore.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const isEwallet = channel === 'gopay' || channel === 'dana';
  const channelLabel = CHANNELS.find((c) => c.id === channel)?.label ?? '';

  const detailsValid =
    channel === 'credit_card'
      ? cardNumber.replace(/\D/g, '').length >= 12 &&
        cardExpiry.length === 5 &&
        cardCvv.length >= 3 &&
        cardName.trim().length > 1 &&
        billingAddress.trim().length > 3 &&
        billingCity.trim().length > 1 &&
        billingPostal.trim().length >= 4
      : isEwallet
        ? phone.replace(/\D/g, '').length >= 8
        : true;

  // -- Payment execution --------------------------------------------------

  const runMockPayment = () => {
    setStep('processing');
    // Simulate a gateway round-trip; no data is transmitted or stored.
    setTimeout(() => setStep('success'), 1600);
  };

  const runRealPayment = async () => {
    setStep('processing');
    setError(null);
    try {
      // Mirrors the real integration in payment-modal.tsx: create the
      // transaction, then hand the token to Midtrans Snap. Channel targeting
      // (enabled_payments) can be added here once the merchant account exposes
      // per-channel Snap options.
      const result = await createPaymentTransaction(productId);
      if (!result?.token) throw new Error('Failed to get payment token');

      if (isMidtransAvailable()) {
        await startMidtransSnap(result.token);
        setStep('success');
      } else if (typeof window !== 'undefined') {
        window.open(result.redirect_url || result.token, '_blank');
        setStep('details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed');
      setStep('details');
    }
  };

  const pay = () => (MOCK_PAYMENT ? runMockPayment() : runRealPayment());

  const handleDetailsContinue = () => {
    // E-wallets verify with an in-app PIN then an SMS OTP; card + QRIS pay now.
    if (isEwallet) setStep('pin');
    else pay();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (authMode === 'signup' && authPassword !== authConfirm) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthLoading(true);
    try {
      const user =
        authMode === 'signin'
          ? await login(authEmail, authPassword)
          : await signup(authEmail, authPassword, authCompany || undefined);
      setCurrentUser(user);
      setStep('method');
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // -- Render -------------------------------------------------------------

  return (
    <div className="w-full bg-white min-h-screen p-8 lg:p-12 text-[#1a1a1a] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <img
          src="/Aivory_logo_2_2026.svg"
          alt="Aivory"
          className="h-8 w-auto filter invert"
        />
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
          >
            {language === 'id' ? 'Bahasa Indonesia' : 'English'}
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {langOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
              {(['en', 'id'] as const).map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => {
                    setLanguage(lng);
                    setLangOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    language === lng ? 'font-semibold text-[#4a90e2]' : 'text-gray-700'
                  }`}
                >
                  {lng === 'en' ? 'English' : 'Bahasa Indonesia'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 max-w-lg mx-auto w-full bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-4 font-bold">
            ✕
          </button>
        </div>
      )}

      <div className="flex-grow flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        {/* ---- AUTH ---- */}
        {step === 'auth' && (
          <div className="w-full">
            <h1 className="text-2xl font-semibold mb-1 text-center">
              {authMode === 'signin' ? 'Sign in to continue' : 'Create your account'}
            </h1>
            <p className="text-sm text-gray-500 mb-8 text-center">
              {productName} · <span className="font-semibold text-[#1a1a1a]">{priceLabel}</span>
            </p>

            <div className="flex mb-6 border border-gray-200 rounded-full p-1 bg-gray-50">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
                  authMode === 'signin' ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-gray-500'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
                  authMode === 'signup' ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-gray-500'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              {authMode === 'signup' && (
                <div>
                  <label className={labelClass}>Company (optional)</label>
                  <input
                    type="text"
                    autoComplete="organization"
                    placeholder="Acme Corporation"
                    value={authCompany}
                    onChange={(e) => setAuthCompany(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  required
                  autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              {authMode === 'signup' && (
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={authConfirm}
                    onChange={(e) => setAuthConfirm(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
              {authError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                  {authError}
                </p>
              )}
              <button type="submit" disabled={authLoading} className={`${primaryBtn} mt-2`}>
                {authLoading
                  ? 'Please wait…'
                  : authMode === 'signin'
                    ? 'Sign In'
                    : 'Create Account'}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-gray-400">
              This step is real — it authenticates against your live Aivory account.
            </p>
          </div>
        )}

        {/* ---- METHOD ---- */}
        {step === 'method' && (
          <div className="w-full">
            {!initialAuthed && (
              <button type="button" onClick={() => setStep('auth')} className={backBtn}>
                ← Back
              </button>
            )}
            <p className="text-sm font-semibold text-gray-500 tracking-wider mb-4 text-center">
              PAY BEFORE {dateStr} AT {timeStr}
            </p>
            <h1 className="text-5xl font-light text-[#4a90e2] mb-12 text-center">
              {priceLabel}
            </h1>

            <p className="text-xs font-bold text-gray-500 tracking-wider mb-4">
              PAYMENT METHOD
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              {CHANNELS.map((c, i) => (
                <label
                  key={c.id}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                    i < CHANNELS.length - 1 ? 'border-b border-gray-200' : ''
                  } ${channel === c.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={channel === c.id}
                      onChange={() => setChannel(c.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="font-medium text-sm">{c.label}</span>
                  </div>
                  {c.badge}
                </label>
              ))}
            </div>

            <button
              type="button"
              disabled={!channel}
              onClick={() => setStep('details')}
              className={`${primaryBtn} mt-6`}
            >
              Continue
            </button>
            <MidtransBadge />
          </div>
        )}

        {/* ---- DETAILS ---- */}
        {step === 'details' && channel && (
          <div className="w-full">
            <button type="button" onClick={() => setStep('method')} className={backBtn}>
              ← Back
            </button>
            <h1 className="text-2xl font-semibold mb-1">{channelLabel}</h1>
            <p className="text-sm text-gray-500 mb-8">
              {productName} · <span className="font-semibold text-[#1a1a1a]">{priceLabel}</span>
            </p>

            {channel === 'credit_card' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Card Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="4811 1111 1111 1114"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className={labelClass}>Expiry</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>CVV</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      placeholder="123"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="As it appears on the card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="mt-2 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                    Billing Address
                  </p>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className={labelClass}>Address</label>
                      <input
                        type="text"
                        placeholder="Street address"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className={labelClass}>City</label>
                        <input
                          type="text"
                          placeholder="Jakarta"
                          value={billingCity}
                          onChange={(e) => setBillingCity(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div className="flex-1">
                        <label className={labelClass}>Postal Code</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="12345"
                          value={billingPostal}
                          onChange={(e) =>
                            setBillingPostal(e.target.value.replace(/\D/g, '').slice(0, 6))
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <input
                        type="text"
                        value={billingCountry}
                        onChange={(e) => setBillingCountry(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isEwallet && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>{channelLabel} Phone Number</label>
                  <div className="flex">
                    <span className="flex items-center px-4 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-[15px] text-gray-600">
                      +62
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="812xxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 13))}
                      className={`${inputClass} rounded-l-none flex-1`}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Next, you&apos;ll confirm with your {channelLabel.replace(' (E-Wallet)', '')} PIN
                  and a one-time code sent to this number.
                </p>
              </div>
            )}

            {channel === 'qris' && (
              <div className="flex flex-col items-center py-2">
                <QrPlaceholder />
                <p className="mt-5 text-sm text-gray-600 text-center max-w-xs">
                  Open GoPay, DANA, OVO, ShopeePay, or any mobile banking app and scan this QRIS
                  code to pay {priceLabel}.
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={!detailsValid}
              onClick={handleDetailsContinue}
              className={`${primaryBtn} mt-8`}
            >
              {channel === 'qris'
                ? "I've scanned and paid"
                : isEwallet
                  ? 'Continue'
                  : `Pay ${priceLabel}`}
            </button>
            <p className="mt-4 text-center text-xs text-gray-400">
              Preview only — no payment data is transmitted or stored.
            </p>
          </div>
        )}

        {/* ---- PIN ---- */}
        {step === 'pin' && isEwallet && (
          <div className="w-full">
            <button type="button" onClick={() => setStep('details')} className={backBtn}>
              ← Back
            </button>
            <h1 className="text-2xl font-semibold mb-1 text-center">
              Enter your {channelLabel.replace(' (E-Wallet)', '')} PIN
            </h1>
            <p className="text-sm text-gray-500 mb-8 text-center">
              Confirm the payment of{' '}
              <span className="font-semibold text-[#1a1a1a]">{priceLabel}</span> for {productName}.
            </p>
            <DigitBoxes length={6} value={pin} onChange={setPin} mask />
            <button
              type="button"
              disabled={pin.replace(/\D/g, '').length !== 6}
              onClick={() => setStep('otp')}
              className={`${primaryBtn} mt-8`}
            >
              Confirm PIN
            </button>
            <p className="mt-4 text-center text-xs text-gray-400">
              Preview only — no data is transmitted or stored.
            </p>
          </div>
        )}

        {/* ---- OTP ---- */}
        {step === 'otp' && isEwallet && (
          <div className="w-full">
            <button type="button" onClick={() => setStep('pin')} className={backBtn}>
              ← Back
            </button>
            <h1 className="text-2xl font-semibold mb-1 text-center">Enter the OTP code</h1>
            <p className="text-sm text-gray-500 mb-8 text-center">
              We sent a 6-digit code to +62 {phone || 'xxxxxxxxx'} to verify this payment.
            </p>
            <DigitBoxes length={6} value={otp} onChange={setOtp} />
            <button
              type="button"
              disabled={otp.replace(/\D/g, '').length !== 6}
              onClick={pay}
              className={`${primaryBtn} mt-8`}
            >
              Verify &amp; Pay {priceLabel}
            </button>
            <p className="mt-4 text-center text-xs text-gray-400">
              Preview only — no data is transmitted or stored.
            </p>
          </div>
        )}

        {/* ---- PROCESSING ---- */}
        {step === 'processing' && (
          <div className="py-16 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#4a90e2] animate-spin" />
            <p className="mt-6 text-[15px] text-gray-600">
              {isEwallet ? `Confirming your ${channelLabel.replace(' (E-Wallet)', '')} payment…` : 'Processing your payment…'}
            </p>
          </div>
        )}

        {/* ---- SUCCESS ---- */}
        {step === 'success' && (
          <div className="py-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl font-semibold">Payment successful</h1>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              {productName} · {priceLabel} via {channelLabel}
            </p>
            {currentUser?.email && (
              <p className="mt-1 text-xs text-gray-400">Signed in as {currentUser.email}</p>
            )}
            <button
              type="button"
              onClick={() => {
                onComplete();
                router.push('/dashboard');
              }}
              className={`${primaryBtn} mt-8 max-w-xs`}
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
