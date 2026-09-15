import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { handleCanaryTrap, isWhitelistedCaller } from './canaryTrap';

function req(path: string, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(`http://landing.test${path}`, { headers });
}

describe('isWhitelistedCaller', () => {
  it('lets private-network callers through (localhost, docker net)', () => {
    expect(isWhitelistedCaller(req('/api/internal/trap', { 'x-forwarded-for': '127.0.0.1' }))).toBe(true);
    expect(isWhitelistedCaller(req('/api/internal/trap', { 'x-forwarded-for': '172.18.0.4' }))).toBe(true);
    expect(isWhitelistedCaller(req('/api/internal/trap', { 'x-forwarded-for': '10.0.3.9' }))).toBe(true);
  });

  it('lets own agents through via UA allowlist', () => {
    expect(
      isWhitelistedCaller(req('/api/internal/trap', { 'user-agent': 'Aivory-Cerveau/1.0' })),
    ).toBe(true);
  });

  it('treats public strangers as attackers', () => {
    expect(
      isWhitelistedCaller(
        req('/api/internal/trap', {
          'x-forwarded-for': '203.0.113.7',
          'user-agent': 'python-requests/2.31',
        }),
      ),
    ).toBe(false);
  });
});

describe('handleCanaryTrap', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns plain 404 with no log line for whitelisted callers', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const res = await handleCanaryTrap(
      req('/api/internal/trap', { 'x-forwarded-for': '127.0.0.1' }),
    );
    expect(res.status).toBe(404);
    expect(warn).not.toHaveBeenCalled();
  });

  it('still traps public strangers with poison + log line', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const res = await handleCanaryTrap(
      req('/api/internal/trap', {
        'x-forwarded-for': '203.0.113.7',
        'user-agent': 'evil-scraper',
      }),
    );
    expect(res.status).toBe(200);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[CANARY-TRAP]'));
    const body = await res.json();
    expect(JSON.stringify(body)).toContain('honeypot');
  });
});
