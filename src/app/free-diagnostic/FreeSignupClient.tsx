'use client';

/**
 * Free AI Readiness Analysis entry point.
 *
 * Since 2026-11-12 the free analysis runs inside the user dashboard (a free
 * account gets 2 diagnostics there, avry-backend FREE_GRANTS). Every
 * "free analysis" CTA on the site points at /free-diagnostic, so this page
 * creates the free account and hands the visitor to /dashboard/diagnostics.
 * Already signed in → straight to the dashboard.
 *
 * The old public 12-question assessment that used to live here is gone.
 */

import { useEffect, useState, type FormEvent } from 'react';
import { isAuthenticated, signup } from '@/lib/auth';
import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/components/context/LanguageContext';
import styles from './FreeSignup.module.css';

export const DASHBOARD_DIAGNOSTICS = '/dashboard/diagnostics';
const LOGIN_HREF = `/login?next=${encodeURIComponent(DASHBOARD_DIAGNOSTICS)}`;

const COPY = {
  en: {
    title: 'Start your free AI readiness analysis',
    subtitle: 'Create a free account and run 2 analyses in your Aivory dashboard. No card needed',
    company: 'Company name',
    companyPlaceholder: 'e.g. PT Maju Bersama',
    email: 'Work email',
    emailPlaceholder: 'name@company.com',
    password: 'Password',
    passwordPlaceholder: 'At least 8 characters',
    submit: 'Create free account',
    submitting: 'Creating your account…',
    haveAccount: 'Already have an account?',
    login: 'Log in',
    legal: 'By creating an account you agree to our',
    terms: 'Terms',
    and: 'and',
    privacy: 'Privacy Policy',
    errCompany: 'Enter your company name',
    errEmail: 'Enter a valid email address',
    errPassword: 'Use at least 8 characters',
    errExists: 'This email already has an account. Log in to continue',
    errGeneric: 'We could not create your account. Please try again',
    redirecting: 'Opening your dashboard…',
    language: 'Language',
    close: 'Close',
  },
  id: {
    title: 'Mulai analisis kesiapan AI gratis',
    subtitle: 'Buat akun gratis dan jalankan 2 analisis di dashboard Aivory. Tanpa kartu',
    company: 'Nama perusahaan',
    companyPlaceholder: 'cth. PT Maju Bersama',
    email: 'Email kerja',
    emailPlaceholder: 'nama@perusahaan.com',
    password: 'Kata sandi',
    passwordPlaceholder: 'Minimal 8 karakter',
    submit: 'Buat akun gratis',
    submitting: 'Membuat akun…',
    haveAccount: 'Sudah punya akun?',
    login: 'Masuk',
    legal: 'Dengan membuat akun, kamu setuju dengan',
    terms: 'Ketentuan',
    and: 'dan',
    privacy: 'Kebijakan Privasi',
    errCompany: 'Isi nama perusahaan',
    errEmail: 'Masukkan alamat email yang valid',
    errPassword: 'Gunakan minimal 8 karakter',
    errExists: 'Email ini sudah punya akun. Masuk untuk melanjutkan',
    errGeneric: 'Akun belum bisa dibuat. Coba lagi',
    redirecting: 'Membuka dashboard…',
    language: 'Bahasa',
    close: 'Tutup',
  },
} as const;

type MessageKey = 'errCompany' | 'errEmail' | 'errPassword' | 'errExists' | 'errGeneric';
/** Copy keys (so the text follows a language switch); `form` may also carry a backend message. */
type Errors = Partial<Record<'company' | 'email' | 'password', MessageKey>> & { form?: MessageKey | { raw: string } };

export default function FreeSignupClient() {
  const { language, setLanguage } = useLanguage();
  const t = COPY[language] ?? COPY.en;

  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [exists, setExists] = useState(false);
  const [busy, setBusy] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Signed in already: the analysis is in the dashboard.
  useEffect(() => {
    if (isAuthenticated()) {
      setRedirecting(true);
      window.location.replace(DASHBOARD_DIAGNOSTICS);
    }
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (company.trim().length < 2) next.company = 'errCompany';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'errEmail';
    if (password.length < 8) next.password = 'errPassword';
    setErrors(next);
    setExists(false);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await signup(email.trim(), password, company.trim());
      trackEvent('free_signup_completed', { source: 'free-diagnostic' });
      setRedirecting(true);
      window.location.assign(DASHBOARD_DIAGNOSTICS);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (/already registered|already exists/i.test(msg)) {
        setExists(true);
        setErrors({ form: 'errExists' });
      } else {
        setErrors({ form: msg && !/registration failed/i.test(msg) ? { raw: msg } : 'errGeneric' });
      }
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <a href="/" className={styles.close} aria-label={t.close} title={t.close}>
        ✕
      </a>
      <div className={styles.lang}>
        <label htmlFor="signup-lang" className={styles.srOnly}>
          {t.language}
        </label>
        <select id="signup-lang" value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'id')}>
          <option value="en">English</option>
          <option value="id">Bahasa Indonesia</option>
        </select>
      </div>

      <main className={styles.shell}>
        <header className={styles.header}>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </header>

        {redirecting ? (
          <p className={styles.redirecting} role="status">
            {t.redirecting}
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="signup-company">{t.company}</label>
              <input
                id="signup-company"
                type="text"
                autoComplete="organization"
                placeholder={t.companyPlaceholder}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                aria-invalid={!!errors.company}
              />
              {errors.company && <span className={styles.error}>{t[errors.company]}</span>}
            </div>
            <div className={styles.field}>
              <label htmlFor="signup-email">{t.email}</label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className={styles.error}>{t[errors.email]}</span>}
            </div>
            <div className={styles.field}>
              <label htmlFor="signup-password">{t.password}</label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
              />
              {errors.password && <span className={styles.error}>{t[errors.password]}</span>}
            </div>

            {errors.form && (
              <p className={styles.formError} role="alert">
                {typeof errors.form === 'string' ? t[errors.form] : errors.form.raw}
                {exists && (
                  <>
                    {' '}
                    <a href={LOGIN_HREF}>{t.login} →</a>
                  </>
                )}
              </p>
            )}

            <button type="submit" className={styles.submit} disabled={busy}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 7l10 10M17 7v10H7" />
              </svg>
              {busy ? t.submitting : t.submit}
            </button>

            <p className={styles.switch}>
              {t.haveAccount} <a href={LOGIN_HREF}>{t.login}</a>
            </p>
            <p className={styles.legal}>
              {t.legal} <a href="/terms">{t.terms}</a> {t.and} <a href="/privacy">{t.privacy}</a>
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
