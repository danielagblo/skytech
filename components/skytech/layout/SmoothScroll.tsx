"use client";

import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

type SmoothScrollProps = {
  children: ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        anchors: true,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
