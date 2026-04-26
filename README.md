# Blogify

A modern full-stack blog platform built with **Next.js 14**, **Strapi v5 (Cloud)**, and **Clerk** authentication. Deployed on **Vercel** (frontend) and **Strapi Cloud** (backend).

## Tech Stack

- **Frontend** — Next.js 14 (App Router), Tailwind CSS, Clerk Auth
- **Backend** — Strapi v5 (Cloud), PostgreSQL
- **Storage** — Cloudinary (image uploads)
- **Deployment** — Vercel (frontend), Strapi Cloud (backend)

## Features

### User
- Sign up / Sign in via Clerk
- Create, edit, delete your own blog posts
- Upload cover images from device or auto-search via Unsplash
- Search & filter posts by category
- Personal dashboard with stats (posts, views, words, read time)
- Share posts, view count tracking

### Admin
- Admin panel at `/admin` (restricted to admins only)
- Overview dashboard with site-wide stats
- Manage all posts — delete, feature/unfeature, search
- Manage all users — grant/revoke admin, block/unblock, search
- Delete any post directly while reading it (inline moderation)

### Super Admin
- Full power: edit any post, all admin capabilities
- Fixed role — cannot be demoted or blocked
- Set via `SUPER_ADMIN_EMAIL` environment variable

## Environment Variables

### Frontend (`.env`)

```env
NEXT_PUBLIC_STRAPI_URL=
STRAPI_API_TOKEN=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
UNSPLASH_ACCESS_KEY=
NEXT_PUBLIC_APP_URL=
SUPER_ADMIN_EMAIL=your@email.com
```

## Getting Started

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run develop
```

Frontend runs on `http://localhost:3000`, Strapi admin on `http://localhost:1337/admin`.
