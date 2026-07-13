export interface NavigationLink {
  name: string;
  href: string;
}

export const navigationLinks: NavigationLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Web Solutions", href: "/web-solutions" },
  { name: "Security Systems", href: "/security-systems" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "Internship", href: "/internship" },
  { name: "Contact", href: "/contact" },
];