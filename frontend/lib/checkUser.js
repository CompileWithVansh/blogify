import { currentUser } from '@clerk/nextjs/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${STRAPI_API_TOKEN}`,
});

async function findByClerkId(clerkId) {
  const res = await fetch(
    `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${clerkId}`,
    { headers: authHeaders(), cache: 'no-store' }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function findByEmail(email) {
  const res = await fetch(
    `${STRAPI_URL}/api/users?filters[email][$eq]=${encodeURIComponent(email)}`,
    { headers: authHeaders(), cache: 'no-store' }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  if (!STRAPI_API_TOKEN) {
    console.error('❌ STRAPI_API_TOKEN is missing');
    return null;
  }

  const email = user.emailAddresses[0]?.emailAddress;

  try {
    // 1. Find by clerkId (fastest path for returning users)
    const byClerkId = await findByClerkId(user.id);
    if (byClerkId) return byClerkId;

    // 2. Find by email (handles users created before clerkId was added)
    if (email) {
      const byEmail = await findByEmail(email);
      if (byEmail) {
        // Backfill clerkId silently
        fetch(`${STRAPI_URL}/api/users/${byEmail.id}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({ clerkId: user.id }),
        }).catch(() => {});
        return byEmail;
      }
    }

    // 3. Create new user — use clerkId suffix to guarantee unique username
    const baseUsername = (
      user.username ||
      email?.split('@')[0] ||
      'user'
    ).replace(/[^a-zA-Z0-9_]/g, '_');

    const username = `${baseUsername}_${user.id.slice(-6)}`;

    const createRes = await fetch(`${STRAPI_URL}/api/users`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        username,
        email,
        password: `Clerk_${user.id}_${Date.now()}!`,
        confirmed: true,
        blocked: false,
        clerkId: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageUrl || '',
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error(`❌ Strapi create failed (${createRes.status}): ${errText}`);

      // Race condition: another request may have just created the user — try fetching again
      const retry = await findByClerkId(user.id) || (email ? await findByEmail(email) : null);
      if (retry) return retry;

      return null;
    }

    return createRes.json();
  } catch (error) {
    console.error('❌ checkUser error:', error.message);
    return null;
  }
};
