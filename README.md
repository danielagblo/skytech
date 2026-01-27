# SkyTech Website (React + Vite)

Responsive marketing site for SkyTech, a software development company. Built with Vite, React Router, Tailwind CSS, and React Helmet for SEO-friendly pages.

## Features
- Multi-page layout: Home, About, Services, Contact
- Responsive design with Tailwind CSS
- SEO meta tags per page using React Helmet
- Accessible navigation with mobile menu

## Getting Started
1. Install dependencies:
	- `npm install`
2. Run the dev server:
	- `npm run dev`
3. Build for production:
	- `npm run build`
4. Preview the production build:
	- `npm run preview`

## Project Structure
- `/src/components` — shared UI (Header, Footer)
- `/src/pages` — page screens (Home, About, Services, Contact)
- `/src/index.css` — Tailwind directives and base styles
- `/src/App.jsx` — routes and layout shell

## Notes
- Tailwind is configured via `tailwind.config.js` with PostCSS setup in `postcss.config.js`.
- Update contact info and links in the Footer and Contact page as needed.
