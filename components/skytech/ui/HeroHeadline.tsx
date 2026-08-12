"use client";

import AnimatedCounter from "../sections/home/AnimatedCounter";

function renderText(text: string, keyBase: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(\d+(?:[.,]\d+)?)([+\-%]*)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push(text.slice(lastIndex, m.index));
    }
    const numeric = parseFloat(m[1].replace(",", "."));
    parts.push(
      <AnimatedCounter
        key={`${keyBase}-${i}`}
        value={numeric}
        suffix={m[2]}
        compact={false}
        duration={1600}
        className="inline-block"
      />,
    );
    lastIndex = m.index + m[0].length;
    i++;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default function HeroHeadline({
  headline,
  headlineSub,
}: {
  headline: string;
  headlineSub: string;
}) {
  return (
    <h1 className="animate-hero-pulse font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl md:text-7xl">
      {renderText(headline, "hl")}
      <span className="block whitespace-nowrap">{renderText(headlineSub, "hs")}</span>
    </h1>
  );
}