import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';
import { getImageUrl } from '@/lib/strapi';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS = {
  technology:    'bg-blue-50 text-blue-700 border-blue-100',
  lifestyle:     'bg-emerald-50 text-emerald-700 border-emerald-100',
  travel:        'bg-sky-50 text-sky-700 border-sky-100',
  food:          'bg-orange-50 text-orange-700 border-orange-100',
  health:        'bg-green-50 text-green-700 border-green-100',
  business:      'bg-violet-50 text-violet-700 border-violet-100',
  education:     'bg-amber-50 text-amber-700 border-amber-100',
  entertainment: 'bg-pink-50 text-pink-700 border-pink-100',
  other:         'bg-stone-100 text-stone-600 border-stone-200',
};

function CategoryBadge({ category }) {
  if (!category) return null;
  return (
    <span className={cn('badge capitalize', CATEGORY_COLORS[category] ?? CATEGORY_COLORS.other)}>
      {category}
    </span>
  );
}

function MetaRow({ post }) {
  return (
    <div className="flex items-center gap-3 text-xs text-stone-400">
      <span className="flex items-center gap-1">
        <Calendar size={11} />
        {formatDate(post.publishedAt || post.createdAt)}
      </span>
      {post.readTime && (
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {post.readTime} min read
        </span>
      )}
      {post.author?.username && (
        <span className="truncate">
          by <strong className="text-stone-600 font-semibold">{post.author.username}</strong>
        </span>
      )}
    </div>
  );
}

/* ── Default card ─────────────────────────────────────────────────────────── */
export default function PostCard({ post, variant = 'default', className }) {
  const imageUrl = getImageUrl(post);

  if (variant === 'hero') return <HeroCard post={post} imageUrl={imageUrl} />;
  if (variant === 'compact') return <CompactCard post={post} imageUrl={imageUrl} />;

  return (
    <article
      className={cn('card-hover group flex flex-col overflow-hidden', className)}
      data-testid="post-card"
    >
      {/* Cover */}
      <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden bg-stone-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <PlaceholderCover category={post.category} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center gap-2">
          <CategoryBadge category={post.category} />
          {post.featured && (
            <span className="badge bg-yellow-50 text-yellow-700 border-yellow-100">⭐ Featured</span>
          )}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2 className="font-bold text-stone-900 text-lg leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <MetaRow post={post} />
          <Link
            href={`/blog/${post.slug}`}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
            aria-label="Read more"
          >
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ── Hero card (large featured) ──────────────────────────────────────────── */
function HeroCard({ post, imageUrl }) {
  return (
    <article className="card-hover group overflow-hidden h-full flex flex-col" data-testid="post-card">
      <Link href={`/blog/${post.slug}`} className="block relative h-64 lg:h-80 overflow-hidden bg-stone-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <PlaceholderCover category={post.category} large />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <CategoryBadge category={post.category} />
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-6 gap-3">
        <Link href={`/blog/${post.slug}`}>
          <h2 className="font-bold text-stone-900 text-2xl leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
          <MetaRow post={post} />
          <Link href={`/blog/${post.slug}`} className="btn-ghost text-xs px-3 py-1.5">
            Read <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ── Compact card (sidebar) ──────────────────────────────────────────────── */
function CompactCard({ post, imageUrl }) {
  return (
    <article className="card-hover group flex gap-4 p-4 overflow-hidden" data-testid="post-card">
      <Link href={`/blog/${post.slug}`} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-stone-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <PlaceholderCover category={post.category} />
        )}
      </Link>
      <div className="flex flex-col justify-center gap-1.5 min-w-0">
        <CategoryBadge category={post.category} />
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-semibold text-stone-900 text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <MetaRow post={post} />
      </div>
    </article>
  );
}

/* ── Placeholder cover ───────────────────────────────────────────────────── */
const GRADIENTS = {
  technology:    'from-blue-400 to-indigo-500',
  lifestyle:     'from-emerald-400 to-teal-500',
  travel:        'from-sky-400 to-cyan-500',
  food:          'from-orange-400 to-amber-500',
  health:        'from-green-400 to-emerald-500',
  business:      'from-violet-400 to-purple-500',
  education:     'from-amber-400 to-yellow-500',
  entertainment: 'from-pink-400 to-rose-500',
  other:         'from-stone-300 to-stone-400',
};

const EMOJIS = {
  technology: '💻', lifestyle: '🌿', travel: '✈️', food: '🍜',
  health: '💪', business: '📈', education: '🎓', entertainment: '🎬', other: '✍️',
};

function PlaceholderCover({ category, large }) {
  const gradient = GRADIENTS[category] ?? GRADIENTS.other;
  const emoji = EMOJIS[category] ?? '✍️';
  return (
    <div className={cn('absolute inset-0 bg-gradient-to-br flex items-center justify-center', gradient)}>
      <span className={cn('opacity-30', large ? 'text-7xl' : 'text-4xl')}>{emoji}</span>
    </div>
  );
}
