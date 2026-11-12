'use client';

/**
 * Free AI Readiness Analysis entry point.
 *
 * Since 2026-11-12 the free analysis runs inside the user dashboard (a free
 * account gets 2 diagnostics there, avry-backend FREE_GRANTS). Every
 * "free analysis" CTA on the site points at /free-diagnostic, so this page
 * creates (or signs in to) the account and hands the visitor to
 * /dashboard/diagnostics. Already signed in → straight to the dashboard.
 *
 * Laid out like the checkout (white form left, grainy-gradient summary
 * right) but in its own Indigo + Orchid + Peach palette instead of the
 * checkout's silver-blue-orange.
 */

import { useEffect, useState, type FormEvent } from 'react';
import { isAuthenticated, login, signup } from '@/lib/auth';
import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/components/context/LanguageContext';
import { GrainGradient, INDIGO_ORCHID_PEACH, INDIGO_ORCHID_PEACH_HEADER } from '@/components/ui/GrainGradient';
import { GradientWordmark } from '@/components/ui/GradientWordmark';
import { SpotlightButton } from '@/components/ui/SpotlightButton';
import { PasswordInput } from '@/components/ui/PasswordInput';
import TurnstileWidget from '@/components/payment/TurnstileWidget';

export const DASHBOARD_DIAGNOSTICS = '/dashboard/diagnostics';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
/** Must match EXPECTED_ACTION in avry-backend app/services/turnstile.py. */
const TURNSTILE_ACTION = 'signup';

const COPY = {
  en: {
    signupTitle: 'Start your free analysis',
    signinTitle: 'Sign in to continue',
    subtitle: 'Free account',
    subtitleStrong: 'AI readiness analysis included',
    signupTab: 'Create account',
    signinTab: 'Sign in',
    email: 'Email',
    company: 'Company',
    password: 'Password',
    confirm: 'Confirm password',
    submitSignup: 'Create free account',
    submitSignin: 'Sign in',
    wait: 'Please wait…',
    legal: 'By creating an account you agree to our',
    terms: 'Terms',
    and: 'and',
    privacy: 'Privacy Policy',
    forgot: 'Forgot password?',
    errCompany: 'Enter your company name',
    errEmail: 'Enter a valid email address',
    errPassword: 'Use at least 8 characters',
    errPasswordEmpty: 'Enter your password',
    errConfirm: 'The passwords do not match',
    errExists: 'This email already has an account. Sign in instead',
    errSignin: 'Email or password is incorrect',
    errGeneric: 'Something went wrong. Please try again',
    errVerify: 'Please complete the verification check',
    errVerifyFailed: 'Verification failed. Please try the check again',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    redirecting: 'Opening your dashboard…',
    panelTitle: 'Your free account',
    panelNote: 'No card needed',
    itemName: 'AI Readiness Analysis',
    itemKind: 'Free account',
    itemPrice: 'Free',
    itemDescription:
      'See where your operations are ready for AI, where the bottlenecks are, and what to automate first',
    features: ['Free AI readiness analysis', 'Full dashboard preview', 'Upgrade any time, no lock-in'],
    total: 'Total due today',
    totalValue: 'Free',
    after: 'Your analysis runs in the Aivory dashboard. Paid plans unlock the Deep Diagnostic, workflows, AI agents and integrations',
  },
  id: {
    signupTitle: 'Mulai analisis gratis',
    signinTitle: 'Masuk untuk melanjutkan',
    subtitle: 'Akun gratis',
    subtitleStrong: 'termasuk analisis kesiapan AI',
    signupTab: 'Buat akun',
    signinTab: 'Masuk',
    email: 'Email',
    company: 'Perusahaan',
    password: 'Kata sandi',
    confirm: 'Ulangi kata sandi',
    submitSignup: 'Buat akun gratis',
    submitSignin: 'Masuk',
    wait: 'Mohon tunggu…',
    legal: 'Dengan membuat akun, kamu setuju dengan',
    terms: 'Ketentuan',
    and: 'dan',
    privacy: 'Kebijakan Privasi',
    forgot: 'Lupa kata sandi?',
    errCompany: 'Isi nama perusahaan',
    errEmail: 'Masukkan alamat email yang valid',
    errPassword: 'Gunakan minimal 8 karakter',
    errPasswordEmpty: 'Masukkan kata sandi',
    errConfirm: 'Kata sandi tidak sama',
    errExists: 'Email ini sudah punya akun. Silakan masuk',
    errSignin: 'Email atau kata sandi salah',
    errGeneric: 'Terjadi kesalahan. Coba lagi',
    errVerify: 'Selesaikan pemeriksaan verifikasi dulu',
    errVerifyFailed: 'Verifikasi gagal. Coba pemeriksaannya lagi',
    showPassword: 'Tampilkan kata sandi',
    hidePassword: 'Sembunyikan kata sandi',
    redirecting: 'Membuka dashboard…',
    panelTitle: 'Akun gratis kamu',
    panelNote: 'Tanpa kartu',
    itemName: 'Analisis Kesiapan AI',
    itemKind: 'Akun gratis',
    itemPrice: 'Gratis',
    itemDescription:
      'Lihat bagian operasional mana yang siap untuk AI, di mana hambatannya, dan apa yang perlu diotomasi lebih dulu',
    features: ['Analisis kesiapan AI gratis', 'Pratinjau dashboard lengkap', 'Upgrade kapan saja, tanpa ikatan'],
    total: 'Total hari ini',
    totalValue: 'Gratis',
    after: 'Analisis berjalan di dashboard Aivory. Paket berbayar membuka Deep Diagnostic, workflow, AI agent, dan integrasi',
  },
} as const;

type Lang = keyof typeof COPY;
type Mode = 'signup' | 'signin';
type FieldKey = 'errCompany' | 'errEmail' | 'errPassword' | 'errPasswordEmpty' | 'errConfirm';
type FormKey = 'errExists' | 'errSignin' | 'errGeneric' | 'errVerify' | 'errVerifyFailed';
/** Copy keys (so the text follows a language switch); `form` may also carry a backend message. */
type Errors = Partial<Record<'company' | 'email' | 'password' | 'confirm', FieldKey>> & {
  form?: FormKey | { raw: string };
};

const inputClass =
  'w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[15px] text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#3a3aa8] focus:ring-1 focus:ring-[#3a3aa8] transition aria-[invalid=true]:border-red-400';
const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5';
const fieldError = 'mt-1.5 block text-xs text-red-600';

export default function FreeSignupClient() {
  const { language, setLanguage } = useLanguage();
  const lang: Lang = language === 'id' ? 'id' : 'en';
  const t = COPY[lang];

  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  // Turnstile (signup only). Tokens are single-use: any failed attempt bumps
  // resetSignal for a fresh challenge.
  const turnstileEnabled = TURNSTILE_SITE_KEY.length > 0;
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);

  // Signed in already: the analysis is in the dashboard.
  useEffect(() => {
    if (isAuthenticated()) {
      setRedirecting(true);
      window.location.replace(DASHBOARD_DIAGNOSTICS);
    }
  }, []);

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrors({});
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'errEmail';
    if (mode === 'signup') {
      if (company.trim().length < 2) next.company = 'errCompany';
      if (password.length < 8) next.password = 'errPassword';
      else if (confirm !== password) next.confirm = 'errConfirm';
    } else if (!password) {
      next.password = 'errPasswordEmpty';
    }
    if (!Object.keys(next).length && mode === 'signup' && turnstileEnabled && !turnstileToken) {
      next.form = 'errVerify';
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      if (mode === 'signup') {
        await signup(email.trim(), password, company.trim(), turnstileToken ?? undefined);
        trackEvent('free_signup_completed', { source: 'free-diagnostic' });
      } else {
        await login(email.trim(), password);
      }
      setRedirecting(true);
      window.location.assign(DASHBOARD_DIAGNOSTICS);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (mode === 'signup' && turnstileEnabled) {
        setTurnstileToken(null);
        setTurnstileReset((n) => n + 1);
      }
      if (mode === 'signup' && /human verification/i.test(msg)) {
        setErrors({ form: 'errVerifyFailed' });
      } else if (mode === 'signup' && /already registered|already exists/i.test(msg)) {
        // Keep the email and password: one click on "Sign in" finishes it.
        setMode('signin');
        setErrors({ form: 'errExists' });
      } else if (mode === 'signin') {
        setErrors({
          form: /invalid|incorrect|credentials|login failed/i.test(msg) ? 'errSignin' : msg ? { raw: msg } : 'errGeneric',
        });
      } else {
        setErrors({ form: msg && !/registration failed/i.test(msg) ? { raw: msg } : 'errGeneric' });
      }
      setBusy(false);
    }
  };

  const formError = errors.form ? (typeof errors.form === 'string' ? t[errors.form] : errors.form.raw) : null;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* ---- Form ---- */}
        <div className="lg:col-span-8 bg-white lg:border-r border-gray-200">
          <div className="relative isolate w-full bg-white min-h-screen p-6 sm:p-8 lg:p-12 text-[#1a1a1a] flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <a href="/" aria-label="Aivory home">
                <GradientWordmark palette={INDIGO_ORCHID_PEACH_HEADER} />
              </a>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                  className="block overflow-hidden rounded-md shadow-sm"
                >
                  <GrainGradient
                    palette={INDIGO_ORCHID_PEACH_HEADER}
                    contours={false}
                    blur={12}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white"
                  >
                    {lang === 'id' ? 'Bahasa Indonesia' : 'English'}
                    <svg className="w-4 h-4 text-white/85" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </GrainGradient>
                </button>
                {langOpen && (
                  <div role="listbox" className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
                    {(['en', 'id'] as const).map((lng) => (
                      <button
                        key={lng}
                        type="button"
                        role="option"
                        aria-selected={lang === lng}
                        onClick={() => {
                          setLanguage(lng);
                          setLangOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          lang === lng ? 'font-semibold text-[#3a3aa8]' : 'text-gray-700'
                        }`}
                      >
                        {lng === 'en' ? 'English' : 'Bahasa Indonesia'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center max-w-lg mx-auto w-full">
              {redirecting ? (
                <p className="text-gray-500" role="status">
                  {t.redirecting}
                </p>
              ) : (
                <div className="w-full">
                  <h1 className="text-2xl font-semibold mb-1 text-center">
                    {mode === 'signup' ? t.signupTitle : t.signinTitle}
                  </h1>
                  <p className="text-sm text-gray-500 mb-8 text-center">
                    {t.subtitle} · <span className="font-semibold text-[#1a1a1a]">{t.subtitleStrong}</span>
                  </p>

                  <div className="flex mb-6 border border-gray-200 rounded-full p-1 bg-gray-50" role="tablist">
                    {(['signup', 'signin'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        role="tab"
                        aria-selected={mode === m}
                        onClick={() => switchMode(m)}
                        className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
                          mode === m ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-gray-500'
                        }`}
                      >
                        {m === 'signup' ? t.signupTab : t.signinTab}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="free-email" className={labelClass}>
                        {t.email}
                      </label>
                      <input
                        id="free-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={!!errors.email}
                        className={inputClass}
                      />
                      {errors.email && <span className={fieldError}>{t[errors.email]}</span>}
                    </div>
                    {mode === 'signup' && (
                      <div>
                        <label htmlFor="free-company" className={labelClass}>
                          {t.company}
                        </label>
                        <input
                          id="free-company"
                          type="text"
                          autoComplete="organization"
                          placeholder="PT Maju Bersama"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          aria-invalid={!!errors.company}
                          className={inputClass}
                        />
                        {errors.company && <span className={fieldError}>{t[errors.company]}</span>}
                      </div>
                    )}
                    <div>
                      <label htmlFor="free-password" className={labelClass}>
                        {t.password}
                      </label>
                      <PasswordInput
                        id="free-password"
                        showLabel={t.showPassword}
                        hideLabel={t.hidePassword}
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-invalid={!!errors.password}
                        className={inputClass}
                      />
                      {errors.password && <span className={fieldError}>{t[errors.password]}</span>}
                    </div>
                    {mode === 'signup' && (
                      <div>
                        <label htmlFor="free-confirm" className={labelClass}>
                          {t.confirm}
                        </label>
                        <PasswordInput
                          id="free-confirm"
                          showLabel={t.showPassword}
                          hideLabel={t.hidePassword}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          aria-invalid={!!errors.confirm}
                          className={inputClass}
                        />
                        {errors.confirm && <span className={fieldError}>{t[errors.confirm]}</span>}
                      </div>
                    )}

                    {mode === 'signup' && turnstileEnabled && (
                      <div className="flex justify-center">
                        <TurnstileWidget
                          siteKey={TURNSTILE_SITE_KEY}
                          action={TURNSTILE_ACTION}
                          onToken={setTurnstileToken}
                          onExpire={() => setTurnstileToken(null)}
                          resetSignal={turnstileReset}
                        />
                      </div>
                    )}

                    {formError && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg" role="alert">
                        {formError}
                      </p>
                    )}

                    <div className="mt-2 w-full">
                      <SpotlightButton type="submit" disabled={busy} className="w-full" roundedClass="rounded-lg">
                        {busy ? t.wait : mode === 'signup' ? t.submitSignup : t.submitSignin}
                      </SpotlightButton>
                    </div>
                  </form>

                  {mode === 'signup' ? (
                    <p className="mt-4 text-center text-xs text-gray-400">
                      {t.legal}{' '}
                      <a href="/terms" className="underline underline-offset-2 hover:text-gray-600">
                        {t.terms}
                      </a>{' '}
                      {t.and}{' '}
                      <a href="/privacy" className="underline underline-offset-2 hover:text-gray-600">
                        {t.privacy}
                      </a>
                    </p>
                  ) : (
                    <p className="mt-4 text-center text-xs text-gray-400">
                      <a href="/forgot-password" className="underline underline-offset-2 hover:text-gray-600">
                        {t.forgot}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---- Summary ---- */}
        <div className="lg:col-span-4 bg-[#2a2a86]">
          <GrainGradient palette={INDIGO_ORCHID_PEACH} className="w-full h-full lg:min-h-screen p-8 lg:p-12 text-white">
            <h2 className="text-2xl font-semibold mb-2">{t.panelTitle}</h2>
            <p className="text-sm font-semibold text-white/80 mb-8">{t.panelNote}</p>

            <div className="flex justify-between items-start mb-2 pt-8 border-t border-white/15">
              <div className="pr-4">
                <span className="font-medium block">{t.itemName}</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-white/75">{t.itemKind}</span>
              </div>
              <span className="font-semibold whitespace-nowrap">{t.itemPrice}</span>
            </div>

            <p className="text-sm text-white/70 leading-relaxed mb-4">{t.itemDescription}</p>
            <ul className="space-y-1.5 mb-8">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/85">
                  <svg className="w-4 h-4 mt-0.5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center pt-6 border-t border-white/20">
              <span className="font-semibold text-white/90">{t.total}</span>
              <span className="text-xl font-bold whitespace-nowrap">{t.totalValue}</span>
            </div>
            <p className="mt-3 text-xs text-white/85 leading-relaxed">{t.after}</p>
          </GrainGradient>
        </div>
      </div>
    </div>
  );
}
