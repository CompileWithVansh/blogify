'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useTransition, useState } from 'react';

export default function SearchBar({ defaultValue = '' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e) {
    e.preventDefault();
    const q = value.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set('search', q);
    else params.delete('search');
    params.delete('page');
    startTransition(() => router.push(`/blog?${params.toString()}`));
  }

  function handleClear() {
    setValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('page');
    startTransition(() => router.push(`/blog?${params.toString()}`));
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 relative" data-testid="search-form">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
      <input
        name="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search posts..."
        className="input pl-10 pr-10"
        data-testid="search-input"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X size={15} />
        </button>
      )}
    </form>
  );
}
