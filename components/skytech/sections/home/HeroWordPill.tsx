"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DEFAULT_HERO_WORDS } from "@/app/lib/hero-words-shared";

gsap.registerPlugin(useGSAP);

type HeroWordPillProps = {
  words?: string[];
  className?: string;
  /** Delay after mount before the first swap starts */
  startDelay?: number;
  /** How long each word stays fully visible */
  hold?: number;
};

export default function HeroWordPill({
  words = DEFAULT_HERO_WORDS.words,
  className = "",
  startDelay = 0.9,
  hold = 2.2,
}: HeroWordPillProps) {
  const root = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const list = (words?.length ? words : DEFAULT_HERO_WORDS.words)
    .map((word) => String(word || "").trim())
    .filter(Boolean);

  useLayoutEffect(() => {
    const pill = root.current;
    const measure = measureRef.current;
    if (!pill || !measure || !list.length) return;

    const first = measure.querySelector<HTMLElement>("[data-measure-word]");
    if (!first) return;
    const width = Math.ceil(first.getBoundingClientRect().width);
    const height = Math.ceil(first.getBoundingClientRect().height);
    pill.style.width = `${width}px`;
    pill.style.height = `${height}px`;
  }, [list.join("|")]);

  useGSAP(
    () => {
      const pill = root.current;
      const measure = measureRef.current;
      if (!pill || !measure) return;

      const slots = gsap.utils.toArray<HTMLElement>("[data-hero-word]", pill);
      const rulers = gsap.utils.toArray<HTMLElement>("[data-measure-word]", measure);
      if (!slots.length) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || slots.length === 1) {
        gsap.set(slots, { autoAlpha: 0, yPercent: 0, xPercent: -50 });
        gsap.set(slots[slots.length - 1] || slots[0], { autoAlpha: 1 });
        const active = rulers[rulers.length - 1] || rulers[0];
        if (active) {
          pill.style.width = `${Math.ceil(active.getBoundingClientRect().width)}px`;
          pill.style.height = `${Math.ceil(active.getBoundingClientRect().height)}px`;
        }
        return;
      }

      const measureAll = () =>
        rulers.map((ruler) => ({
          width: Math.ceil(ruler.getBoundingClientRect().width),
          height: Math.ceil(ruler.getBoundingClientRect().height),
        }));

      const applySize = (size: { width: number; height: number }, animate = false) => {
        if (animate) {
          return gsap.to(pill, {
            width: size.width,
            height: size.height,
            duration: 0.55,
            ease: "power3.inOut",
            overwrite: "auto",
          });
        }
        gsap.set(pill, { width: size.width, height: size.height });
        return null;
      };

      const boot = () => {
        const sizes = measureAll();
        if (!sizes.length) return;

        gsap.set(slots, {
          position: "absolute",
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          autoAlpha: 0,
          force3D: true,
        });
        applySize(sizes[0]);
        gsap.set(slots[0], { autoAlpha: 1, yPercent: -50 });

        const reel = gsap.timeline({
          repeat: -1,
          defaults: { ease: "power3.inOut" },
          delay: startDelay,
        });

        const swap = (from: number, to: number) => {
          reel.to(slots[from], {
            autoAlpha: 0,
            yPercent: -160,
            duration: 0.45,
            ease: "power2.in",
          });
          reel.to(
            pill,
            {
              width: sizes[to].width,
              height: sizes[to].height,
              duration: 0.58,
              ease: "power3.inOut",
            },
            "<0.02",
          );
          reel.fromTo(
            slots[to],
            { autoAlpha: 0, yPercent: 70 },
            { autoAlpha: 1, yPercent: -50, duration: 0.5, ease: "power2.out" },
            "<0.1",
          );
        };

        reel.to({}, { duration: hold });
        for (let index = 1; index < slots.length; index += 1) {
          swap(index - 1, index);
          reel.to({}, { duration: hold });
        }
        swap(slots.length - 1, 0);
      };

      if (document.fonts?.ready) {
        void document.fonts.ready.then(boot);
      } else {
        boot();
      }
    },
    { scope: root, dependencies: [list.join("|"), startDelay, hold] },
  );

  if (!list.length) return null;

  return (
    <>
      {/* Off-screen rulers — true glyph metrics for each word */}
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] top-0"
      >
        {list.map((word, index) => (
          <span
            key={`measure-${word}-${index}`}
            data-measure-word
            className="inline-block whitespace-nowrap px-[0.38em] py-[0.02em]"
          >
            {word}
          </span>
        ))}
      </span>

      <span
        ref={root}
        data-hero-word-pill
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#b7dff6] align-middle will-change-[width,height] ${className}`}
      >
        {list.map((word, index) => (
          <span
            key={`slot-${word}-${index}`}
            data-hero-word
            className="whitespace-nowrap px-[0.38em] py-[0.02em]"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            {word}
          </span>
        ))}
      </span>
    </>
  );
}
