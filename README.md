# Blogify 📝

> A modern full-stack blog platform — read, write, and share ideas.

**Live URL:** https://blogify-vansh.vercel.app

**GitHub:** https://github.com/CompileWithVansh/blogify

---

## Task Completion Checklist ✅

| Requirement | Status |
|---|---|
| CRUD Operations (Create, Read, Update, Delete posts) | ✅ Done |
| Responsive UI (mobile + desktop) | ✅ Done |
| SEO-friendly structure (metadata, sitemap, robots.txt, OG tags) | ✅ Done |
| Playwright E2E automation tests | ✅ Done |
| Jest unit + integration tests | ✅ Done |
| Deployment on cloud platform (Vercel + Render) | ✅ Done |
| Tests pass before deployment (GitHub Actions CI) | ✅ Done |
| Clean, modern UI | ✅ Done |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router, SSR/SSG) |
| Backend/CMS | Strapi v5 |
| Styling | Tailwind CSS |
| Auth | Clerk |
| Image Storage | Cloudinary |
| Database | PostgreSQL (Render) |
| E2E Testing | Playwright |
| Unit Testing | Jest + React Testing Library |
| CI/CD | GitHub Actions |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
blogify/
├── frontend/                  # Next.js 14 app
│   ├── app/
│   │   ├── (auth)/            # Sign-in / Sign-up pages
│   │   ├── (main)/
│   │   │   ├── page.jsx       # Homepage with hero
│   │   │   ├── blog/          # Blog listing + post detail
│   │   │   ├── blog/create/   # Create post (auth protected)
│   │   │   ├── blog/edit/     # Edit post (auth protected)
│   │   │   └── dashboard/     # User dashboard (auth protected)
│   │   ├── sitemap.js         # Auto-generated sitemap
│   │   └── robots.js          # robots.txt
│   ├── components/            # Reusable UI components
│   ├── actions/               # Next.js server actions (CRUD)
│   ├── lib/                   # strapi.js, utils.js, checkUser.js
│   ├── e2e/                   # Playwright E2E tests
│   │   ├── home.spec.js
│   │   ├── blog.spec.js
│   │   ├── crud.spec.js
│   │   └── seo.spec.js
│   └── __tests__/             # Jest unit tests
│       ├── utils.test.js
│       └── PostCard.test.jsx
│
├── backend/                   # Strapi v5 CMS
│   ├── config/                # DB, CORS, plugins, server config
│   └── src/api/post/          # Post content type (CRUD)
│
└── .github/workflows/         # GitHub Actions CI pipeline
    └── test-and-deploy.yml
```

---

## Features

- ✅ **Create** blog posts with title, content, excerpt, category, tags, cover image
- ✅ **Read** posts — listing page with search + category filter + pagination
- ✅ **Update** posts via edit page
- ✅ **Delete** posts with confirmation
- ✅ **Auth** — Clerk authentication, all write operations require login
- ✅ **SEO** — `generateMetadata`, Open Graph, sitemap.xml, robots.txt
- ✅ **Responsive** — mobile-first Tailwind CSS, tested on mobile viewport
- ✅ **Cover images** — Unsplash auto-search by title
- ✅ **Dashboard** — stats (posts, views, words, read time) + post management
- ✅ **Dark-ready** design system with CSS custom properties

---

## Local Development Setup

### Prerequisites
- Node.js 20+
- A PostgreSQL database (Render/Neon/Supabase — all free)
- Clerk account (free)
- Cloudinary account (free)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd blogify

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Backend environment

```bash
cd backend
cp .env.example .env
```

Fill in `backend/.env`:

```env
HOST=0.0.0.0
PORT=1337

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
APP_KEYS="key1,key2,key3,key4"
API_TOKEN_SALT=<generated>
ADMIN_JWT_SECRET=<generated>
TRANSFER_TOKEN_SALT=<generated>
JWT_SECRET=<generated>

# PostgreSQL connection string
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://user:password@host:5432/dbname
DATABASE_SSL=true

# Cloudinary (cloudinary.com → Dashboard)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

FRONTEND_URL=http://localhost:3000
```

### 3. Start backend

```bash
cd backend
npm run dev
# → http://localhost:1337/admin
```

**First time only — Strapi admin setup:**
1. Open http://localhost:1337/admin → create admin account
2. **Settings → Users & Permissions → Roles → Public** → enable `find`, `findOne` on Post → Save
3. **Settings → Users & Permissions → Roles → Authenticated** → enable all Post actions → Save
4. **Settings → API Tokens → Create new token** → Name: `blogify-frontend`, Type: `Full access` → copy token

### 4. Frontend environment

```bash
cd frontend
cp .env.example .env.local
```

Fill in `frontend/.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=<paste token from step above>

# Clerk (clerk.com → New App → API Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Unsplash (unsplash.com/developers → New Application)
UNSPLASH_ACCESS_KEY=your_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Start frontend

```bash
cd frontend
npm run dev
# → http://localhost:3000
```

---

## Running Tests

### Unit Tests (Jest)

Tests utility functions and React components in isolation.

```bash
cd frontend
npm test
```

Expected output:
```
PASS __tests__/utils.test.js
  formatDate ✓
  truncate ✓
  cn (classnames) ✓
  estimateReadTime ✓

PASS __tests__/PostCard.test.jsx
  PostCard ✓ renders title
  PostCard ✓ renders excerpt
  PostCard ✓ renders category badge
  PostCard ✓ renders link to post
  PostCard ✓ renders read time

Test Suites: 2 passed
Tests:       9 passed
```

### E2E Tests (Playwright)

Playwright runs against the **live production URL** (`https://blogify-vansh.vercel.app`) by default — no local server needed.

**Install browsers (first time only):**
```bash
cd frontend
npx playwright install --with-deps chromium
```

**Run all E2E tests (headless):**
```bash
cd frontend
npm run test:e2e
```

**Run with visible browser (best for demo video):**
```bash
cd frontend
npx playwright test --headed --project=chromium
```

**Run with interactive UI mode:**
```bash
cd frontend
npm run test:e2e:ui
```

**View HTML report after run:**
```bash
cd frontend
npm run test:e2e:report
```

**Run against localhost instead of production:**
```bash
cd frontend
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e
```

**What each test file covers:**

| File | Tests |
|---|---|
| `e2e/home.spec.js` | Hero section, navbar, CTA buttons, mobile responsive |
| `e2e/blog.spec.js` | Blog listing, search, category filter, 404 handling |
| `e2e/crud.spec.js` | Auth redirects, create/edit/delete (with auth state) |
| `e2e/seo.spec.js` | Meta tags, sitemap.xml, robots.txt, h1 headings |

The HTML report opens at `http://localhost:9323` and shows all passed/failed tests with screenshots and traces.

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. [render.com](https://render.com) → **New → Web Service**
3. Connect repo → Root Directory: `backend`
4. Build: `npm install && npm run build`
5. Start: `npm start`
6. **New → PostgreSQL** → copy External Database URL
7. Add env vars (from `backend/.env.example`)
8. Set `DATABASE_URL` to your Postgres URL, `DATABASE_SSL=true`
9. Deploy → copy your backend URL (e.g. `https://blogify-backend.onrender.com`)

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → **New Project**
2. Connect repo → Root Directory: `frontend`
3. Add env vars (from `frontend/.env.example`)
4. Set `NEXT_PUBLIC_STRAPI_URL` to your Render backend URL
5. Set `NEXT_PUBLIC_APP_URL` to your Vercel URL
6. Deploy

### GitHub Actions CI (auto-runs tests before deploy)

Add these secrets in **GitHub → Settings → Secrets → Actions**:

```
NEXT_PUBLIC_STRAPI_URL
STRAPI_API_TOKEN
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_APP_URL
```

Every push to `main` will:
1. Run Jest unit tests
2. Run Playwright E2E tests
3. Only deploy if all pass ✅

---

## Video Demo Script

For your submission video explaining automation testing:

1. **Intro** (30s) — Show the live site, explain it's a full-stack blog with automated testing

2. **Show test files** (1min) — Open `e2e/` folder, explain what each spec tests

3. **Run Jest unit tests** (1min)
   ```bash
   cd frontend && npm test
   ```
   Show all tests passing in terminal

4. **Run Playwright headed** (2min)
   ```bash
   cd frontend
   npx playwright test --headed --project=chromium
   ```
   Show the browser opening, navigating, clicking — fully automated

5. **Show HTML report** (1min)
   ```bash
   cd frontend
   npm run test:e2e:report
   ```
   Show the visual report with green checkmarks

6. **Show GitHub Actions** (1min) — Go to GitHub → Actions tab, show the CI pipeline passing

7. **Show live deployment** (30s) — Open the Vercel URL, show it's live

---

## API Keys — How to Get Them

| Key | Service | Steps |
|---|---|---|
| `STRAPI_API_TOKEN` | Self-hosted | Strapi Admin → Settings → API Tokens → Create |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [clerk.com](https://clerk.com) | New App → API Keys → Publishable key |
| `CLERK_SECRET_KEY` | [clerk.com](https://clerk.com) | New App → API Keys → Secret key |
| `CLOUDINARY_NAME/KEY/SECRET` | [cloudinary.com](https://cloudinary.com) | Sign up → Dashboard |
| `UNSPLASH_ACCESS_KEY` | [unsplash.com/developers](https://unsplash.com/developers) | New Application → Access Key |
| `DATABASE_URL` | [render.com](https://render.com) | New PostgreSQL → External Database URL |
