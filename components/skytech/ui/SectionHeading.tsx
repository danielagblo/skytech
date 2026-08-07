import { ReactNode } from "react";

interface SectionHeadingProps {
  tag?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/**
 * Reusable section header: optional eyebrow tag, headline and lead copy.
 */
export default function SectionHeading({
  tag,
  title,
  lead,
  align = "left",
  className,
}: SectionHeadingProps) {
  const alignCls =
    align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`${className ?? ""} flex flex-col ${alignCls} gap-4`}>
      {tag && <span className="section-tag">{tag}</span>}
      <h2 className="section-title">{title}</h2>
      {lead && <p className="section-lead max-w-2xl">{lead}</p>}
    </div>
  );
}