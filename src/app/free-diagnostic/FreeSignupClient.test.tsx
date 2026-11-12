// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const { signupMock, authedMock } = vi.hoisted(() => ({ signupMock: vi.fn(), authedMock: vi.fn(() => false) }));
vi.mock('@/lib/auth', () => ({ signup: signupMock, isAuthenticated: authedMock }));
vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('@/components/context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en', setLanguage: vi.fn() }),
}));

import FreeSignupClient from './FreeSignupClient';

const assign = vi.fn();
const replace = vi.fn();

beforeEach(() => {
  signupMock.mockReset();
  authedMock.mockReturnValue(false);
  assign.mockReset();
  replace.mockReset();
  Object.defineProperty(window, 'location', { value: { ...window.location, assign, replace }, writable: true });
});

function fill(company = 'PT Maju', email = 'a@b.co', password = 'secret123') {
  fireEvent.change(screen.getByLabelText('Company name'), { target: { value: company } });
  fireEvent.change(screen.getByLabelText('Work email'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: /Create free account/ }));
}

describe('free analysis signup', () => {
  it('creates the account and opens dashboard diagnostics', async () => {
    signupMock.mockResolvedValue({});
    render(<FreeSignupClient />);
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
    fill('', 'nope', 'short');
    expect(signupMock).not.toHaveBeenCalled();
    expect(screen.getByText('Use at least 8 characters')).toBeTruthy();
  });

  it('offers log in (back to diagnostics) when the email already has an account', async () => {
    signupMock.mockRejectedValue(new Error('Email already registered'));
    render(<FreeSignupClient />);
    fill();
    const link = await screen.findByRole('link', { name: /Log in →/ });
    expect(link.getAttribute('href')).toBe('/login?next=%2Fdashboard%2Fdiagnostics');
    expect(assign).not.toHaveBeenCalled();
  });
});
