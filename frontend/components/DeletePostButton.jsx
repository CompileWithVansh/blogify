'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deletePostAction } from '@/actions/post.actions';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeletePostButton({ postId, iconOnly = false }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    const formData = new FormData();
    formData.set('id', postId);

    startTransition(async () => {
      try {
        await deletePostAction(formData);
        toast.success('Post deleted');
        router.push('/dashboard');
        router.refresh();
      } catch (err) {
        toast.error(err.message || 'Failed to delete post');
      }
    });
  }

  if (iconOnly) {
    return (
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
        title="Delete post"
        data-testid={`delete-btn-${postId}`}
      >
        {isPending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="btn-danger text-sm disabled:opacity-50"
      data-testid="delete-post-btn"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      Delete
    </button>
  );
}
