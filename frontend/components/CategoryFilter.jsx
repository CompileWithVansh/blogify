'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/utils';
import { Filter } from 'lucide-react';

export default function CategoryFilter({ active = 'all' }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', e.target.value);
    params.delete('page');
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <div className="relative">
      <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
      <select
        value={active}
        onChange={handleChange}
        className="input pl-9 pr-8 appearance-none cursor-pointer min-w-[160px]"
        data-testid="category-filter"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.emoji ? `${c.emoji} ${c.label}` : c.label}
          </option>
        ))}
      </select>
    </div>
  );
}
