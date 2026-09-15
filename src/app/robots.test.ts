import { describe, it, expect } from 'vitest';
import robots from './robots';

function allDisallows(): string[] {
  const r = robots();
  const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
  return rules.flatMap((rule) => {
    if (!rule || typeof rule === 'string') return [];
    const d = rule.disallow;
    return Array.isArray(d) ? d : d ? [d] : [];
  });
}

describe('robots', () => {
  it('disallows the canary trap prefixes for every bot group', () => {
    const disallows = allDisallows();
    for (const p of ['/api/internal/', '/api/v2/config/', '/api/admin/settings/']) {
      expect(disallows).toContain(p);
    }
  });
});
