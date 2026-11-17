"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function useRise<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((panel) => {
      gsap.from(panel, {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: panel, start: "top 88%" },
      });
    });
  }, { scope: ref });

  return ref;
}
