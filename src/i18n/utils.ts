import { DEFAULT_LOCALE, isLocale, type Locale } from './config';
import { translations, type UIStrings } from './translations';

export function getLangFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

export function useTranslations(lang: Locale): UIStrings {
  return translations[lang];
}

export function switchLangPath(currentPath: string, targetLang: Locale): string {
  const segments = currentPath.split('/').filter(Boolean);
  if (segments.length === 0 || !isLocale(segments[0])) {
    return `/${targetLang}/`;
  }
  segments[0] = targetLang;
  return `/${segments.join('/')}/`;
}

export function localizedPath(lang: Locale, path: string): string {
  const cleaned = path.replace(/^\/+|\/+$/g, '');
  return cleaned === '' ? `/${lang}/` : `/${lang}/${cleaned}/`;
}
