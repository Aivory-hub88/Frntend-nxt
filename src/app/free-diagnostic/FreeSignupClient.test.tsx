// @vitest-environment jsdom
import type React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const { signupMock, loginMock, authedMock } = vi.hoisted(() => ({
  signupMock: vi.fn(),
  loginMock: vi.fn(),
  authedMock: vi.fn(() => false),
}));
vi.mock('@/lib/auth', () => ({ signup: signupMock, login: loginMock, isAuthenticated: authedMock }));
vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));
// The grain canvas needs a real 2D context; jsdom has none.
vi.mock('@/components/ui/GrainGradient', () => ({
  GrainGradient: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  INDIGO_ORCHID_PEACH: {},
  INDIGO_ORCHID_PEACH_HEADER: {},
}));
vi.mock('@/components/ui/GradientWordmark', () => ({ GradientWordmark: () => <span>Aivory</span> }));
vi.mock('@/components/context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en', setLanguage: vi.fn() }),
}));

import FreeSignupClient from './FreeSignupClient';

const assign = vi.fn();
const replace = vi.fn();

beforeEach(() => {
  signupMock.mockReset();
  loginMock.mockReset();
  authedMock.mockReturnValue(false);
  assign.mockReset();
  replace.mockReset();
  Object.defineProperty(window, 'location', { value: { ...window.location, assign, replace }, writable: true });
});

const submit = () => fireEvent.submit(screen.getByLabelText('Email').closest('form')!);

type Fill = { company?: string; email?: string; password?: string; confirm?: string };
function fill({ company = 'PT Maju', email = 'a@b.co', password = 'secret123', confirm }: Fill = {}) {
  confirm ??= password;
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Company'), { target: { value: company } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: confirm } });
  submit();
}

describe('free analysis signup', () => {
  it('creates the account and opens dashboard diagnostics', async () => {
    signupMock.mockResolvedValue({});
    render(<FreeSignupClient />);
    expect(screen.getByRole('button', { name: /Create free account/ })).toBeTruthy();
    fill();
    await waitFor(() => expect(assign).toHaveBeenCalledWith('/dashboard/diagnostics'));
    expect(signupMock).toHaveBeenCalledWith('a@b.co', 'secret123', 'PT Maju');
  });

  it('sends a signed-in visitor straight to the dashboard', () => {
    authedMock.mockReturnValue(true);
    render(<FreeSignupClient />);
    expect(replace).toHaveBeenCalledWith('/dashboard/diagnostics');
  });

  it('validates before calling the backend', () => {
    render(<FreeSignupClient />);
    fill({ company: '', email: 'nope', password: 'short' });
    expect(signupMock).not.toHaveBeenCalled();
    expect(screen.getByText('Use at least 8 characters')).toBeTruthy();
    expect(screen.getByText('Enter your company name')).toBeTruthy();
  });

  it('rejects a confirmation that does not match', () => {
    render(<FreeSignupClient />);
    fill({ confirm: 'secret124' });
    expect(signupMock).not.toHaveBeenCalled();
    expect(screen.getByText('The passwords do not match')).toBeTruthy();
  });

  it('switches to sign in when the email already has an account', async () => {
    signupMock.mockRejectedValue(new Error('Email already registered'));
    render(<FreeSignupClient />);
    fill();
    await screen.findByText('This email already has an account. Sign in instead');
    expect(screen.queryByLabelText('Company')).toBeNull();
    expect(screen.getByRole('tab', { name: 'Sign in' }).getAttribute('aria-selected')).toBe('true');
    expect(assign).not.toHaveBeenCalled();
  });

  it('signs in an existing account and opens dashboard diagnostics', async () => {
    loginMock.mockResolvedValue({});
    render(<FreeSignupClient />);
    fireEvent.click(screen.getByRole('tab', { name: 'Sign in' }));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.co' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } });
    submit();
    await waitFor(() => expect(assign).toHaveBeenCalledWith('/dashboard/diagnostics'));
    expect(loginMock).toHaveBeenCalledWith('a@b.co', 'secret123');
    expect(signupMock).not.toHaveBeenCalled();
  });

  it('shows a clear message for a wrong password', async () => {
    loginMock.mockRejectedValue(new Error('Invalid email or password'));
    render(<FreeSignupClient />);
    fireEvent.click(screen.getByRole('tab', { name: 'Sign in' }));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.co' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
    submit();
    expect(await screen.findByText('Email or password is incorrect')).toBeTruthy();
    expect(assign).not.toHaveBeenCalled();
  });
});
