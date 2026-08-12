# SkyTech — Admin Site (Next.js)

This repository hosts the production Next.js admin application used to manage the public site and content. It uses the Next.js App Router, Tailwind CSS, and a dual-database data layer.

Quick start

1. Install dependencies:

```powershell
npm install
```

2. Start the dev server (clears stale build artifacts automatically if needed):

```powershell
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run dev
```

Environment

- Copy `.env.example` to `.env` and set the values for your environment.
- Configure admin credentials in `.env`: set `ADMIN_PASSWORD`.

## Database & storage switching

The data layer switches between database backends and image storage backends using two env variables.

### `DB_TYPE` — database driver

- `DB_TYPE=mongodb` — uses MongoDB/Mongoose (existing `MONGODB_URI`).
- `DB_TYPE=mysql` — uses MySQL (Hostinger) via the configured `MYSQL_*` variables.

MySQL configuration:

```
DB_TYPE=mysql
MYSQL_HOST=your-hostinger-host
MYSQL_PORT=3306
MYSQL_USER=your-user
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=your-db
```

Supported entities in both backends: hero, pricing, projects, testimonials, team, FAQs, affiliates, blog posts, internship submissions, contact submissions, and analytics.

### `IMAGE_STORAGE` — image backend

- `IMAGE_STORAGE=s3` — images are optimized and stored in S3, served through `/api/images/...`.
- `IMAGE_STORAGE=db` — images are stored directly in the MySQL `images` table as `LONGBLOB` and served through the same `/api/images/...` proxy.

## Setting up MySQL (Hostinger)

1. Create a database in Hostinger hPanel and add the connection details to `.env`.
2. Create the tables (idempotent):

```powershell
npm run migrate
```

3. (Optional) Copy existing data from MongoDB into MySQL:

```powershell
npm run migrate:sync
```

`migrate:sync` connects to `MONGODB_URI` and copies the content collections (hero, pricing, projects, testimonials, team, FAQs, affiliates, blog posts, internship submissions) into the MySQL tables, preserving the existing `_id` values.

3. (Optional) Pull images that were previously stored in S3 into the MySQL `images` table so `IMAGE_STORAGE=db` can serve them without S3:

```powershell
npm run migrate:images
```

The image proxy (`/api/images/...`) supports all three sources in `db` mode, in order:
1. stored row by UUID id (new uploads),
2. stored row by `key_path` (images imported by `migrate:images`),
3. fallback to S3 for legacy images that haven't been migrated yet (only if `S3_BUCKET` is set).

4. Switch the app to MySQL by setting `DB_TYPE=mysql` (and `IMAGE_STORAGE=db` if you want images in the database).

Seeding

- `npm run seed` — seeds pricing
- `npm run seed-hero` — seeds the homepage hero
- `npm run seed-networks` — seeds affiliate/partner logos

The seed scripts honor `DB_TYPE` (they insert into MySQL when `DB_TYPE=mysql`) and `IMAGE_STORAGE` (for partner logos).

Important scripts (run from repo root)

- `npm run dev` — start Next.js dev server
- `npm run build` — build for production

Data and uploads

- `shared-data/` — JSON files used by API routes (contact submissions, analytics, services, pages) when `DB_TYPE` is not `mysql`.
- `public/uploads/` — legacy persisted uploaded files.

Where to look in the codebase

- `app/lib/db.ts` — `DB_TYPE` switch helper
- `app/lib/mysql.ts` — MySQL pool, helpers, and schema
- `app/lib/mongodb.ts` — MongoDB connection
- `app/lib/storage.ts` — image storage switch (`IMAGE_STORAGE`)
- `app/lib/*.ts` — per-entity data-access functions (both backends)
- `app/api/` — API endpoints
- `app/admin/` — server actions