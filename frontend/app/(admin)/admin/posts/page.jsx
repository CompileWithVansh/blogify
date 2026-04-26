import { adminGetAllPosts } from '@/actions/admin.actions';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Eye, Star, Edit } from 'lucide-react';
import AdminPostActions from '@/components/admin/AdminPostActions';
import AdminSearchInput from '@/components/admin/AdminSearchInput';

export const metadata = { title: 'Manage Posts | Admin' };

export default async function AdminPostsPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || '';

  const { data: posts, meta } = await adminGetAllPosts({ page, pageSize: 20, search });
  const totalPages = meta?.pagination?.pageCount ?? 1;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Posts</h1>
          <p className="text-stone-500 mt-0.5 text-sm">{meta?.pagination?.total ?? 0} total posts</p>
        </div>
        <Link href="/blog/create" className="btn-primary text-sm">
          + New Post
        </Link>
      </div>

      {/* Search */}
      <div className="mb-5">
        <AdminSearchInput placeholder="Search posts by title…" paramName="search" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="text-left px-5 py-3 font-semibold text-stone-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">Author</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">Views</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">Featured</th>
                <th className="text-right px-5 py-3 font-semibold text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-400">No posts found.</td>
                </tr>
              ) : posts.map((post) => (
                <tr key={post.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3.5 max-w-xs">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="font-medium text-stone-800 hover:text-indigo-600 transition-colors truncate block">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-stone-500 whitespace-nowrap">
                    {post.author?.firstName || post.author?.username || '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="capitalize text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                      {post.category || 'other'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-stone-500">
                    <span className="flex items-center gap-1"><Eye size={12} /> {post.views ?? 0}</span>
                  </td>
                  <td className="px-4 py-3.5 text-stone-400 whitespace-nowrap text-xs">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    {post.featured
                      ? <span className="flex items-center gap-1 text-amber-500 text-xs font-medium"><Star size={12} /> Yes</span>
                      : <span className="text-stone-300 text-xs">—</span>
                    }
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/blog/edit/${post.documentId || post.id}`}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </Link>
                      <AdminPostActions
                        postId={post.documentId || post.id}
                        featured={post.featured ?? false}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-stone-100">
            <span className="text-sm text-stone-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`?page=${page - 1}&search=${search}`} className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm hover:bg-stone-50 transition-colors">
                  Prev
                </Link>
              )}
              {page < totalPages && (
                <Link href={`?page=${page + 1}&search=${search}`} className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm hover:bg-stone-50 transition-colors">
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
