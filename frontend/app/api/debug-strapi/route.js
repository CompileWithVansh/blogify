import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not authenticated' }, { status: 401 });

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

  const results = {
    strapiUrl: STRAPI_URL,
    hasToken: !!STRAPI_API_TOKEN,
    tokenPrefix: STRAPI_API_TOKEN?.slice(0, 10) + '...',
  };

  try {
    // Test 1: basic connectivity
    const pingRes = await fetch(`${STRAPI_URL}/api/users?pagination[pageSize]=1`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      cache: 'no-store',
    });
    results.pingStatus = pingRes.status;
    results.pingBody = await pingRes.text();
  } catch (e) {
    results.pingError = e.message;
  }

  return Response.json(results);
}
