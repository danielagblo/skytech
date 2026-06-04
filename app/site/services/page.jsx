import ServicesClient from './ServicesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Strategic Engineering Services - Skytech Ghana',
  description: "Architecting high-performance digital ecosystems, enterprise-grade mobile applications, and secure fintech infrastructures for global brands.",
};

export default async function Services() {
  const servicesContent = {
    heroTitle: "Engineering high-performance digital ecosystems.",
    heroSubtitle: "We architect, deploy, and scale. Our engineering standards prioritize bank-grade security and native performance across every platform.",
    engagementTitle: "Tactical Engagement Models.",
    whatWeDoTitle: "Full-Lifecycle Engineering.",
    whatWeDoSubtitle: "We handle everything from initial system architecture to long-term infrastructure maintenance."
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
    title: 'Dedicated Engineering Squads',
    description: 'A specialized team of senior engineers deeply integrated into your weekly development cycle.',
    items: ['Direct Lead Communication', 'Agile Velocity Tracking', 'Infrastructure Ownership']
  },
  {
    title: 'Fixed-Scope Technical Delivery',
    description: 'A surgical approach to product development with defined milestones and guaranteed delivery timelines.',
    items: ['Defined Architectural Scope', 'Milestone-Based Releases', 'Hard-Deadline Commitment']
  },
  {
    title: 'Infrastructure & Security Audits',
    description: 'A forensic deep-dive into your existing systems to identify performance bottlenecks and security vulnerabilities.',
    items: ['Performance Stress-Testing', 'Cost Optimization Analysis', 'Hardening & Compliance']
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
    name: 'Enterprise SaaS',
    description: 'Scalable cloud platforms and multi-tenant software systems.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'Modern E-commerce',
    description: 'High-conversion marketplaces and headless commerce solutions.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'Fintech & Payments',
    description: 'Secure transaction processing and financial data architectures.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'HealthTech',
    description: 'Privacy-compliant medical platforms and diagnostic tools.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'Logistics & Fleet',
    description: 'Real-time tracking systems and supply chain automation.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'PropTech',
    description: 'Advanced real estate management and listing platforms.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'Enterprise Internal',
    description: 'High-performance internal tools and workflow automation.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    types: ['Web']
  },
  {
    name: 'EdTech',
    description: 'LMS platforms and interactive learning ecosystems.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
];
