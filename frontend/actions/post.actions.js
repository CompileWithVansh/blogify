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
  // Verify Clerk session first — this is the real auth check
  const { auth } = await import('@clerk/nextjs/server');
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const user = await checkUser();
  if (!user) throw new Error('Failed to sync user with backend. Check STRAPI_API_TOKEN and NEXT_PUBLIC_STRAPI_URL in your environment variables.');

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
  const { auth } = await import('@clerk/nextjs/server');
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const user = await checkUser();
  if (!user) throw new Error('Failed to sync user with backend. Check STRAPI_API_TOKEN and NEXT_PUBLIC_STRAPI_URL in your environment variables.');

  const id = formData.get('id');           // this is documentId in Strapi 5
  const title = formData.get('title');
  const content = formData.get('content');
  const excerpt = formData.get('excerpt');
  const category = formData.get('category') || 'other';
  const coverImageUrl = formData.get('coverImageUrl') || '';
  const tagsRaw = formData.get('tags') || '';
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

  if (!id || !title || !content) throw new Error('ID, title and content are required');

  // Verify ownership before updating
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
  const postRes = await fetch(`${STRAPI_URL}/api/posts/${id}?populate=author`, {
    headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    cache: 'no-store',
  });
  if (postRes.ok) {
    const postData = await postRes.json();
    const authorId = postData?.data?.author?.id ?? postData?.data?.author;
    if (authorId && String(authorId) !== String(user.id)) {
      throw new Error('You can only edit your own posts');
    }
  }

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
  const { auth } = await import('@clerk/nextjs/server');
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const id = formData.get('id');
  if (!id) throw new Error('Post ID is required');

  // Verify the post belongs to the current user before deleting
  const user = await checkUser();
  if (!user) throw new Error('Could not verify user identity');

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

  const postRes = await fetch(`${STRAPI_URL}/api/posts/${id}?populate=author`, {
    headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    cache: 'no-store',
  });

  if (!postRes.ok) throw new Error('Post not found');

  const postData = await postRes.json();
  const authorId = postData?.data?.author?.id ?? postData?.data?.author;

  if (String(authorId) !== String(user.id)) {
    throw new Error('You can only delete your own posts');
  }

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
