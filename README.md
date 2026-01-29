# SkyTech — Admin Site (Next.js)

This repository hosts the production Next.js admin application used to manage the public site and content. The application lives in the `admin/` folder and uses the Next.js App Router, Tailwind CSS, and simple file-backed APIs.

Quick start

1. Open a terminal in the admin folder:

```powershell
cd D:\Project\nextjs\skytech\admin
```

2. Install dependencies (once):

```powershell
npm install
```

3. Start the dev server (clears stale build artifacts automatically if needed):

```powershell
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run dev
```

Environment

- Configure admin credentials in `admin/.env.local`: set `ADMIN_USER` and `ADMIN_PASSWORD`.

Important scripts (run from `admin/`)

- `npm run dev` — start Next.js dev server
- `npm run build` — build for production
- `npm start` / host-specific scripts — see `admin/package.json` for details

Data and uploads

- `shared-data/` — JSON files used by APIs (contact submissions, services, team, testimonials, settings).
- `public/uploads/` — persisted uploaded files.

Where to look in the codebase

- `admin/app/` — app router pages and API routes
- `admin/components/` — shared client components
- `admin/middleware.ts` — route protection and redirects
- `admin/app/api/` — API endpoints that read/write `shared-data/`

If you want help removing unused files or simplifying the repository layout, tell me which areas to clean and I’ll perform the deletions.
