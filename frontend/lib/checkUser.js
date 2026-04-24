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

  try {
    // Check if user already exists in Strapi
    const existingRes = await fetch(
      `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${user.id}`,
      {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        cache: 'no-store',
      }
    );

    if (!existingRes.ok) {
      console.error('Strapi error:', await existingRes.text());
      return null;
    }

    const existingUsers = await existingRes.json();

    if (existingUsers.length > 0) {
      return existingUsers[0];
    }

    // Get the authenticated role ID
    const rolesRes = await fetch(`${STRAPI_URL}/api/users-permissions/roles`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    });
    const rolesData = await rolesRes.json();
    const authenticatedRole = rolesData.roles?.find((r) => r.type === 'authenticated');

    // Create new user in Strapi
    const newUserRes = await fetch(`${STRAPI_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        username: user.username || user.emailAddresses[0].emailAddress.split('@')[0],
        email: user.emailAddresses[0].emailAddress,
        password: `clerk_${user.id}_${Date.now()}`,
        confirmed: true,
        blocked: false,
        role: authenticatedRole?.id,
        clerkId: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageUrl || '',
      }),
    });

    if (!newUserRes.ok) {
      console.error('❌ Error creating user:', await newUserRes.text());
      return null;
    }

    return newUserRes.json();
  } catch (error) {
    console.error('❌ checkUser error:', error.message);
    return null;
  }
};
