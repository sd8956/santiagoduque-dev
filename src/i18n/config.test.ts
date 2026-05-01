import { describe, it, expect } from 'vitest';
import { isLocale, LOCALES, DEFAULT_LOCALE } from './config';

describe('isLocale', () => {
  it('accepts every value listed in LOCALES', () => {
    for (const locale of LOCALES) {
      expect(isLocale(locale)).toBe(true);
    }
  });

  it('rejects unknown languages', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('pt')).toBe(false);
    expect(isLocale('')).toBe(false);
  });

  it('rejects undefined', () => {
    expect(isLocale(undefined)).toBe(false);
  });
});

describe('config invariants', () => {
  it('default locale is one of the supported locales', () => {
    expect(LOCALES).toContain(DEFAULT_LOCALE);
  });
});
