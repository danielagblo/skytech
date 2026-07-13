import NavigationPC from "./NavigationPC";
import NavigationMobile from "./NavigationMobile";

function Navigation({ className }: { className?: string }) {
  return (
    <header className={className}>
      <NavigationPC className="hidden md:flex" />
      <NavigationMobile className="md:hidden" />
    </header>
  );
}

export default Navigation;
