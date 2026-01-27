# Two-Port Development Setup

While a true single-port solution requires complex reverse-proxy middleware, the recommended approach is to run both servers simultaneously on separate ports. This is cleaner, more reliable, and is how most modern full-stack apps work.

## Why Two Ports?

- **Admin (Next.js):** Port 3000 — handles API routes that Vite fetches from
- **Public Site (Vite):** Port 5173 — the marketing site that loads dynamic content

Both communicate via the `/api/content/*` routes, which only work when the Next.js server is running.

## Quick Start (Recommended)

Run both servers with a single command:

```bash
./dev.sh
```

This starts:
- Admin Dashboard at `http://localhost:3000`
- Public Site at `http://localhost:5173`

Press `Ctrl+C` to stop both.

## Manual Setup (Two Terminals)

**Terminal 1 - Admin Dashboard:**
```bash
cd admin
npm run dev
```

**Terminal 2 - Public Site:**
```bash
npm run dev
```

Both must be running for:
- Admin dashboard to function (it fetches from `/api/content/*`)
- Public site to display dynamic content (it fetches from admin API)

## Accessing the Sites

| Site | URL | Purpose |
|------|-----|---------|
| Admin | `http://localhost:3000` | Manage team, services, testimonials, settings |
| Public | `http://localhost:5173` | View marketing website with live content |

## What Happens If Only One Server Runs?

| Server | Issue |
|--------|-------|
| **Admin only** | Public site can't fetch content; shows spinners |
| **Public only** | Admin dashboard loads but API calls fail (404 errors) |

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Next.js       │         │  Vite            │
│   Port 3000     │         │  Port 5173       │
│                 │         │                  │
│  Admin UI       │         │  Public UI       │
│  API Routes     │ ◄──────►│ API Fetcher      │
│  /api/content/* │         │                  │
│                 │         │  /src/utils/api  │
└────────┬────────┘         └──────────────────┘
         │
         ▼
   ┌──────────────┐
   │  /shared-data│
   │  JSON Files  │
   └──────────────┘
```

## Stopping Servers

If servers keep running in background:
```bash
# Kill all npm/node dev processes
pkill -f "npm run dev"
pkill -f "next dev"
pkill -f "vite"

# Or kill specific ports
lsof -ti:3000 | xargs kill -9   # Admin
lsof -ti:5173 | xargs kill -9   # Public
```

## Future: True Single-Port (Advanced)

A reverse proxy (nginx, ha-proxy) or a wrapper server could tunnel both under one port, but:
- Adds deployment complexity
- Not needed for development
- Makes local debugging harder

For now, two ports is the pragmatic solution.
