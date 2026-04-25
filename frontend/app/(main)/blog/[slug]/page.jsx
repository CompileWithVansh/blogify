import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { getPostBySlug, getImageUrl } from '@/lib/strapi';
import { formatDate } from '@/lib/utils';
import { Clock, Calendar, Tag, ArrowLeft, Eye, Share2 } from 'lucide-react';
import DeletePostButton from '@/components/DeletePostButton';
import ShareButton from '@/components/ShareButton';

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: getImageUrl(post) ? [getImageUrl(post)] : [],
    },
  };
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) notFound();

  const { userId } = await auth();
  const imageUrl = getImageUrl(post);
  const tags = Array.isArray(post.tags) ? post.tags : [];

  // Check if the current user is the author
  let isAuthor = false;
  if (userId) {
    const { checkUser } = await import('@/lib/checkUser');
    const strapiUser = await checkUser();
    if (strapiUser && post.author) {
      isAuthor = String(strapiUser.id) === String(post.author.id);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Back nav */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-40">
        <div className="section h-12 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-indigo-600 transition-colors font-medium">
            <ArrowLeft size={15} /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 text-xs text-stone-400">
            {post.views > 0 && (
              <span className="flex items-center gap-1">
                <Eye size={12} /> {post.views} views
              </span>
            )}
            <ShareButton title={post.title} />
          </div>
        </div>
      </div>

      <article className="section py-12 max-w-3xl">
        {/* Category + featured */}
        <div className="flex items-center gap-2 mb-5">
          {post.category && (
            <span className="badge-indigo capitalize">{post.category}</span>
          )}
          {post.featured && (
            <span className="badge bg-yellow-50 text-yellow-700 border-yellow-100">⭐ Featured</span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6 leading-tight tracking-tight">
          {post.title}
        </h1>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 mb-8 pb-6 border-b border-stone-200">
          {post.author && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                {(post.author.firstName?.[0] || post.author.username?.[0] || '?').toUpperCase()}
              </div>
              <span className="font-semibold text-stone-700">
                {post.author.firstName
                  ? `${post.author.firstName} ${post.author.lastName || ''}`.trim()
                  : post.author.username}
              </span>
            </div>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(post.publishedAt)}
          </span>
          {post.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime} min read
            </span>
          )}
        </div>

        {/* Cover image */}
        {imageUrl && (
          <div className="relative w-full h-72 md:h-[420px] rounded-3xl overflow-hidden mb-10 shadow-lg">
            <Image src={imageUrl} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {/* Excerpt callout */}
        {post.excerpt && (
          <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-r-2xl px-6 py-4 mb-8 text-indigo-800 font-medium text-lg leading-relaxed">
            {post.excerpt}
          </div>
        )}

        {/* Content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{
            __html: (post.content ?? '')
              .replace(/\n\n/g, '</p><p>')
              .replace(/\n/g, '<br/>')
              .replace(/^/, '<p>')
              .replace(/$/, '</p>'),
          }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-stone-200">
            <Tag size={15} className="text-stone-400" />
            {tags.map((tag) => (
              <span
                key={tag}
                className="badge-stone hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-100 transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Author actions — only visible to the post's author */}
        {isAuthor && (
          <div className="flex items-center gap-3 mt-10 pt-8 border-t border-stone-200">
            <Link
              href={`/blog/edit/${post.documentId || post.id}`}
              className="btn-primary text-sm"
              data-testid="edit-post-btn"
            >
              Edit Post
            </Link>
            <DeletePostButton postId={post.documentId || post.id} />
          </div>
        )}
      </article>
    </div>
  );
}
