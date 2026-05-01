import { describe, it, expect } from 'vitest';
import { readingTimeMinutes } from './readingTime';

describe('readingTimeMinutes', () => {
  it('returns at least 1 minute for empty content', () => {
    expect(readingTimeMinutes('')).toBe(1);
  });

  it('returns at least 1 minute for short content', () => {
    expect(readingTimeMinutes('Hola mundo')).toBe(1);
  });

  it('rounds to nearest minute at the 220 wpm rate', () => {
    const words = Array(440).fill('palabra').join(' ');
    expect(readingTimeMinutes(words)).toBe(2);
  });

  it('handles whitespace-heavy content without inflating the count', () => {
    const words = Array(220).fill('word').join('\n\n  \t\t  ');
    expect(readingTimeMinutes(words)).toBe(1);
  });

  it('rounds 330 words (1.5 min) up to 2', () => {
    const words = Array(330).fill('w').join(' ');
    expect(readingTimeMinutes(words)).toBe(2);
  });
});
