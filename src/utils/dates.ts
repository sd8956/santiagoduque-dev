import type { Locale } from '../i18n/config';

const formatters: Record<Locale, Intl.DateTimeFormat> = {
  es: new Intl.DateTimeFormat('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }),
  en: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
};

export function formatDate(date: Date, lang: Locale): string {
  return formatters[lang].format(date);
}
