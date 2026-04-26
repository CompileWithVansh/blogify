import { adminGetAllUsers } from '@/actions/admin.actions';
import { formatDate } from '@/lib/utils';
import { Shield, User, Crown } from 'lucide-react';
import AdminUserActions from '@/components/admin/AdminUserActions';
import AdminSearchInput from '@/components/admin/AdminSearchInput';
import { SUPER_ADMIN_EMAIL } from '@/lib/checkUser';

export const metadata = { title: 'Manage Users | Admin' };

export default async function AdminUsersPage({ searchParams }) {
  const search = searchParams?.search || '';
  const users = await adminGetAllUsers({ pageSize: 50, search });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Users</h1>
        <p className="text-stone-500 mt-0.5 text-sm">
          {Array.isArray(users) ? users.length : 0} registered users
        </p>
      </div>

      <div className="mb-5">
        <AdminSearchInput placeholder="Search by email or name…" paramName="search" />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="text-left px-5 py-3 font-semibold text-stone-600">User</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">Joined</th>
                <th className="text-right px-5 py-3 font-semibold text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {!Array.isArray(users) || users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-stone-400">No users found.</td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {u.imageUrl ? (
                        <img src={u.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                          <User size={14} className="text-stone-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-stone-800">
                          {u.firstName || u.username}
                          {u.lastName ? ` ${u.lastName}` : ''}
                        </p>
                        <p className="text-xs text-stone-400">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-stone-500">{u.email}</td>
                  <td className="px-4 py-3.5">
                    {u.isAdmin ? (
                      u.email === SUPER_ADMIN_EMAIL ? (
                        <span className="flex items-center gap-1 text-amber-600 text-xs font-semibold bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                          <Crown size={11} /> Super Admin
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-indigo-600 text-xs font-semibold bg-indigo-50 px-2 py-0.5 rounded-full w-fit">
                          <Shield size={11} /> Admin
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">User</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {u.blocked ? (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">Blocked</span>
                    ) : (
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-stone-400 text-xs whitespace-nowrap">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <AdminUserActions
                      userId={u.id}
                      isAdmin={u.isAdmin ?? false}
                      blocked={u.blocked ?? false}
                      isSuperAdmin={u.email === SUPER_ADMIN_EMAIL}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
