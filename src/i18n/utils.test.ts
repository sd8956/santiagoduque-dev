import { describe, it, expect } from 'vitest';
import { getLangFromUrl, switchLangPath, localizedPath, useTranslations } from './utils';

describe('getLangFromUrl', () => {
  it('reads the locale from the first segment', () => {
    expect(getLangFromUrl(new URL('https://santiagoduque.dev/es/blog/'))).toBe('es');
    expect(getLangFromUrl(new URL('https://santiagoduque.dev/en/about/'))).toBe('en');
  });

  it('falls back to the default locale on the root path', () => {
    expect(getLangFromUrl(new URL('https://santiagoduque.dev/'))).toBe('es');
  });

  it('falls back to the default locale on an unknown prefix', () => {
    expect(getLangFromUrl(new URL('https://santiagoduque.dev/fr/blog/'))).toBe('es');
  });
});

describe('switchLangPath', () => {
  it('swaps the locale prefix preserving the rest of the path', () => {
    expect(switchLangPath('/es/blog/hola-mundo/', 'en')).toBe('/en/blog/hola-mundo/');
    expect(switchLangPath('/en/about/', 'es')).toBe('/es/about/');
  });

  it('returns the locale root when the input has no recognisable prefix', () => {
    expect(switchLangPath('/', 'en')).toBe('/en/');
    expect(switchLangPath('/fr/blog/', 'es')).toBe('/es/');
  });

  it('always emits a trailing slash to match astro.config trailingSlash=always', () => {
    expect(switchLangPath('/es/about/', 'en').endsWith('/')).toBe(true);
    expect(switchLangPath('/', 'en').endsWith('/')).toBe(true);
  });
});

describe('localizedPath', () => {
  it('builds the language-prefixed URL for a child path', () => {
    expect(localizedPath('es', '/blog/')).toBe('/es/blog/');
    expect(localizedPath('en', 'about')).toBe('/en/about/');
  });

  it('returns the language root for empty or root input', () => {
    expect(localizedPath('es', '')).toBe('/es/');
    expect(localizedPath('en', '/')).toBe('/en/');
  });

  it('strips redundant slashes from the input', () => {
    expect(localizedPath('es', '///blog///')).toBe('/es/blog/');
  });
});

describe('useTranslations', () => {
  it('returns the bilingual nav block for each locale', () => {
    expect(useTranslations('es').nav.home).toBe('Inicio');
    expect(useTranslations('en').nav.home).toBe('Home');
  });

  it('exposes the pagination keys added in the pagination PR', () => {
    expect(useTranslations('es').blog.pageXofY).toContain('{x}');
    expect(useTranslations('en').blog.pageXofY).toContain('{y}');
  });
});
