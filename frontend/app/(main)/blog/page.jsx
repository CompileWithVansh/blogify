import { getPosts } from '@/lib/strapi';
import PostCard from '@/components/PostCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import { BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Blog',
  description: 'Browse all articles on Blogify.',
};

export default async function BlogPage({ searchParams }) {
  const page     = Number(searchParams?.page) || 1;
  const category = searchParams?.category || 'all';
  const search   = searchParams?.search || '';

  let posts = [], pagination = { page: 1, pageCount: 1, total: 0 };

  try {
    const data = await getPosts({ page, pageSize: 9, category, search });
    posts      = data.data ?? [];
    pagination = data.meta?.pagination ?? pagination;
  } catch (_) {}

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page header */}
      <div className="bg-white border-b border-stone-200">
        <div className="section py-12 pt-28">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <BookOpen size={20} className="text-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">All Posts</span>
          </div>
          <h1 className="text-4xl font-bold text-stone-900 mb-1">The Blog</h1>
          <p className="text-stone-500">
            {pagination.total > 0
              ? `${pagination.total} article${pagination.total !== 1 ? 's' : ''} published`
              : 'No articles yet'}
          </p>
        </div>
      </div>

      <div className="section py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <SearchBar defaultValue={search} />
          <CategoryFilter active={category} />
        </div>

        {/* Active filter indicator */}
        {(search || category !== 'all') && (
          <div className="flex items-center gap-2 mb-6 text-sm text-stone-500">
            <span>Showing results</span>
            {search && <span className="badge-indigo">"{search}"</span>}
            {category !== 'all' && <span className="badge-indigo capitalize">{category}</span>}
            <span>— {pagination.total} found</span>
          </div>
        )}

        {/* Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-stone-200 rounded-3xl">
            <BookOpen size={40} className="mx-auto mb-4 text-stone-300" />
            <h3 className="text-lg font-semibold text-stone-600 mb-2">No posts found</h3>
            <p className="text-stone-400">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger" data-testid="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} className="animate-fade-up" />
            ))}
          </div>
        )}

        <Pagination currentPage={page} totalPages={pagination.pageCount} />
      </div>
    </div>
  );
}
