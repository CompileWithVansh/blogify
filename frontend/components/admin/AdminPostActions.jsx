'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { adminDeletePost, adminToggleFeatured } from '@/actions/admin.actions';
import { Trash2, Star, Loader2 } from 'lucide-react';

export default function AdminPostActions({ postId, featured }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm('Delete this post permanently? This cannot be undone.')) return;
    const fd = new FormData();
    fd.set('id', postId);
    startTransition(async () => {
      const res = await adminDeletePost(fd);
      if (res?.error) toast.error(res.error);
      else { toast.success('Post deleted'); router.refresh(); }
    });
  }

  function handleToggleFeatured() {
    const fd = new FormData();
    fd.set('id', postId);
    fd.set('featured', String(featured));
    startTransition(async () => {
      const res = await adminToggleFeatured(fd);
      if (res?.error) toast.error(res.error);
      else { toast.success(featured ? 'Removed from featured' : 'Marked as featured'); router.refresh(); }
    });
  }

  return (
    <>
      <button
        onClick={handleToggleFeatured}
        disabled={isPending}
        className={`p-1.5 rounded-lg transition-all disabled:opacity-50 ${
          featured
            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
            : 'text-stone-400 hover:text-amber-500 hover:bg-amber-50'
        }`}
        title={featured ? 'Unfeature' : 'Feature'}
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : <Star size={14} />}
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
        title="Delete post"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      </button>
    </>
  );
}
