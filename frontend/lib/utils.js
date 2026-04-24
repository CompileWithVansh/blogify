import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncate(str, length = 150) {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export const CATEGORIES = [
  { value: 'all',           label: 'All',           emoji: '🌐' },
  { value: 'technology',    label: 'Technology',    emoji: '💻' },
  { value: 'lifestyle',     label: 'Lifestyle',     emoji: '🌿' },
  { value: 'travel',        label: 'Travel',        emoji: '✈️' },
  { value: 'food',          label: 'Food',          emoji: '🍜' },
  { value: 'health',        label: 'Health',        emoji: '💪' },
  { value: 'business',      label: 'Business',      emoji: '📈' },
  { value: 'education',     label: 'Education',     emoji: '🎓' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'other',         label: 'Other',         emoji: '✍️' },
];
