import { currentUser } from '@clerk/nextjs/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  if (!STRAPI_API_TOKEN) {
    console.error('❌ STRAPI_API_TOKEN is missing — add it to your Vercel environment variables');
    return null;
  }

  if (!STRAPI_URL || STRAPI_URL === 'http://localhost:1337') {
    console.warn('⚠️ NEXT_PUBLIC_STRAPI_URL is localhost — this will fail in production. Set it to your deployed Strapi URL.');
  }

  try {
    // Check if user already exists in Strapi by clerkId
    const existingRes = await fetch(
      `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${user.id}`,
      {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        cache: 'no-store',
      }
    );

    if (existingRes.ok) {
      const existingUsers = await existingRes.json();
      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return existingUsers[0];
      }
    }

    // Create new user — skip role lookup, Strapi assigns default role
    const username = (user.username ||
      user.emailAddresses[0]?.emailAddress?.split('@')[0] ||
      `user_${Date.now()}`).replace(/[^a-zA-Z0-9_]/g, '_');

    const newUserRes = await fetch(`${STRAPI_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        username,
        email: user.emailAddresses[0]?.emailAddress,
        password: `Clerk_${user.id}_${Date.now()}!`,
        confirmed: true,
        blocked: false,
        clerkId: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageUrl || '',
      }),
    });

    if (!newUserRes.ok) {
      const errText = await newUserRes.text();
      console.error(`❌ Error creating Strapi user (status ${newUserRes.status}):`, errText);
      console.error('❌ Strapi URL used:', STRAPI_URL);
      console.error('❌ Clerk user ID:', user.id, '| Email:', user.emailAddresses[0]?.emailAddress);
      // If user creation fails (e.g. already exists with different filter), try fetching by email
      const emailRes = await fetch(
        `${STRAPI_URL}/api/users?filters[email][$eq]=${user.emailAddresses[0]?.emailAddress}`,
        { headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` }, cache: 'no-store' }
      );
      if (emailRes.ok) {
        const emailUsers = await emailRes.json();
        if (Array.isArray(emailUsers) && emailUsers.length > 0) return emailUsers[0];
      }
      return null;
    }

    return newUserRes.json();
  } catch (error) {
    console.error('❌ checkUser error:', error.message);
    return null;
  }
};
