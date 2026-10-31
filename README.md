# Simon.dev — v3

SimonPeter's portfolio, rebuilt as a full-stack Next.js app: content lives in a database and is
managed from a protected admin dashboard.

> The previous static site (vanilla HTML/CSS/JS on GitHub Pages) lives on the `master` branch.

## Stack

| Layer     | Tech                                                                     |
| --------- | ------------------------------------------------------------------------ |
| Framework | Next.js 14 (App Router) · TypeScript · React Server Components           |
| UI        | Tailwind CSS · shadcn/ui · Framer Motion · next-themes · lucide icons    |
| Forms     | React Hook Form + Zod (same schemas validate on the client and server)   |
| Data      | Prisma ORM · SQLite locally · PostgreSQL (Neon / Supabase) in production |
| Auth      | NextAuth.js — email/password (bcrypt) and optional GitHub OAuth          |
| Email     | Resend (contact form notifications)                                      |
| Uploads   | Cloudinary (falls back to `public/uploads` in development)               |
| Tooling   | ESLint · Prettier (+ Tailwind plugin) · Husky + lint-staged              |

## Features

- **Home**: animated hero with promo video, featured projects pulled from the DB, services, CTA
- **Projects**: grid filterable by tech stack (`?tech=React`), `/projects/[slug]` case studies in Markdown
- **About**: bio, skills grouped by category, experience timeline, downloadable resume
- **Blog**: DB-backed Markdown posts, tag pages, reading time, per-post SEO metadata
- **Contact**: Zod-validated form → saved to DB + emailed via Resend, rate-limited, honeypot, toasts
- **Admin** (`/admin`): CRUD for projects, posts, skills and experience; image uploads; inbox for contact messages
- **SEO**: Metadata API, generated Open Graph image, JSON-LD, `sitemap.xml`, `robots.txt`
- **Accessibility**: semantic HTML, skip link, keyboard-friendly nav, ARIA labels, reduced-motion support, AA contrast
- Dark / light mode (persisted)

## Getting started

```bash
npm install                 # also generates the Prisma client
cp .env.example .env.local  # then fill in the values (see below)
npm run db:push             # create the tables
npm run db:seed             # load starting content
npm run dev                 # http://localhost:3000
```

Create your admin password hash and paste the `.env.local` line it prints (the `$` signs are escaped, because Next.js would otherwise expand them):

```bash
npm run hash-password -- "a-long-unique-password"
```

Then sign in at <http://localhost:3000/admin>.

## Database: SQLite locally, Postgres in production

`scripts/prisma.mjs` loads `.env.local` and switches the Prisma datasource provider to match
`DATABASE_URL` (`file:` → SQLite, `postgresql://` → PostgreSQL) before running any Prisma command.
All `db:*` scripts and the build go through it, so there's no second schema to maintain.

## Scripts

| Script                  | What it does                                 |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Dev server                                   |
| `npm run build`         | Generate Prisma client + production build    |
| `npm run lint`          | ESLint                                       |
| `npm run typecheck`     | TypeScript, no emit                          |
| `npm run format`        | Prettier                                     |
| `npm run db:push`       | Sync the schema to the database              |
| `npm run db:seed`       | Seed / refresh starting content (idempotent) |
| `npm run db:studio`     | Prisma Studio                                |
| `npm run hash-password` | bcrypt hash for `ADMIN_PASSWORD_HASH`        |

A Husky pre-commit hook runs ESLint and Prettier on staged files.

## Deploying to Vercel + Neon

1. Import the GitHub repo in [Vercel](https://vercel.com/new).
2. In the project's **Storage** tab, add a **Neon** Postgres database — it sets `DATABASE_URL` for you
   (or paste a connection string from Neon / Supabase yourself).
3. Add the other environment variables from `.env.example`: `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_URL`
   (both your production URL), `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (the raw hash, no
   backslashes), and optionally Resend, Cloudinary and GitHub OAuth keys.
4. Deploy. Vercel runs `npm run vercel-build`, which creates/updates the tables (`prisma db push`),
   seeds the starter content **only if the database is empty**, then builds.

To reset the starter content later: `npm run db:seed -- --force` (overwrites the seeded projects and skills).

For GitHub login, create an OAuth app with callback URL `https://<your-domain>/api/auth/callback/github`
and set `ADMIN_GITHUB_USERNAME` to the only account allowed in.

## Project structure

```
prisma/            schema.prisma, seed.ts
scripts/           prisma.mjs (env + provider switch), hash-password.mjs
src/app/(site)/    public pages: home, projects, about, blog, contact
src/app/admin/     login, dashboard (CRUD) and server actions
src/app/api/       contact, upload, auth routes
src/components/    ui/ (shadcn), admin/, site components
src/lib/           db, auth, queries, validations, email, upload, rate-limit
```

_Dream in code. Build in life._
