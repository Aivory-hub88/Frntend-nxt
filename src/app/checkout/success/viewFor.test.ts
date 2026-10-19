import { describe, expect, it } from 'vitest';
import { viewFor, viewFromHint } from './CheckoutSuccessClient';

const base = { ok: true, granted: false, status: null, productName: null, amountIdr: null, promoCode: null };

describe('checkout success view', () => {
  it('trusts the confirmed order over the query string', () => {
    expect(viewFor({ ...base, granted: true, status: 'paid' })).toBe('paid');
    expect(viewFor({ ...base, status: 'pending' })).toBe('pending');
    expect(viewFor({ ...base, status: 'failed' })).toBe('failed');
    expect(viewFor({ ...base, status: 'paid_grant_failed' })).toBe('activating');
    expect(viewFor({ ...base, status: 'something_else' })).toBe('unknown');
  });

  it('falls back to Midtrans’ hint when there is no session', () => {
    expect(viewFromHint('settlement')).toBe('paid');
    expect(viewFromHint('capture')).toBe('paid');
    expect(viewFromHint('pending')).toBe('pending');
    expect(viewFromHint('expire')).toBe('failed');
    expect(viewFromHint(null)).toBe('unknown');
  });
});
