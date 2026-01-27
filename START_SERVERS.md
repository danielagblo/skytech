# How to Start Both Servers

## The admin dashboard is NOT static - it requires the Next.js dev server running!

### Terminal 1: Start Admin Dashboard
```bash
cd admin
npm run dev
```
**Admin runs on:** `http://localhost:3000`

### Terminal 2: Start Public Site  
```bash
npm run dev
```
**Public site runs on:** `http://localhost:5173`

---

## Why Both Servers Are Needed

The admin dashboard uses **Next.js API Routes** that only work when the development server is running:
- `/api/content/team`
- `/api/content/services`
- `/api/content/testimonials`
- `/api/content/settings`

The public site fetches data from these API endpoints. Without the admin server running, the API calls will fail.

## What Happens When Admin Server Is Not Running

❌ Admin pages will show loading spinners forever  
❌ Public site won't load dynamic content (team, services, testimonials, settings)  
❌ Changes made in admin won't save  

## Check If Servers Are Running

```bash
# Check admin (port 3000)
lsof -ti:3000

# Check public site (port 5173)
lsof -ti:5173
```

## Quick Start Commands

**Start admin:**
```bash
cd /Users/danielagblo/Downloads/oysloetech/admin && npm run dev
```

**Start public site (in another terminal):**
```bash
cd /Users/danielagblo/Downloads/oysloetech && npm run dev
```

Both must be running simultaneously!
