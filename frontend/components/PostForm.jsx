'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createPostAction, updatePostAction, searchCoverImage } from '@/actions/post.actions';
import { CATEGORIES } from '@/lib/utils';
import { ImageIcon, Loader2, X, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function PostForm({ mode = 'create', post = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl || '');
  const [searchingImage, setSearchingImage] = useState(false);
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState(post?.content || '');
  const titleRef = useRef(null);

  // Strapi 5 uses documentId — use it if available, fallback to id
  const postId = post?.documentId || post?.id || '';

  async function handleImageSearch() {
    const title = titleRef.current?.value?.trim();
    if (!title) { toast.error('Enter a title first'); return; }
    setSearchingImage(true);
    try {
      const url = await searchCoverImage(title);
      if (url) { setCoverImageUrl(url); toast.success('Cover image found!'); }
      else toast.info('No image found — paste a URL manually');
    } catch (_) {
      toast.error('Image search failed');
    } finally {
      setSearchingImage(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set('coverImageUrl', coverImageUrl);
    formData.set('content', content);

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createPostAction(formData);
          toast.success('Post published! 🎉');
          router.push('/dashboard');
        } else {
          await updatePostAction(formData);
          toast.success('Post updated!');
          router.push('/dashboard');
        }
      } catch (err) {
        toast.error(err.message || 'Something went wrong');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="post-form">
      {mode === 'edit' && (
        <>
          <input type="hidden" name="id" value={postId} />
          <input type="hidden" name="slug" value={post?.slug || ''} />
        </>
      )}

      {/* ── Title ── */}
      <div>
        <label className="label">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          ref={titleRef}
          name="title"
          defaultValue={post?.title || ''}
          required
          placeholder="Give your post a great title..."
          className="input text-lg font-semibold placeholder:font-normal"
          data-testid="title-input"
        />
      </div>

      {/* ── Excerpt ── */}
      <div>
        <label className="label">
          Excerpt
          <span className="ml-1 text-xs font-normal text-stone-400">— shown in post cards</span>
        </label>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt || ''}
          rows={2}
          placeholder="A short, compelling summary of your post..."
          className="input resize-none"
          data-testid="excerpt-input"
        />
      </div>

      {/* ── Category + Tags row ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select
            name="category"
            defaultValue={post?.category || 'other'}
            className="input"
            data-testid="category-select"
          >
            {CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
              <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">
            Tags
            <span className="ml-1 text-xs font-normal text-stone-400">— comma separated</span>
          </label>
          <input
            name="tags"
            defaultValue={Array.isArray(post?.tags) ? post.tags.join(', ') : ''}
            placeholder="react, nextjs, webdev"
            className="input"
            data-testid="tags-input"
          />
        </div>
      </div>

      {/* ── Cover image ── */}
      <div>
        <label className="label">Cover Image</label>
        <div className="flex gap-2">
          <input
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="Paste an image URL or search by title..."
            className="input flex-1"
            data-testid="cover-image-input"
          />
          <button
            type="button"
            onClick={handleImageSearch}
            disabled={searchingImage}
            className="btn-secondary shrink-0 text-sm"
            title="Search Unsplash for a cover image"
          >
            {searchingImage
              ? <Loader2 size={15} className="animate-spin" />
              : <><Sparkles size={15} /> Auto</>
            }
          </button>
          {coverImageUrl && (
            <button
              type="button"
              onClick={() => setCoverImageUrl('')}
              className="btn-ghost shrink-0 text-stone-400 hover:text-red-500 px-2.5"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {coverImageUrl && (
          <div className="mt-3 relative h-40 rounded-2xl overflow-hidden border border-stone-200">
            <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <span className="absolute bottom-2 left-3 text-white text-xs font-medium">Preview</span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label mb-0">
            Content <span className="text-red-400">*</span>
          </label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="btn-ghost text-xs px-3 py-1.5"
          >
            {preview ? <><EyeOff size={13} /> Edit</> : <><Eye size={13} /> Preview</>}
          </button>
        </div>

        {preview ? (
          <div className="min-h-[320px] border border-stone-200 rounded-2xl p-6 bg-white blog-content overflow-auto">
            {content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/\n/g, '<br/>')
                    .replace(/^/, '<p>')
                    .replace(/$/, '</p>'),
                }}
              />
            ) : (
              <p className="text-stone-400 italic">Nothing to preview yet...</p>
            )}
          </div>
        ) : (
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={18}
            placeholder={`Write your post here...\n\nTips:\n- Use blank lines to separate paragraphs\n- Start a line with # for headings\n- Wrap text in **bold** or *italic*`}
            className="input resize-y font-mono text-sm leading-relaxed"
            data-testid="content-input"
          />
        )}

        <div className="flex items-center justify-between mt-2 text-xs text-stone-400">
          <span>{content.trim().split(/\s+/).filter(Boolean).length} words</span>
          <span>~{Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} min read</span>
        </div>
      </div>

      {/* ── Submit ── */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary flex-1 justify-center py-3.5 text-base"
          data-testid="submit-btn"
        >
          {isPending && <Loader2 size={18} className="animate-spin" />}
          {mode === 'create' ? '🚀 Publish Post' : '💾 Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary py-3.5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
