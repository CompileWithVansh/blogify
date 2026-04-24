import { getPosts } from '@/lib/strapi';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default async function sitemap() {
  let posts = [];
  try {
    const data = await getPosts({ pageSize: 100 });
    posts = data.data ?? [];
  } catch (_) {}

  const postUrls = posts.map((post) => ({
    url: `${APP_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    { url: APP_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${APP_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...postUrls,
  ];
}
