import Link from 'next/link';
import { getFeaturedPosts, getPosts } from '@/lib/strapi';
import PostCard from '@/components/PostCard';
import {
  ArrowRight, PenLine, BookOpen, Feather,
  Sparkles, TrendingUp, Users, FileText,
} from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export const metadata = {
  title: 'Blogify — Read & Write Ideas',
  description: 'A modern blog platform to read, write, and share your ideas with the world.',
};

const CATEGORY_PILLS = [
  { label: 'Technology', emoji: '💻', href: '/blog?category=technology' },
  { label: 'Lifestyle',  emoji: '🌿', href: '/blog?category=lifestyle' },
  { label: 'Travel',     emoji: '✈️', href: '/blog?category=travel' },
  { label: 'Food',       emoji: '🍜', href: '/blog?category=food' },
  { label: 'Health',     emoji: '💪', href: '/blog?category=health' },
  { label: 'Business',   emoji: '📈', href: '/blog?category=business' },
  { label: 'Education',  emoji: '🎓', href: '/blog?category=education' },
];

export default async function HomePage() {
  const [featuredRes, recentRes] = await Promise.allSettled([
    getFeaturedPosts(),
    getPosts({ pageSize: 6 }),
  ]);

  const featured = featuredRes.status === 'fulfilled' ? featuredRes.value : [];
  const recent   = recentRes.status === 'fulfilled' ? (recentRes.value.data ?? []) : [];
  const total    = recentRes.status === 'fulfilled' ? (recentRes.value.meta?.pagination?.total ?? 0) : 0;

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center bg-hero-gradient overflow-hidden noise">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="section relative z-10 py-24 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-8 animate-fade-up">
            <Sparkles size={14} className="text-yellow-300" />
            Your ideas deserve to be heard
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.05] tracking-tight animate-fade-up" style={{ animationDelay: '60ms' }}>
            Write. Share.
            <br />
            <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #a5b4fc 0%, #f0abfc 100%)' }}>
              Inspire.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '120ms' }}>
            Blogify is a modern platform for writers and readers. Publish your stories,
            discover great content, and connect with a community of curious minds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '180ms' }}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
              data-testid="hero-read-btn"
            >
              <BookOpen size={18} /> Start Reading
            </Link>

            <SignedOut>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all active:scale-95"
                data-testid="hero-write-btn"
              >
                <PenLine size={18} /> Start Writing — Free
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                href="/blog/create"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all active:scale-95"
                data-testid="hero-write-btn"
              >
                <PenLine size={18} /> Write a Post
              </Link>
            </SignedIn>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-up" style={{ animationDelay: '240ms' }}>
            {[
              { icon: FileText, value: `${total}+`, label: 'Articles' },
              { icon: Users,    value: '50+',       label: 'Writers' },
              { icon: TrendingUp, value: '9',       label: 'Topics' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 text-white/80">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Icon size={18} className="text-white/70" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-white">{value}</div>
                  <div className="text-xs text-white/50">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-stone-50 to-transparent" />
      </section>

      {/* ── Category pills ────────────────────────────────────────────────── */}
      <section className="section py-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {CATEGORY_PILLS.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex items-center gap-2 bg-white border border-stone-200 hover:border-indigo-300 hover:bg-indigo-50 text-stone-700 hover:text-indigo-700 font-medium text-sm px-4 py-2.5 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Posts ────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-indigo-500" />
                <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Featured</span>
              </div>
              <h2 className="text-3xl font-bold text-stone-900">Editor&apos;s Picks</h2>
            </div>
            <Link href="/blog" className="btn-ghost text-sm">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {/* Featured hero card + 2 side cards */}
          <div className="grid lg:grid-cols-5 gap-5">
            {featured[0] && (
              <div className="lg:col-span-3">
                <PostCard post={featured[0]} variant="hero" />
              </div>
            )}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {featured.slice(1, 3).map((post) => (
                <PostCard key={post.id} post={post} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Recent Posts ──────────────────────────────────────────────────── */}
      <section className="section py-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Latest</span>
            </div>
            <h2 className="text-3xl font-bold text-stone-900">Recent Posts</h2>
          </div>
          <Link href="/blog" className="btn-ghost text-sm">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {recent.map((post) => (
              <PostCard key={post.id} post={post} className="animate-fade-up" />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <SignedOut>
        <section className="section pb-24">
          <div className="relative bg-hero-gradient rounded-3xl p-12 text-center overflow-hidden noise">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Feather size={24} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Ready to share your story?
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                Join Blogify for free. Write, publish, and reach readers who care about your ideas.
              </p>
              <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg active:scale-95">
                <PenLine size={18} /> Create Your Account
              </Link>
            </div>
          </div>
        </section>
      </SignedOut>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 border-2 border-dashed border-stone-200 rounded-3xl">
      <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Feather size={28} className="text-stone-400" />
      </div>
      <h3 className="text-lg font-semibold text-stone-700 mb-2">No posts yet</h3>
      <p className="text-stone-500 mb-6">Be the first to publish something great.</p>
      <Link href="/blog/create" className="btn-primary">
        <PenLine size={16} /> Write the first post
      </Link>
    </div>
  );
}
