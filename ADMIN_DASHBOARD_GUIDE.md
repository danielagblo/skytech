# SkyTech Admin Dashboard ✨

Complete Next.js admin dashboard for managing all aspects of the SkyTech website.

## 🎯 Quick Start

```bash
cd admin
npm install
npm run dev
```

Then visit: **http://localhost:3000**

## 📊 Dashboard Features

### 1. **Pages Management** (`/dashboard/pages`)
- View all website pages (Home, About, Services, Contact)
- Edit page titles and descriptions in-line
- Track last updated date
- Full CRUD operations

### 2. **Team Management** (`/dashboard/team`)
- Add new team members with photos, roles, and bio
- Edit existing profiles
- Delete team members
- Display team cards with avatars

### 3. **Services Management** (`/dashboard/services`)
- Create/edit/delete service offerings
- Add descriptions and emoji icons
- Manage service details
- Display in card grid format

### 4. **Testimonials** (`/dashboard/testimonials`)
- Add client testimonials with company info
- Star ratings (1-5 stars)
- Edit and delete testimonials
- Display full list with ratings

### 5. **Site Settings** (`/dashboard/settings`)
- Site name and description
- Contact email, phone, WhatsApp
- Physical address
- Global configuration options

### 6. **Dashboard Overview** (`/dashboard`)
- Quick stats cards
- Navigation tiles to all management sections
- View site link
- At-a-glance metrics

## 🏗️ Architecture

```
admin/
├── app/
│   ├── layout.tsx              # Main layout with sidebar + navigation
│   ├── page.tsx                # Landing/home page
│   ├── globals.css             # Tailwind CSS setup
│   └── dashboard/
│       ├── page.tsx            # Dashboard main page
│       ├── pages/page.tsx       # Pages management
│       ├── team/page.tsx        # Team management
│       ├── services/page.tsx    # Services management
│       ├── testimonials/page.tsx # Testimonials management
│       └── settings/page.tsx    # Site settings
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript config
├── next.config.js              # Next.js config
└── package.json
```

## 🎨 Design

- **Sidebar Navigation**: Always visible with active page highlighting
- **Responsive Grid**: Works on mobile, tablet, and desktop
- **Tailwind CSS**: Professional, modern styling
- **Color Scheme**: Slate + Blue gradient theme
- **Interactive Forms**: Inline editing for pages, modal forms for new entries

## 💾 Data Management

Currently, all data is stored in **React client state** (using `useState`). This is perfect for:
- Prototyping and testing
- Learning dashboard development
- Quick internal tools

### For Production, integrate with:
- **Supabase** (PostgreSQL + Auth)
- **Firebase** (Realtime Database)
- **MongoDB + Node.js API**
- **Prisma ORM**

## 🚀 Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Lint code
npm run lint
```

## 📱 Responsive Design

- **Mobile**: Single column, collapsible sidebar (recommended)
- **Tablet**: 2-column grids, full sidebar
- **Desktop**: Full 3+ column layouts

## 🔐 Future Enhancements

- [ ] User authentication (NextAuth.js)
- [ ] Database integration (Supabase/Firebase)
- [ ] File upload for images
- [ ] Drag-and-drop reordering
- [ ] Content versioning & rollback
- [ ] User permissions & roles
- [ ] Email notifications
- [ ] Activity logs
- [ ] Analytics
- [ ] SEO meta management

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.x | Full-stack framework |
| React | 18.x | UI components |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| Autoprefixer | 10.x | CSS vendor prefixes |

## 📚 File Sizes (Optimized)

```
First Load JS:      87.2 kB
Dashboard:          96.9 kB
Pages Section:      88.5 kB
Average Per Page:   ~89 kB
```

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks](https://react.dev/reference/react/hooks)

## 📞 Support

For issues or questions about the admin dashboard:
1. Check the code comments
2. Review component structure
3. Test in development mode (`npm run dev`)
4. Inspect browser DevTools for errors

## 📄 License

Proprietary - SkyTech Inc.

---

**Last Updated**: January 2025
**Status**: Production-ready for development/staging
