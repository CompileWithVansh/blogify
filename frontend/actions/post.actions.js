'use server';

import { checkUser, isAdminUser } from '@/lib/checkUser';
import { createPost, updatePost, deletePost, estimateReadTime } from '@/lib/strapi';
import { revalidatePath } from 'next/cache';

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Date.now().toString(36);
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export async function createPostAction(formData) {
  try {
    const { auth } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    if (!userId) return { error: 'Not authenticated. Please sign in.' };

    const user = await checkUser();
    if (!user) return { error: 'Could not sync your account. Please try again in a moment.' };

    const title = formData.get('title');
    const content = formData.get('content');
    const excerpt = formData.get('excerpt');
    const category = formData.get('category') || 'other';
    const coverImageUrl = formData.get('coverImageUrl') || '';
    const tagsRaw = formData.get('tags') || '';
    const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

    if (!title || !content) return { error: 'Title and content are required' };

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
    return { success: true, data: result };
  } catch (err) {
    console.error('createPostAction error:', err.message);
    return { error: err.message || 'Failed to create post' };
  }
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

export async function updatePostAction(formData) {
  try {
    const { auth } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    if (!userId) return { error: 'Not authenticated. Please sign in.' };

    const user = await checkUser();
    if (!user) return { error: 'Could not sync your account. Please try again in a moment.' };

    const id = formData.get('id');
    const title = formData.get('title');
    const content = formData.get('content');
    const excerpt = formData.get('excerpt');
    const category = formData.get('category') || 'other';
    const coverImageUrl = formData.get('coverImageUrl') || '';
    const tagsRaw = formData.get('tags') || '';
    const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

    if (!id || !title || !content) return { error: 'ID, title and content are required' };

    // Ownership check
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
    const postRes = await fetch(`${STRAPI_URL}/api/posts/${id}?populate=author`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      cache: 'no-store',
    });
    if (postRes.ok && !isAdminUser(user)) {
      const postData = await postRes.json();
      const authorId = postData?.data?.author?.id ?? postData?.data?.author;
      if (authorId && String(authorId) !== String(user.id)) {
        return { error: 'You can only edit your own posts' };
      }
    }

    const result = await updatePost(id, {
      title, content, excerpt, category, coverImageUrl, tags,
      readTime: estimateReadTime(content),
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${formData.get('slug')}`);
    revalidatePath('/dashboard');
    return { success: true, data: result };
  } catch (err) {
    console.error('updatePostAction error:', err.message);
    return { error: err.message || 'Failed to update post' };
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function deletePostAction(formData) {
  try {
    const { auth } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    if (!userId) return { error: 'Not authenticated' };

    const id = formData.get('id');
    if (!id) return { error: 'Post ID is required' };

    const user = await checkUser();
    if (!user) return { error: 'Could not verify user identity' };

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

    const postRes = await fetch(`${STRAPI_URL}/api/posts/${id}?populate=author`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      cache: 'no-store',
    });

    if (postRes.ok && !isAdminUser(user)) {
      const postData = await postRes.json();
      const authorId = postData?.data?.author?.id ?? postData?.data?.author;
      if (authorId && String(authorId) !== String(user.id)) {
        return { error: 'You can only delete your own posts' };
      }
    }

    await deletePost(id);
    revalidatePath('/blog');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('deletePostAction error:', err.message);
    return { error: err.message || 'Failed to delete post' };
  }
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
