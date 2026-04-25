import { currentUser } from '@clerk/nextjs/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  if (!STRAPI_API_TOKEN) {
    console.error('❌ STRAPI_API_TOKEN is missing');
    return null;
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
  };

  try {
    // 1. Try find by clerkId
    const byClerkId = await fetch(
      `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${user.id}`,
      { headers: authHeaders, cache: 'no-store' }
    );
    if (byClerkId.ok) {
      const found = await byClerkId.json();
      if (Array.isArray(found) && found.length > 0) return found[0];
    }

    // 2. Try find by email (user may exist without clerkId)
    const email = user.emailAddresses[0]?.emailAddress;
    if (email) {
      const byEmail = await fetch(
        `${STRAPI_URL}/api/users?filters[email][$eq]=${encodeURIComponent(email)}`,
        { headers: authHeaders, cache: 'no-store' }
      );
      if (byEmail.ok) {
        const found = await byEmail.json();
        if (Array.isArray(found) && found.length > 0) {
          const existing = found[0];
          // Patch clerkId onto the existing user so future lookups are fast
          await fetch(`${STRAPI_URL}/api/users/${existing.id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ clerkId: user.id }),
          });
          return existing;
        }
      }
    }

    // 3. Create new user
    const username = (
      user.username ||
      email?.split('@')[0] ||
      `user_${Date.now()}`
    ).replace(/[^a-zA-Z0-9_]/g, '_');

    const createRes = await fetch(`${STRAPI_URL}/api/users`, {
      method: 'POST',
      headers: authHeaders,
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
      console.error(`❌ Strapi user creation failed (${createRes.status}):`, errText);
      console.error('❌ Strapi URL:', STRAPI_URL);
      console.error('❌ Clerk ID:', user.id, '| Email:', email);
      return null;
    }

    return createRes.json();
  } catch (error) {
    console.error('❌ checkUser error:', error.message);
    return null;
  }
};
