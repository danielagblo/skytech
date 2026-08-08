export interface NavigationLink {
  name: string;
  href: string;
}

export interface ServiceNavigationItem extends NavigationLink {
  children?: ServiceNavigationItem[];
}

export const navigationLinks: NavigationLink[] = [
  { name: "Home", href: "/site" },
  { name: "About", href: "/site/about" },
  { name: "Services", href: "/site/services" },
  { name: "Pricing", href: "/site/pricing" },
  { name: "Insights", href: "/site/insights" },
  { name: "Internship", href: "/site/internship" },
  { name: "Contact", href: "/site/contact" },
];

export const servicesNav: ServiceNavigationItem[] = [
  { name: "Web Solutions", href: "/site/services" },
  {
    name: "Security Systems",
    href: "/site/services/security-systems",
    children: [
      { name: "CCTV Surveillance", href: "/site/services/security-systems#cctv" },
      { name: "GPS Tracking", href: "/site/services/security-systems#gps" },
      { name: "Biometric & Automated Gates", href: "/site/services/security-systems#biometric" },
      { name: "Cyber Security", href: "/site/services/security-systems#cyber" },
      { name: "Mobile Tracking", href: "/site/services/security-systems#mobile" },
      { name: "Hardware Procurement & Supplying", href: "/site/services/security-systems#hardware" },
    ],
  },
  { name: "SEO & Growth", href: "/site/seo" },
];
