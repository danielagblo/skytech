'use client'

import NavigationPC from "./NavigationPC";
import NavigationMobile from "./NavigationMobile";
import { usePathname } from "next/navigation";

function Navigation({ className }: { className?: string }) {
  
  const isLandingPage = usePathname() === "/";

  return (
    <header className={className}>
      <NavigationPC className="hidden md:flex" />
      {isLandingPage && <NavigationMobile className="md:hidden" />}
    </header>
  );
}

export default Navigation;