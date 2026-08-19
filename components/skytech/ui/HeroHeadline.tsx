"use client";

import { useEffect, useState } from "react";
import AnimatedCounter from "../sections/home/AnimatedCounter";

export interface HeroHeadlineItem {
  headline: string;
  headlineSub: string;
}

export type HeroHeadlineMode = "slide" | "typing";

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

function useTypewriter(text: string, speed = 110) {
  const [out, setOut] = useState("");

  useEffect(() => {
    setOut("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return out;
}

export default function HeroHeadline({
  headlines,
  mode = "slide",
}: {
  headlines?: HeroHeadlineItem[];
  mode?: HeroHeadlineMode;
}) {
  const list =
    headlines && headlines.length > 0
      ? headlines
      : [{ headline: "", headlineSub: "" }];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (list.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, 6000);
    return () => clearInterval(id);
  }, [list.length]);

  const current = list[index % list.length];

  // Sequential typing: line 1 finishes before line 2 begins.
  const typed = useTypewriter(
    mode === "typing" ? `${current.headline}\n${current.headlineSub}` : "",
  );
  const [typedLine1, typedLine2] = typed.split("\n");

  return (
    <h1
      key={`${index}-${mode}`}
      className={`font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl md:text-7xl ${
        mode === "slide" ? "animate-hero-pulse" : ""
      } animate-headline-slide-up`}
      style={{ minHeight: "2.3em" }}
    >
      {mode === "typing" ? (
        <>
          <span className="block">{typedLine1 || "\u00A0"}</span>
          <span className="block whitespace-nowrap">{typedLine2 || "\u00A0"}</span>
        </>
      ) : (
        <>
          {renderText(current.headline, "hl")}
          <span className="block whitespace-nowrap">{renderText(current.headlineSub, "hs")}</span>
        </>
      )}
    </h1>
  );
}