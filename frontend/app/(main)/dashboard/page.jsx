import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { checkUser } from '@/lib/checkUser';
import { formatDate } from '@/lib/utils';
import {
  PenLine, Eye, Edit, BarChart2, FileText,
  TrendingUp, Clock, Feather,
} from 'lucide-react';
import DeletePostButton from '@/components/DeletePostButton';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function getUserPosts(userId) {
  // Fetch all posts and filter client-side — avoids Strapi 5 relation filter issues
  const res = await fetch(
    `${STRAPI_URL}/api/posts?sort=createdAt:desc&pagination[pageSize]=100&populate=*`,
    { headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` }, cache: 'no-store' }
  );
  if (!res.ok) return [];
  const data = await res.json();
  const all = data.data ?? [];
  // Filter to only this user's posts
  return all.filter(p => !p.author || p.author?.id === userId || String(p.author?.id) === String(userId));
}

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user  = await checkUser();
  const posts = user ? await getUserPosts(user.id) : [];

  const totalViews = posts.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const totalWords = posts.reduce((sum, p) => sum + ((p.content ?? '').split(/\s+/).length), 0);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-stone-200">
        <div className="section py-10 pt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-1">Dashboard</p>
              <h1 className="text-3xl font-bold text-stone-900">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! 👋
              </h1>
              <p className="text-stone-500 mt-1">Manage your posts and track your writing.</p>
            </div>
            <Link
              href="/blog/create"
              className="btn-primary shrink-0"
              data-testid="create-post-link"
            >
              <PenLine size={16} /> New Post
            </Link>
          </div>
        </div>
      </div>

      <div className="section py-8">
        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FileText,   label: 'Total Posts',  value: posts.length,  color: 'indigo' },
            { icon: Eye,        label: 'Total Views',  value: totalViews,    color: 'emerald' },
            { icon: TrendingUp, label: 'Total Words',  value: totalWords.toLocaleString(), color: 'violet' },
            { icon: Clock,      label: 'Avg Read Time',
              value: posts.length
                ? `${Math.max(1, Math.round(posts.reduce((s, p) => s + (p.readTime ?? 1), 0) / posts.length))} min`
                : '—',
              color: 'amber',
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-${color}-50`}>
                <Icon size={18} className={`text-${color}-600`} />
              </div>
              <div className="text-2xl font-bold text-stone-900">{value}</div>
              <div className="text-sm text-stone-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Posts list ── */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="font-semibold text-stone-900">Your Posts</h2>
            {posts.length > 0 && (
              <span className="badge-stone">{posts.length} total</span>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Feather size={28} className="text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-700 mb-2">No posts yet</h3>
              <p className="text-stone-400 mb-6">Start writing and your posts will appear here.</p>
              <Link href="/blog/create" className="btn-primary">
                <PenLine size={16} /> Write your first post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-colors group"
                  data-testid="dashboard-post-item"
                >
                  {/* Category dot */}
                  <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-semibold text-stone-900 hover:text-indigo-600 transition-colors truncate block"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-stone-400">
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      {post.category && (
                        <span className="badge-stone capitalize py-0.5">{post.category}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye size={11} /> {post.views ?? 0}
                      </span>
                      {post.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {post.readTime} min
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="p-2 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      title="View post"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      href={`/blog/edit/${post.documentId || post.id}`}
                      className="p-2 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      title="Edit post"
                      data-testid={`edit-btn-${post.id}`}
                    >
                      <Edit size={15} />
                    </Link>
                    <DeletePostButton postId={post.documentId || post.id} iconOnly />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
