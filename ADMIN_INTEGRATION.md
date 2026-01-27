# Admin Dashboard Integration Guide

## Overview
The SkyTech admin dashboard (Next.js) is now fully connected to the public site (Vite/React). All content changes made in the admin dashboard are automatically reflected on the public website.

## Architecture

### Admin Dashboard
- **Location**: `/admin` directory
- **Framework**: Next.js 14 with TypeScript
- **Port**: `http://localhost:3000`
- **Features**: Full CRUD for Team, Services, Testimonials, and Site Settings

### Public Site
- **Location**: `/src` directory  
- **Framework**: Vite + React 18
- **Port**: `http://localhost:5173`
- **Features**: Marketing pages that display content from admin

### Data Layer
- **Location**: `/shared-data` directory
- **Files**:
  - `team.json` - Team member profiles
  - `services.json` - Service offerings
  - `testimonials.json` - Client testimonials
  - `settings.json` - Site configuration (name, contact info, etc.)

### API Routes
Located in `/admin/app/api/content/`:
- `GET /api/content/team` - Fetch all team members
- `POST /api/content/team` - Save team members
- `GET /api/content/services` - Fetch all services
- `POST /api/content/services` - Save services
- `GET /api/content/testimonials` - Fetch all testimonials
- `POST /api/content/testimonials` - Save testimonials
- `GET /api/content/settings` - Fetch site settings
- `POST /api/content/settings` - Save site settings

## How It Works

### Admin Dashboard Workflow
1. Open admin dashboard at `http://localhost:3000`
2. Navigate to management pages (Team, Services, Testimonials, Settings)
3. Add, edit, or delete content
4. Changes are automatically saved to JSON files via API routes
5. Public site reads from these same JSON files

### Public Site Workflow
1. Public site loads at `http://localhost:5173`
2. Pages fetch data from admin API endpoints on mount
3. Content displays dynamically from shared JSON files
4. Refresh the page to see latest admin changes

## Running Both Projects

### Start Admin Dashboard:
```bash
cd admin
npm run dev
# Runs on http://localhost:3000
```

### Start Public Site:
```bash
npm run dev
# Runs on http://localhost:5173
```

**Important**: Both must be running for the integration to work!

## Admin Dashboard Pages

### Overview (`/dashboard`)
- Stats summary
- Quick access to all sections

### Team Management (`/dashboard/team`)
- Add/edit/delete team members
- Fields: Name, Role, Focus, Avatar URL

### Services Management (`/dashboard/services`)
- Manage service offerings
- Fields: Name, Category, Description, Icon (emoji)

### Testimonials Management (`/dashboard/testimonials`)
- Client testimonials
- Fields: Author, Company, Quote, Rating (1-5 stars)

### Settings (`/dashboard/settings`)
- Site configuration
- Fields: Site Name, Description, Email, Phone, WhatsApp, Address

## Public Site Pages

### Home (`/`)
- Displays testimonials from `testimonials.json`
- Dynamic content loading

### Services (`/services`)
- Lists all services from `services.json`
- Filterable by category

### Contact (`/contact`)
- Shows contact info from `settings.json`
- Displays team members from `team.json`
- Contact form (frontend only)

### About (`/about`)
- Static content (not currently connected to admin)

## Development Tips

### Making Changes in Admin
1. Edit content in admin dashboard
2. Changes save automatically
3. Refresh public site to see updates
4. No need to restart servers

### Testing the Integration
1. Add a new team member in admin
2. Go to public Contact page
3. Refresh to see the new team member

### Troubleshooting

**Public site shows old data:**
- Make sure admin dashboard is running on port 3000
- Check browser console for API errors
- Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

**Changes not saving:**
- Check admin dashboard console for errors
- Verify JSON files in `/shared-data/` are writable
- Check API route responses in Network tab

**CORS errors:**
- Both servers must be running
- Admin on port 3000, public on port 5173
- Next.js handles CORS automatically

## Data Persistence

All data is persisted in JSON files in the `/shared-data/` directory:
- File-based (no database needed)
- Human-readable format
- Easy to backup/version control
- Suitable for small to medium content volumes

## Future Enhancements

Potential improvements:
- Real-time updates (websockets)
- Image upload functionality
- Database integration (PostgreSQL, MongoDB)
- User authentication for admin
- Content versioning/history
- Draft/publish workflow
- API rate limiting
- Cache invalidation strategy
