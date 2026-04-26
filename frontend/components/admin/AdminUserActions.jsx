'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { adminToggleUserAdmin, adminToggleBlockUser, adminDeleteUser } from '@/actions/admin.actions';
import { Shield, ShieldOff, Ban, CheckCircle, Loader2, Trash2 } from 'lucide-react';

export default function AdminUserActions({ userId, isAdmin, blocked, isSuperAdmin = false }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleToggleAdmin() {
    const fd = new FormData();
    fd.set('id', userId);
    fd.set('isAdmin', String(isAdmin));
    startTransition(async () => {
      const res = await adminToggleUserAdmin(fd);
      if (res?.error) toast.error(res.error);
      else { toast.success(isAdmin ? 'Admin role removed' : 'Admin role granted'); router.refresh(); }
    });
  }

  function handleToggleBlock() {
    const fd = new FormData();
    fd.set('id', userId);
    fd.set('blocked', String(blocked));
    startTransition(async () => {
      const res = await adminToggleBlockUser(fd);
      if (res?.error) toast.error(res.error);
      else { toast.success(blocked ? 'User unblocked' : 'User blocked'); router.refresh(); }
    });
  }

  function handleDelete() {
    if (!confirm('Delete this user permanently? Their posts will remain but become authorless. This cannot be undone.')) return;
    const fd = new FormData();
    fd.set('id', userId);
    startTransition(async () => {
      const res = await adminDeleteUser(fd);
      if (res?.error) toast.error(res.error);
      else { toast.success('User deleted'); router.refresh(); }
    });
  }

  // Super admin row — no actions allowed
  if (isSuperAdmin) {
    return (
      <div className="flex items-center justify-end">
        <span className="text-xs text-stone-300 italic">protected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={handleToggleAdmin}
        disabled={isPending}
        className={`p-1.5 rounded-lg transition-all disabled:opacity-50 text-xs flex items-center gap-1 ${
          isAdmin
            ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
            : 'text-stone-400 hover:text-indigo-600 hover:bg-indigo-50'
        }`}
        title={isAdmin ? 'Remove admin' : 'Make admin'}
      >
        {isPending ? <Loader2 size={13} className="animate-spin" /> : isAdmin ? <ShieldOff size={13} /> : <Shield size={13} />}
      </button>
      <button
        onClick={handleToggleBlock}
        disabled={isPending}
        className={`p-1.5 rounded-lg transition-all disabled:opacity-50 ${
          blocked
            ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
            : 'text-stone-400 hover:text-orange-500 hover:bg-orange-50'
        }`}
        title={blocked ? 'Unblock user' : 'Block user'}
      >
        {isPending ? <Loader2 size={13} className="animate-spin" /> : blocked ? <CheckCircle size={13} /> : <Ban size={13} />}
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
        title="Delete user"
      >
        {isPending ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
      </button>
    </div>
  );
}
