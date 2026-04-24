# Blogify — Complete Setup Guide

This guide walks you through setting up Blogify from scratch, including all API keys and deployment.

---

## Prerequisites

- Node.js 20+ installed
- Git installed
- GitHub account
- Terminal/command line access

---

## Step 1: Clone & Install

```bash
# Clone your repo (or use this folder)
cd blogify

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Step 2: Generate Strapi Secrets

Strapi needs cryptographic secrets. Generate them using Node.js:

```bash
# Run this command 5 times to generate 5 different secrets
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

You'll use these for:
1. `APP_KEYS` (comma-separated, need 4 keys)
2. `API_TOKEN_SALT`
3. `ADMIN_JWT_SECRET`
4. `TRANSFER_TOKEN_SALT`
5. `JWT_SECRET`

---

## Step 3: Backend Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
HOST=0.0.0.0
PORT=1337

# Paste your generated secrets here
APP_KEYS="key1_from_step2,key2_from_step2,key3_from_step2,key4_from_step2"
API_TOKEN_SALT=secret_from_step2
ADMIN_JWT_SECRET=secret_from_step2
TRANSFER_TOKEN_SALT=secret_from_step2
JWT_SECRET=secret_from_step2

# For local dev, use SQLite (default)
DATABASE_CLIENT=sqlite

# Cloudinary (get from https://cloudinary.com)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## Step 4: Start Backend & Create Admin

```bash
cd backend
npm run dev
```

1. Open [http://localhost:1337/admin](http://localhost:1337/admin)
2. Create your admin account (first time only)
3. Go to **Settings → API Tokens → Create new token**
   - Name: `blogify-frontend`
   - Type: `Full access`
   - Copy the token (you'll need it for frontend)

---

## Step 5: Get Clerk Keys

1. Go to [clerk.com](https://clerk.com) → Sign up
2. Create new application → name it **Blogify**
3. Dashboard → **API Keys**
4. Copy:
   - `Publishable key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `Secret key` → `CLERK_SECRET_KEY`

---

## Step 6: Frontend Environment Variables

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
# Backend URL
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Strapi API token (from Step 4)
STRAPI_API_TOKEN=paste_your_token_here

# Clerk keys (from Step 5)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk redirect URLs (keep as-is for local dev)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Unsplash (optional, for cover image search)
UNSPLASH_ACCESS_KEY=your_unsplash_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 7: Start Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the Blogify homepage!

---

## Step 8: Test the App

### Manual Testing
1. Click **Get Started** → Sign up with Clerk
2. Go to **Dashboard** → **New Post**
3. Create a blog post
4. View it on the blog page
5. Edit and delete it

### Automated Testing

**Unit tests:**
```bash
cd frontend
npm test
```

**E2E tests (make sure app is running first):**
```bash
cd frontend
npm run test:e2e
```

---

## Step 9: Deploy to Production

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variables (same as `backend/.env`)
6. Create a **PostgreSQL** database on Render:
   - **New → PostgreSQL**
   - Copy the **External Database URL**
   - Add to your web service:
     - `DATABASE_CLIENT=postgres`
     - `DATABASE_URL=<paste_url_here>`
     - `DATABASE_SSL=true`
7. Deploy!
8. Copy your backend URL (e.g., `https://blogify-backend.onrender.com`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js
4. Add environment variables:
   - `NEXT_PUBLIC_STRAPI_URL` → your Render backend URL
   - `STRAPI_API_TOKEN` → from Strapi admin
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → from Clerk
   - `CLERK_SECRET_KEY` → from Clerk
   - `NEXT_PUBLIC_APP_URL` → your Vercel URL (e.g., `https://blogify.vercel.app`)
   - `UNSPLASH_ACCESS_KEY` → (optional)
5. Deploy!

### Update Clerk URLs

After deploying to Vercel:
1. Go to Clerk dashboard → **Paths**
2. Update redirect URLs to use your production domain

---

## Step 10: GitHub Actions CI

Add these secrets in **GitHub → Settings → Secrets → Actions**:

- `NEXT_PUBLIC_STRAPI_URL` → your Render backend URL
- `STRAPI_API_TOKEN` → from Strapi
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → from Clerk
- `CLERK_SECRET_KEY` → from Clerk
- `NEXT_PUBLIC_APP_URL` → your Vercel URL

Now every push to `main` will:
1. Run Jest unit tests
2. Run Playwright E2E tests
3. Only deploy if all tests pass ✅

---

## Video Walkthrough Outline

For your submission video, cover:

1. **Project Overview** (1 min)
   - Show the live site
   - Explain the tech stack

2. **Local Setup** (2 min)
   - Show `.env` files
   - Start backend and frontend
   - Create a test post

3. **Automation Testing** (3 min)
   - Run `npm test` (Jest unit tests)
   - Run `npx playwright test --ui` (show E2E tests running)
   - Show Playwright HTML report: `npx playwright show-report`
   - Explain what each test does

4. **Deployment** (2 min)
   - Show Render backend dashboard
   - Show Vercel frontend dashboard
   - Show GitHub Actions workflow passing

5. **Features Demo** (2 min)
   - CRUD operations (create, edit, delete post)
   - Search and filter
   - Responsive design (resize browser)
   - SEO (show sitemap.xml, robots.txt)

---

## Troubleshooting

### Backend won't start
- Check `backend/.env` has all required secrets
- Delete `backend/.tmp` folder and restart

### Frontend can't connect to backend
- Make sure `NEXT_PUBLIC_STRAPI_URL` is correct
- Check CORS settings in `backend/config/middlewares.js`

### Tests failing
- Make sure app is running on `localhost:3000`
- Check `PLAYWRIGHT_BASE_URL` in `playwright.config.js`

### Deployment issues
- Check environment variables are set correctly
- Check build logs for errors
- Make sure `DATABASE_CLIENT=postgres` on Render

---

## Support

For issues, check:
- [Strapi Docs](https://docs.strapi.io)
- [Next.js Docs](https://nextjs.org/docs)
- [Playwright Docs](https://playwright.dev)
- [Clerk Docs](https://clerk.com/docs)

Good luck! 🚀
