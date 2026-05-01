import { describe, it, expect } from 'vitest';
import { formatDate } from './dates';

describe('formatDate', () => {
  const sample = new Date('2026-04-29T12:00:00Z');

  it('renders Spanish dates with es-AR conventions', () => {
    const result = formatDate(sample, 'es');
    expect(result).toMatch(/abril/);
    expect(result).toMatch(/2026/);
  });

  it('renders English dates with en-US conventions', () => {
    const result = formatDate(sample, 'en');
    expect(result).toMatch(/April/);
    expect(result).toMatch(/2026/);
  });

  it('produces locale-distinct output', () => {
    expect(formatDate(sample, 'es')).not.toBe(formatDate(sample, 'en'));
  });
});
