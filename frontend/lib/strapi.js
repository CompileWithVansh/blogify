const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${STRAPI_API_TOKEN}`,
};

// ── READ ──────────────────────────────────────────────────────────────────────

export async function getPosts({ page = 1, pageSize = 9, category, search } = {}) {
  const params = new URLSearchParams({
    'pagination[page]': page,
    'pagination[pageSize]': pageSize,
    'populate': '*',           // Strapi 5: use * not comma-separated
    'sort': 'createdAt:desc',
  });
  if (category && category !== 'all') params.append('filters[category][$eq]', category);
  if (search) params.append('filters[title][$containsi]', search);

  const res = await fetch(`${STRAPI_URL}/api/posts?${params}`, {
    headers,
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error('getPosts error:', res.status, await res.text());
    return { data: [], meta: { pagination: { page: 1, pageCount: 1, total: 0 } } };
  }
  return res.json();
}

export async function getPostBySlug(slug) {
  const params = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'populate': '*',
  });
  const res = await fetch(`${STRAPI_URL}/api/posts?${params}`, {
    headers,
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.[0] ?? null;
}

export async function getFeaturedPosts() {
  const params = new URLSearchParams({
    'filters[featured][$eq]': 'true',
    'populate': '*',
    'pagination[pageSize]': '3',
    'sort': 'createdAt:desc',
  });
  const res = await fetch(`${STRAPI_URL}/api/posts?${params}`, {
    headers,
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export async function createPost(postData) {
  const res = await fetch(`${STRAPI_URL}/api/posts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: postData }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create post: ${err}`);
  }
  return res.json();
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

export async function updatePost(id, postData) {
  // Strapi 5: use documentId in the URL
  const res = await fetch(`${STRAPI_URL}/api/posts/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: postData }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update post: ${err}`);
  }
  return res.json();
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function deletePost(id) {
  // Strapi 5: use documentId in the URL
  const res = await fetch(`${STRAPI_URL}/api/posts/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return res.json();
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

export function estimateReadTime(content = '') {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getImageUrl(post) {
  if (post?.coverImageUrl) return post.coverImageUrl;
  if (post?.coverImage?.url) {
    const url = post.coverImage.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  return null;
}
