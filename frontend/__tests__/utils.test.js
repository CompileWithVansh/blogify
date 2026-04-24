import { formatDate, truncate, cn } from '@/lib/utils';
import { estimateReadTime } from '@/lib/strapi';

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    const result = formatDate('2024-01-15T00:00:00.000Z');
    expect(result).toContain('2024');
    expect(result).toContain('January');
  });
});

describe('truncate', () => {
  it('returns the string unchanged if shorter than limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and appends ellipsis if longer than limit', () => {
    const result = truncate('hello world', 5);
    expect(result).toBe('hello...');
  });

  it('returns empty string for null/undefined', () => {
    expect(truncate(null)).toBe('');
    expect(truncate(undefined)).toBe('');
  });
});

describe('cn (classnames)', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });
});

describe('estimateReadTime', () => {
  it('returns at least 1 minute', () => {
    expect(estimateReadTime('')).toBe(1);
    expect(estimateReadTime('short')).toBe(1);
  });

  it('estimates correctly for longer content', () => {
    const words = Array(400).fill('word').join(' ');
    expect(estimateReadTime(words)).toBe(2);
  });
});
