import ServicesClient from './ServicesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Our Services - Skytech Ghana',
  description: "Web design, mobile app development, SEO, and website maintenance services in Ghana. We build digital solutions that help your business grow.",
};

export default async function Services() {
  const servicesContent = {
    heroTitle: "Websites, apps, SEO & maintenance — all in one place.",
    heroSubtitle: "We build fast, secure websites and mobile apps. We also help you rank on Google and keep your site running smoothly.",
    engagementTitle: "How We Work.",
    whatWeDoTitle: "What We Build.",
    whatWeDoSubtitle: "From simple business websites to full online stores and mobile apps — we handle the full process."
  };

  return (
    <ServicesClient
      servicesContent={servicesContent}
      whoWeWorkFor={whoWeWorkFor}
      engagements={engagements}
      stack={stack}
    />
  );
}

const engagements = [
  {
    title: 'New Website or App',
    description: 'We build your site or app from scratch. You tell us what you need, and we handle design, development, and launch.',
    items: ['Direct communication with developers', 'Weekly progress updates', 'Training on how to use your site']
  },
  {
    title: 'Fix or Improve an Existing Site',
    description: 'Already have a site? We can redesign it, speed it up, fix issues, or add new features.',
    items: ['Full site audit', 'Performance improvements', 'Feature additions & upgrades']
  },
  {
    title: 'Ongoing Maintenance & SEO',
    description: 'We keep your site secure, fast, and ranking on Google with regular maintenance and SEO work.',
    items: ['Monthly backups & security scans', 'Content updates & edits', 'SEO monitoring & reporting']
  },
];

const stack = [
  { name: 'Next.js', icon: 'https://skillicons.dev/icons?i=nextjs' },
  { name: 'React', icon: 'https://skillicons.dev/icons?i=react' },
  { name: 'Node.js', icon: 'https://skillicons.dev/icons?i=nodejs' },
  { name: 'TypeScript', icon: 'https://skillicons.dev/icons?i=ts' },
  { name: 'Python', icon: 'https://skillicons.dev/icons?i=py' },
  { name: 'Flutter', icon: 'https://skillicons.dev/icons?i=flutter' },
  { name: 'PostgreSQL', icon: 'https://skillicons.dev/icons?i=postgres' },
  { name: 'MongoDB', icon: 'https://skillicons.dev/icons?i=mongodb' },
  { name: 'AWS', icon: 'https://skillicons.dev/icons?i=aws' },
  { name: 'Azure', icon: 'https://skillicons.dev/icons?i=azure' },
  { name: 'DigitalOcean', icon: '/images/digital oceans.png' },
  { name: 'Kubernetes', icon: 'https://cdn.simpleicons.org/kubernetes/326CE5' },
  { name: 'Docker', icon: 'https://skillicons.dev/icons?i=docker' },
  { name: 'Terraform', icon: 'https://skillicons.dev/icons?i=terraform' },
  { name: 'Kafka', icon: 'https://skillicons.dev/icons?i=kafka' },
  { name: 'Linode', icon: '/images/linode.png' },
  { name: 'Railway', icon: 'https://cdn.simpleicons.org/railway/131415' },
  { name: 'GitHub', icon: 'https://skillicons.dev/icons?i=github' },
  { name: 'Arkesel', icon: '/images/arkesel.png' },
  { name: 'Lexical', icon: 'https://lexical.dev/img/logo.svg' },
];

const whoWeWorkFor = [
  {
    name: 'Website Design & Development',
    description: 'Professional business websites, landing pages, and corporate portals that are fast, secure, and mobile-friendly.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    types: ['Web']
  },
  {
    name: 'Mobile App Development',
    description: 'Cross-platform iOS and Android apps built with modern frameworks. Fast, reliable, and user-friendly.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    types: ['Mobile']
  },
  {
    name: 'SEO & Digital Marketing',
    description: 'Get your business on the first page of Google. We handle technical SEO, content, and local search optimization.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    types: ['Web']
  },
  {
    name: 'E-commerce & Online Stores',
    description: 'Full online stores with product management, payment gateways, and order tracking. Sell online with ease.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    types: ['Web']
  },
  {
    name: 'Website Maintenance & Security',
    description: 'Regular backups, security monitoring, updates, and content changes to keep your site safe and up to date.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    types: ['Web']
  },
  {
    name: 'Custom Web Applications',
    description: 'Bespoke dashboards, portals, booking systems, and internal tools tailored to your business processes.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    types: ['Web']
  },
  {
    name: 'UI/UX Design',
    description: 'Clean, user-friendly interfaces designed to look great and convert visitors into customers.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'Consulting & Technical Advice',
    description: 'Not sure what you need? We help you plan your digital project, choose the right technology, and estimate costs.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
];
