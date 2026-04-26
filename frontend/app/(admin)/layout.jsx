import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { checkUser, isAdminUser } from '@/lib/checkUser';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard, FileText, Users, Shield, Feather, Home,
} from 'lucide-react';

const NAV = [
  { href: '/admin',        label: 'Overview',  icon: LayoutDashboard },
  { href: '/admin/posts',  label: 'Posts',     icon: FileText },
  { href: '/admin/users',  label: 'Users',     icon: Users },
];

export const metadata = { title: 'Admin Panel | Blogify' };

export default async function AdminLayout({ children }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await checkUser();
  if (!user || !isAdminUser(user)) redirect('/dashboard');

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 bg-white border-r border-stone-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-stone-200">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Feather size={15} className="text-white" />
          </div>
          <span className="font-bold text-stone-900">
            Blog<span className="text-indigo-600">ify</span>
          </span>
          <span className="ml-auto text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md uppercase tracking-wide">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-stone-200 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <Home size={15} /> Back to Site
          </Link>
          <div className="flex items-center gap-3 px-3 py-2">
            <UserButton afterSignOutUrl="/" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-stone-700 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[11px] text-indigo-600 font-medium flex items-center gap-1">
                <Shield size={10} /> Super Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
