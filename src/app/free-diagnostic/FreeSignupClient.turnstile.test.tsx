// @vitest-environment jsdom
import type React from 'react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const { signupMock, resetSeen } = vi.hoisted(() => ({ signupMock: vi.fn(), resetSeen: vi.fn() }));
vi.mock('@/lib/auth', () => ({ signup: signupMock, login: vi.fn(), isAuthenticated: () => false }));
vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('@/components/ui/GrainGradient', () => ({
  GrainGradient: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  INDIGO_ORCHID_PEACH: {},
  INDIGO_ORCHID_PEACH_HEADER: {},
}));
vi.mock('@/components/ui/GradientWordmark', () => ({ GradientWordmark: () => <span>Aivory</span> }));
vi.mock('@/components/context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en', setLanguage: vi.fn() }),
}));
// Stand-in widget: a button that "solves" the challenge.
vi.mock('@/components/payment/TurnstileWidget', () => ({
  default: ({ action, onToken, resetSignal }: { action: string; onToken: (t: string) => void; resetSignal: number }) => {
    resetSeen(resetSignal);
    return (
      <button type="button" onClick={() => onToken('tok-1')}>
        solve {action}
      </button>
    );
  },
}));

let FreeSignupClient: React.ComponentType;
beforeAll(async () => {
  vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'site-key');
  FreeSignupClient = (await import('./FreeSignupClient')).default;
});

const assign = vi.fn();
beforeEach(() => {
  signupMock.mockReset();
  resetSeen.mockReset();
  assign.mockReset();
  Object.defineProperty(window, 'location', { value: { ...window.location, assign, replace: vi.fn() }, writable: true });
});

function fill() {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.co' } });
  fireEvent.change(screen.getByLabelText('Company'), { target: { value: 'PT Maju' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } });
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'secret123' } });
}
const submit = () => fireEvent.submit(screen.getByLabelText('Email').closest('form')!);

describe('free signup with Turnstile', () => {
  it('renders the signup widget and blocks submit until it is solved', () => {
    render(<FreeSignupClient />);
    expect(screen.getByRole('button', { name: 'solve signup' })).toBeTruthy();
    fill();
    submit();
    expect(signupMock).not.toHaveBeenCalled();
    expect(screen.getByText('Please complete the verification check')).toBeTruthy();
  });

  it('sends the token with the signup', async () => {
    signupMock.mockResolvedValue({});
    render(<FreeSignupClient />);
    fill();
    fireEvent.click(screen.getByRole('button', { name: 'solve signup' }));
    submit();
    await waitFor(() => expect(assign).toHaveBeenCalledWith('/dashboard/diagnostics'));
    expect(signupMock).toHaveBeenCalledWith('a@b.co', 'secret123', 'PT Maju', 'tok-1');
  });

  it('a rejected token shows a clear message and asks for a fresh challenge', async () => {
    signupMock.mockRejectedValue(new Error('Human verification failed. Please try again'));
    render(<FreeSignupClient />);
    fill();
    fireEvent.click(screen.getByRole('button', { name: 'solve signup' }));
    submit();
    expect(await screen.findByText('Verification failed. Please try the check again')).toBeTruthy();
    expect(resetSeen).toHaveBeenLastCalledWith(1);
    // The spent token is gone: the next submit needs a new solve.
    signupMock.mockClear();
    submit();
    expect(signupMock).not.toHaveBeenCalled();
  });

  it('sign in has no widget', () => {
    render(<FreeSignupClient />);
    fireEvent.click(screen.getByRole('tab', { name: 'Sign in' }));
    expect(screen.queryByRole('button', { name: 'solve signup' })).toBeNull();
  });
});
