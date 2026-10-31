# CampusKart

Hyperlocal campus-commerce for college students and nearby vendors.

**First campus:** CGC University, Mohali.

CampusKart connects students with kirana stores, printing shops, thrift stores, mithai shops, gift shops, and local service providers around campus. This codebase is a production-ready Next.js 14 App Router foundation with Tailwind CSS, TypeScript, and Supabase for database, authentication, and storage.

Payment gateway integration is intentionally not included.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Postgres, Storage)
- Vercel-ready deployment

## Folder structure

```text
src/
  app/                 App Router pages and layouts
  components/
    layout/            Navbar, Footer, Container
    ui/                Button, Card, Input, Badge, EmptyState
    vendors/           Vendor cards and add-to-cart
    auth/              Shared login form
    providers/         Cart context
  data/                CGC Mohali seed catalog used before Supabase is filled
  lib/
    supabase/          Browser, server, middleware, and storage helpers
  types/               Shared TypeScript types
supabase/
  migrations/          SQL schema, RLS, and first-campus seed
```

## Local setup

1. Install Node.js 18+ (LTS recommended).
2. Copy environment variables:

```bash
copy .env.example .env.local
```

On macOS/Linux use `cp .env.example .env.local`.

3. Fill in your Supabase values in `.env.local`.
4. Install dependencies and start the app:

```bash
npm install
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

The UI works with the local CGC Mohali catalog even before Supabase is fully configured. Vendor and admin login require real Supabase credentials.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes for auth/data | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes for auth/data | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server jobs only | Never expose in the browser |
| `NEXT_PUBLIC_SITE_URL` | Yes for auth redirects | `http://localhost:3000` locally, your Vercel URL in production |

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/00001_init.sql` in the SQL editor.
3. Enable Email auth.
4. Create a public Storage bucket named `vendor-assets` for vendor photos.
5. Create users in Authentication, then set `profiles.role` to `student`, `vendor`, or `admin`.

Auth redirects should allow:

- `http://localhost:3000/auth/callback`
- `https://<your-vercel-domain>/auth/callback`

## Scripts

```bash
npm run dev      # local development
npm run build    # production build
npm run start    # serve the production build
npm run lint     # Next.js ESLint
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add the same environment variables.
4. Deploy.

Framework preset: **Next.js**. No payment provider is required for this release.

## What to test in the browser

- Home page copy for CGC University, Mohali
- Navbar links: Home, Vendors, Cart, Orders, Vendor Login, Admin
- Mobile menu on a narrow viewport
- Vendor filters and vendor detail pages
- Add to cart, quantity updates, COD place-order flow
- Orders list after placing a local COD order
- Vendor and admin login forms (expect a missing-env message until `.env.local` is filled)
