'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Pagination({ currentPage, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(page) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page);
    router.push(`/blog?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Show max 5 page buttons
  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12" data-testid="pagination">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="btn-secondary px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => goTo(1)} className="btn-secondary w-10 h-10 p-0 justify-center">1</button>
          {pages[0] > 2 && <span className="text-stone-400 px-1">…</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goTo(page)}
          className={cn(
            'w-10 h-10 p-0 justify-center rounded-xl text-sm font-semibold transition-all',
            page === currentPage
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'btn-secondary'
          )}
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="text-stone-400 px-1">…</span>}
          <button onClick={() => goTo(totalPages)} className="btn-secondary w-10 h-10 p-0 justify-center">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="btn-secondary px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
