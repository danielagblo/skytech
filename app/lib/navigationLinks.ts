export interface NavigationLink {
  name: string;
  href: string;
}

export interface ServiceNavigationItem extends NavigationLink {
  children?: ServiceNavigationItem[];
}

export const navigationLinks: NavigationLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Foundation", href: "/foundation" },
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/pricing" },
  { name: "Insights", href: "/insights" },
  { name: "Internship", href: "/internship" },
  { name: "Contact", href: "/contact" },
];

export const servicesNav: ServiceNavigationItem[] = [
  { name: "Web Solutions", href: "/services" },
  {
    name: "Security Systems",
    href: "/services/security-systems",
    children: [
      { name: "CCTV Surveillance", href: "/services/security-systems#cctv" },
      { name: "GPS Tracking", href: "/services/security-systems#gps" },
      { name: "Biometric & Automated Gates", href: "/services/security-systems#biometric" },
      { name: "Cyber Security", href: "/services/security-systems#cyber" },
      { name: "Mobile Tracking", href: "/services/security-systems#mobile" },
      { name: "Hardware Procurement & Supplying", href: "/services/security-systems#hardware" },
    ],
  },
  { name: "SEO & Growth", href: "/seo" },
];
