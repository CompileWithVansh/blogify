import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import PostForm from '@/components/PostForm';
import { Edit } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function getPostById(id) {
  // Strapi 5 uses documentId for lookups
  const res = await fetch(`${STRAPI_URL}/api/posts/${id}?populate=*`, {
    headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    // Try by documentId filter as fallback
    const res2 = await fetch(`${STRAPI_URL}/api/posts?filters[documentId][$eq]=${id}&populate=*`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      cache: 'no-store',
    });
    if (!res2.ok) return null;
    const d = await res2.json();
    return d.data?.[0] ?? null;
  }
  const data = await res.json();
  return data.data ?? null;
}

export const metadata = { title: 'Edit Post' };

export default async function EditPostPage({ params }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const post = await getPostById(params.id);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="section py-8 pt-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Edit size={20} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Edit Post</h1>
              <p className="text-stone-500 text-sm truncate max-w-md">{post.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section py-8 max-w-3xl">
        <div className="card p-8">
          <PostForm mode="edit" post={post} />
        </div>
      </div>
    </div>
  );
}
