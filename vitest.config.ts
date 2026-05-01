import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/i18n/**'],
      exclude: ['src/i18n/translations.ts'],
    },
  },
});
