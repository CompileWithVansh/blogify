'use server';

import { checkUser, isAdminUser } from '@/lib/checkUser';
import { revalidatePath } from 'next/cache';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${STRAPI_API_TOKEN}`,
});

async function requireAdmin() {
  const user = await checkUser();
  if (!user || !isAdminUser(user)) throw new Error('Unauthorized: Admin access required');
  return user;
}

// ── POSTS ─────────────────────────────────────────────────────────────────────

export async function adminGetAllPosts({ page = 1, pageSize = 20, search = '' } = {}) {
  await requireAdmin();
  const params = new URLSearchParams({
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
    'populate': '*',
    'sort': 'createdAt:desc',
  });
  if (search) params.append('filters[title][$containsi]', search);

  const res = await fetch(`${STRAPI_URL}/api/posts?${params}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) return { data: [], meta: { pagination: { total: 0, pageCount: 1 } } };
  return res.json();
}

export async function adminDeletePost(formData) {
  await requireAdmin();
  const id = formData.get('id');
  if (!id) return { error: 'Post ID required' };

  const res = await fetch(`${STRAPI_URL}/api/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) return { error: 'Failed to delete post' };

  revalidatePath('/admin/posts');
  revalidatePath('/blog');
  return { success: true };
}

export async function adminToggleFeatured(formData) {
  await requireAdmin();
  const id = formData.get('id');
  const featured = formData.get('featured') === 'true';

  const res = await fetch(`${STRAPI_URL}/api/posts/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ data: { featured: !featured } }),
  });
  if (!res.ok) return { error: 'Failed to update post' };

  revalidatePath('/admin/posts');
  revalidatePath('/blog');
  return { success: true };
}

// ── USERS ─────────────────────────────────────────────────────────────────────

export async function adminGetAllUsers({ page = 1, pageSize = 20, search = '' } = {}) {
  await requireAdmin();
  const params = new URLSearchParams({
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
    'sort': 'createdAt:desc',
  });
  if (search) {
    params.append('filters[$or][0][email][$containsi]', search);
    params.append('filters[$or][1][username][$containsi]', search);
    params.append('filters[$or][2][firstName][$containsi]', search);
  }

  const res = await fetch(`${STRAPI_URL}/api/users?${params}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function adminToggleUserAdmin(formData) {
  await requireAdmin();
  const id = formData.get('id');
  const isAdmin = formData.get('isAdmin') === 'true';

  const res = await fetch(`${STRAPI_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ isAdmin: !isAdmin }),
  });
  if (!res.ok) return { error: 'Failed to update user' };

  revalidatePath('/admin/users');
  return { success: true };
}

export async function adminToggleBlockUser(formData) {
  await requireAdmin();
  const id = formData.get('id');
  const blocked = formData.get('blocked') === 'true';

  const res = await fetch(`${STRAPI_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ blocked: !blocked }),
  });
  if (!res.ok) return { error: 'Failed to update user' };

  revalidatePath('/admin/users');
  return { success: true };
}

export async function adminDeleteUser(formData) {
  const currentUser = await requireAdmin();
  const id = formData.get('id');
  if (!id) return { error: 'User ID required' };

  // Prevent deleting yourself
  if (String(id) === String(currentUser.id)) {
    return { error: 'You cannot delete your own account' };
  }

  // Prevent deleting the super admin
  const { SUPER_ADMIN_EMAIL } = await import('@/lib/checkUser');
  const userRes = await fetch(`${STRAPI_URL}/api/users/${id}`, {
    headers: authHeaders(), cache: 'no-store',
  });
  if (userRes.ok) {
    const userData = await userRes.json();
    if (userData?.email === SUPER_ADMIN_EMAIL) {
      return { error: 'Cannot delete the super admin' };
    }
  }

  const res = await fetch(`${STRAPI_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) return { error: 'Failed to delete user' };

  revalidatePath('/admin/users');
  return { success: true };
}

// ── STATS ─────────────────────────────────────────────────────────────────────

export async function adminGetStats() {
  await requireAdmin();

  const [postsRes, usersRes] = await Promise.all([
    fetch(`${STRAPI_URL}/api/posts?pagination[pageSize]=1&populate=*`, {
      headers: authHeaders(), cache: 'no-store',
    }),
    fetch(`${STRAPI_URL}/api/users?pagination[pageSize]=100`, {
      headers: authHeaders(), cache: 'no-store',
    }),
  ]);

  const postsData = postsRes.ok ? await postsRes.json() : { meta: { pagination: { total: 0 } } };
  const usersData = usersRes.ok ? await usersRes.json() : [];

  // Fetch all posts for view count aggregation
  const allPostsRes = await fetch(
    `${STRAPI_URL}/api/posts?pagination[pageSize]=200&fields[0]=views&fields[1]=featured`,
    { headers: authHeaders(), cache: 'no-store' }
  );
  const allPostsData = allPostsRes.ok ? await allPostsRes.json() : { data: [] };
  const allPosts = allPostsData.data ?? [];

  const totalViews = allPosts.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const featuredCount = allPosts.filter((p) => p.featured).length;

  return {
    totalPosts: postsData.meta?.pagination?.total ?? 0,
    totalUsers: Array.isArray(usersData) ? usersData.length : 0,
    totalViews,
    featuredCount,
  };
}
