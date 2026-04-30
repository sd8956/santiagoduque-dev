/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        surface: 'rgb(var(--bg-primary) / <alpha-value>)',
        elevated: 'rgb(var(--bg-secondary) / <alpha-value>)',
        fg: 'rgb(var(--text-primary) / <alpha-value>)',
        muted: 'rgb(var(--text-secondary) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        line: 'rgb(var(--border) / <alpha-value>)',
        code: 'rgb(var(--code-bg) / <alpha-value>)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
