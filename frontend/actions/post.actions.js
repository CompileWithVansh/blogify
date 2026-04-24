'use server';

import { checkUser } from '@/lib/checkUser';
import { createPost, updatePost, deletePost, estimateReadTime } from '@/lib/strapi';
import { revalidatePath } from 'next/cache';

// Generate a URL-safe slug from a title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove special chars
    .replace(/[\s_-]+/g, '-')   // spaces/underscores → hyphens
    .replace(/^-+|-+$/g, '')    // trim leading/trailing hyphens
    + '-' + Date.now().toString(36); // append short unique suffix
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export async function createPostAction(formData) {
  const user = await checkUser();
  if (!user) throw new Error('Not authenticated');

  const title = formData.get('title');
  const content = formData.get('content');
  const excerpt = formData.get('excerpt');
  const category = formData.get('category') || 'other';
  const coverImageUrl = formData.get('coverImageUrl') || '';
  const tagsRaw = formData.get('tags') || '';
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

  if (!title || !content) throw new Error('Title and content are required');

  const result = await createPost({
    title,
    slug: generateSlug(title),
    content,
    excerpt,
    category,
    coverImageUrl,
    tags,
    author: user.id,
    readTime: estimateReadTime(content),
    publishedAt: new Date().toISOString(),
  });

  revalidatePath('/blog');
  revalidatePath('/dashboard');
  return result;
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

export async function updatePostAction(formData) {
  const user = await checkUser();
  if (!user) throw new Error('Not authenticated');

  const id = formData.get('id');
  const title = formData.get('title');
  const content = formData.get('content');
  const excerpt = formData.get('excerpt');
  const category = formData.get('category') || 'other';
  const coverImageUrl = formData.get('coverImageUrl') || '';
  const tagsRaw = formData.get('tags') || '';
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

  if (!id || !title || !content) throw new Error('ID, title and content are required');

  const result = await updatePost(id, {
    title,
    content,
    excerpt,
    category,
    coverImageUrl,
    tags,
    readTime: estimateReadTime(content),
  });

  revalidatePath('/blog');
  revalidatePath(`/blog/${formData.get('slug')}`);
  revalidatePath('/dashboard');
  return result;
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function deletePostAction(formData) {
  const user = await checkUser();
  if (!user) throw new Error('Not authenticated');

  const id = formData.get('id');
  if (!id) throw new Error('Post ID is required');

  await deletePost(id);

  revalidatePath('/blog');
  revalidatePath('/dashboard');
  return { success: true };
}

// ── UNSPLASH IMAGE SEARCH ─────────────────────────────────────────────────────

export async function searchCoverImage(query) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` } }
    );
    const data = await res.json();
    return data.results?.[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}
