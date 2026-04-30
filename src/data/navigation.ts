import type { UIStrings } from '../i18n/translations';

export type NavLabelKey = keyof UIStrings['nav'];

export type NavItem = {
  /** Path WITHOUT language prefix; e.g. '/' or '/blog/'. */
  href: string;
  labelKey: NavLabelKey;
};

export const navigation: NavItem[] = [
  { href: '/', labelKey: 'home' },
  { href: '/blog/', labelKey: 'blog' },
  { href: '/projects/', labelKey: 'projects' },
  { href: '/about/', labelKey: 'about' },
];
