/**
 * Vitest setup — referenced by `vitest.config.ts` as `setupFiles`.
 *
 * The config had pointed at this path for some time while the file itself was
 * absent and untracked, so every one of the 43 test files failed at collection
 * with "Failed to load url .../src/test/setup.ts" and the suite reported no
 * tests at all. It registers jest-dom's matchers and unmounts React trees
 * between tests so component state cannot leak across cases.
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
