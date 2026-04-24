import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PostForm from '@/components/PostForm';
import { PenLine } from 'lucide-react';

export const metadata = { title: 'Create Post' };

export default async function CreatePostPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="section py-8 pt-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <PenLine size={20} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Create New Post</h1>
              <p className="text-stone-500 text-sm">Share your ideas with the world</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section py-8 max-w-3xl">
        <div className="card p-8">
          <PostForm mode="create" />
        </div>
      </div>
    </div>
  );
}
