import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not authenticated' }, { status: 401 });

  const clerkUser = await currentUser();
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

  const results = {
    strapiUrl: STRAPI_URL,
    hasToken: !!STRAPI_API_TOKEN,
    tokenPrefix: STRAPI_API_TOKEN?.slice(0, 10) + '...',
    clerkId: userId,
    email: clerkUser?.emailAddresses[0]?.emailAddress,
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
  };

  // Test 1: list users (no filter)
  try {
    const r = await fetch(`${STRAPI_URL}/api/users?pagination[pageSize]=1`, {
      headers, cache: 'no-store',
    });
    results.listUsersStatus = r.status;
    results.listUsersBody = await r.text();
  } catch (e) {
    results.listUsersError = e.message;
  }

  // Test 2: filter by clerkId
  try {
    const r = await fetch(
      `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${userId}`,
      { headers, cache: 'no-store' }
    );
    results.filterByClerkIdStatus = r.status;
    results.filterByClerkIdBody = await r.text();
  } catch (e) {
    results.filterByClerkIdError = e.message;
  }

  // Test 3: create user attempt
  const email = clerkUser?.emailAddresses[0]?.emailAddress;
  const username = `test_${userId.slice(-6)}`;
  try {
    const r = await fetch(`${STRAPI_URL}/api/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        username,
        email,
        password: `Test_${Date.now()}!`,
        confirmed: true,
        blocked: false,
        clerkId: userId,
      }),
    });
    results.createUserStatus = r.status;
    results.createUserBody = await r.text();
  } catch (e) {
    results.createUserError = e.message;
  }

  return Response.json(results, { status: 200 });
}
