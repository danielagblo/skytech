"use client";

import { useEffect, useRef, useState } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const EXIT_DURATION = 300;
const DRAG_CLOSE_THRESHOLD = 120;
const DRAG_EXPAND_THRESHOLD = 80;
const MOBILE_DEFAULT_HEIGHT = 70;
const MOBILE_FULL_HEIGHT = 100;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(isOpen);
  const [entered, setEntered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileHeight, setMobileHeight] = useState(MOBILE_DEFAULT_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(MOBILE_DEFAULT_HEIGHT);
  const dragDeltaY = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setMobileHeight(MOBILE_DEFAULT_HEIGHT);
      setIsDragging(false);
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }
    setEntered(false);
    const t = setTimeout(() => setMounted(false), EXIT_DURATION);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isDesktop) return;
    dragStartY.current = e.clientY;
    dragStartHeight.current = mobileHeight;
    dragDeltaY.current = 0;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e: PointerEvent) => {
      const delta = e.clientY - dragStartY.current;
      dragDeltaY.current = delta;
      const deltaHeight = (delta / window.innerHeight) * 100;
      setMobileHeight(
        clamp(dragStartHeight.current - deltaHeight, MOBILE_DEFAULT_HEIGHT, MOBILE_FULL_HEIGHT)
      );
    };

    const onPointerUp = () => {
      setIsDragging(false);
      if (dragDeltaY.current < -DRAG_EXPAND_THRESHOLD) {
        setMobileHeight(MOBILE_FULL_HEIGHT);
        return;
      }

      if (dragDeltaY.current > DRAG_CLOSE_THRESHOLD) {
        if (dragStartHeight.current > MOBILE_DEFAULT_HEIGHT + 1) {
          setMobileHeight(MOBILE_DEFAULT_HEIGHT);
        } else {
          onClose();
        }
        return;
      }

      setMobileHeight(
        dragStartHeight.current > MOBILE_DEFAULT_HEIGHT + 1
          ? MOBILE_FULL_HEIGHT
          : MOBILE_DEFAULT_HEIGHT
      );
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging, onClose]);

  if (!mounted) return null;

  const mobileStyle: React.CSSProperties = isDesktop
    ? {}
    : {
        height: `${mobileHeight}vh`,
        transform: entered ? "translateY(0)" : "translateY(100%)",
        transition: isDragging ? "none" : "height 250ms ease-out, transform 300ms ease-out",
      };

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        style={mobileStyle}
        className={`
          absolute inset-x-0 bottom-0 flex flex-col overflow-hidden
          rounded-t-3xl bg-white shadow-2xl
          md:inset-0 md:m-auto md:h-fit md:max-h-[85vh] md:w-full md:max-w-md
          md:rounded-2xl md:transition-all md:duration-300
          ${isDesktop && entered ? "md:scale-100 md:opacity-100" : ""}
          ${isDesktop && !entered ? "md:scale-95 md:opacity-0" : ""}
        `}
      >
        <div
          onPointerDown={handlePointerDown}
          className="flex shrink-0 cursor-grab touch-none justify-center py-3 active:cursor-grabbing md:hidden"
        >
          <span className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>

        <div className="overflow-y-auto px-6 pb-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}

export default BottomSheet;
