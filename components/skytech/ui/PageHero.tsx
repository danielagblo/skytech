import { ReactNode } from "react";

interface PageHeroProps {
  tag?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Reusable premium page-header block used across public pages.
 * Renders a section tag pill, a display title, and a lead paragraph.
 */
export default function PageHero({ tag, title, lead, children, className }: PageHeroProps) {
  return (
    <div className={`${className ?? ""} space-y-5`}>
      {tag && <span className="section-tag">{tag}</span>}
      <h1 className="section-title">{title}</h1>
      {lead && <p className="section-lead max-w-2xl">{lead}</p>}
      {children}
    </div>
  );
}