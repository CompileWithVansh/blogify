import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(req) {
  // Must be signed in
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Forward to Strapi upload
    const strapiForm = new FormData();
    strapiForm.append('files', file);

    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: strapiForm,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Strapi upload error:', err);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const data = await res.json();
    const uploaded = Array.isArray(data) ? data[0] : data;
    const url = uploaded?.url?.startsWith('http')
      ? uploaded.url
      : `${STRAPI_URL}${uploaded.url}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error('Upload route error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
