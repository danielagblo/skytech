# SkyTech Admin Dashboard

A full-featured Next.js admin dashboard for managing SkyTech website content.

## Features

- **Dashboard Overview**: Key metrics and quick actions
- **Pages Management**: Edit page titles, descriptions, and metadata
- **Team Management**: Add, edit, and delete team members with avatars
- **Services Management**: Manage service offerings with icons and descriptions
- **Testimonials**: Add and manage client testimonials with ratings
- **Settings**: Configure site-wide contact information and metadata

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Hooks

## Getting Started

### Installation

```bash
cd admin
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
admin/
├── app/
│   ├── layout.tsx              # Main layout with sidebar
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   └── dashboard/
│       ├── page.tsx            # Dashboard overview
│       ├── pages/              # Pages management
│       ├── team/               # Team management
│       ├── services/           # Services management
│       ├── testimonials/        # Testimonials management
│       └── settings/           # Site settings
├── components/                 # Reusable components (future)
├── lib/                        # Utility functions (future)
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Features Included

### 1. Dashboard
- Overview of all content sections
- Quick action cards
- Navigation to all management pages

### 2. Pages Management
- View all website pages
- Edit page titles and descriptions
- Track last update time

### 3. Team Management
- Add new team members
- Edit existing profiles
- Delete members
- Upload profile pictures via URL

### 4. Services Management
- Create and manage service offerings
- Add descriptions and emoji icons
- Full CRUD operations

### 5. Testimonials
- Add client testimonials
- Star ratings
- Client company information

### 6. Site Settings
- Contact email and phone
- WhatsApp number
- Physical address
- Site name and description

## Future Enhancements

- [ ] Authentication & authorization
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] File upload for images
- [ ] Content versioning & rollback
- [ ] User permissions & roles
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] SEO management tools

## Notes

Currently, all data is stored in client-side state. For production use, integrate with a backend database (Firebase, Supabase, MongoDB, etc.)

## License

Proprietary - SkyTech
