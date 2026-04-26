import { adminGetStats, adminGetAllPosts } from '@/actions/admin.actions';
import Link from 'next/link';
import { FileText, Users, Eye, Star, ArrowRight, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Admin Overview' };

export default async function AdminPage() {
  const [stats, recentPostsData] = await Promise.all([
    adminGetStats(),
    adminGetAllPosts({ pageSize: 5 }),
  ]);

  const recentPosts = recentPostsData.data ?? [];

  const statCards = [
    { label: 'Total Posts',    value: stats.totalPosts,    icon: FileText, color: 'indigo',  href: '/admin/posts' },
    { label: 'Total Users',    value: stats.totalUsers,    icon: Users,    color: 'emerald', href: '/admin/users' },
    { label: 'Total Views',    value: stats.totalViews.toLocaleString(), icon: Eye, color: 'violet', href: '/admin/posts' },
    { label: 'Featured Posts', value: stats.featuredCount, icon: Star,     color: 'amber',   href: '/admin/posts' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Admin Overview</h1>
        <p className="text-stone-500 mt-1">Manage your blog platform from here.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-${color}-50`}>
              <Icon size={18} className={`text-${color}-600`} />
            </div>
            <div className="text-2xl font-bold text-stone-900">{value}</div>
            <div className="text-sm text-stone-500 mt-0.5 flex items-center justify-between">
              {label}
              <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-500" /> Recent Posts
          </h2>
          <Link href="/admin/posts" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-stone-100">
          {recentPosts.length === 0 ? (
            <p className="text-center py-10 text-stone-400">No posts yet.</p>
          ) : recentPosts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-stone-50 transition-colors">
              <div className="flex-1 min-w-0">
                <Link href={`/blog/${post.slug}`} target="_blank" className="font-medium text-stone-800 hover:text-indigo-600 transition-colors truncate block text-sm">
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-stone-400">
                  <span>{formatDate(post.createdAt)}</span>
                  {post.author && <span>by {post.author.firstName || post.author.username}</span>}
                  <span className="flex items-center gap-1"><Eye size={10} /> {post.views ?? 0}</span>
                  {post.featured && <span className="text-amber-500 flex items-center gap-1"><Star size={10} /> Featured</span>}
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                post.category === 'technology' ? 'bg-blue-50 text-blue-600' :
                post.category === 'lifestyle'  ? 'bg-green-50 text-green-600' :
                'bg-stone-100 text-stone-500'
              }`}>
                {post.category || 'other'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
