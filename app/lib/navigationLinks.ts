export interface NavigationLink {
  name: string;
  href: string;
}

export const navigationLinks: NavigationLink[] = [
  { name: "Home", href: "/site" },
  { name: "About", href: "/site/about" },
  { name: "Web Solutions", href: "/site/services" },
  { name: "Security Systems", href: "/site/services/security-systems" },
  { name: "Pricing", href: "/site/pricing" },
  { name: "Blog", href: "/site/blog" },
  { name: "Internship", href: "/site/internship" },
  { name: "Contact", href: "/site/contact" },
];
