import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/i18n/**', 'scripts/lib/**'],
      exclude: ['src/i18n/translations.ts'],
    },
  },
});
