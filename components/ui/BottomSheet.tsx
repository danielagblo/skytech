"use client";

import { useEffect, useRef, useState } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const EXIT_DURATION = 300; // ms, must match the transition duration used below
const DRAG_CLOSE_THRESHOLD = 120; // px dragged down before treated it as "dismiss"

function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(isOpen);
  const [entered, setEntered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      setDragY(0);
      setIsDragging(false);
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }
    setEntered(false);
    const t = setTimeout(() => setMounted(false), EXIT_DURATION);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Lock page scroll while open, close on Escape.
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
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e: PointerEvent) => {
      const delta = e.clientY - dragStartY.current;
      setDragY(Math.max(0, delta));
    };

    const onPointerUp = () => {
      setIsDragging(false);
      setDragY((current) => {
        if (current > DRAG_CLOSE_THRESHOLD) {
          onClose();
        }
        return current > DRAG_CLOSE_THRESHOLD ? current : 0;
      });
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
        transform: entered ? `translateY(${dragY}px)` : "translateY(100%)",
        transition: isDragging ? "none" : "transform 300ms ease-out",
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
          absolute inset-x-0 bottom-0 flex max-h-[70vh] flex-col overflow-hidden
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