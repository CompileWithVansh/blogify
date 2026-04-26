'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function AdminSearchInput({ placeholder = 'Search…', paramName = 'search' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramName) || '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(paramName, value);
      } else {
        params.delete(paramName);
      }
      params.delete('page'); // reset to page 1 on new search
      router.push(`${pathname}?${params.toString()}`);
    }, 350);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="relative w-full max-w-sm">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
      />
    </div>
  );
}
