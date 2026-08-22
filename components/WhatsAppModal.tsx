"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { getWhatsAppUrl } from "@/app/lib/whatsapp";

/* Kept for compatibility — open() now goes straight to WhatsApp (no package form). */

export interface WhatsAppPackageGroup {
  group: string;
  items: string[];
}

interface ModalCtx {
  open: (whatsappDigits?: string) => void;
}

const Ctx = createContext<ModalCtx>({ open: () => {} });

export function useWhatsAppModal() {
  return useContext(Ctx);
}

export function WhatsAppModalProvider({
  children,
  whatsapp,
}: {
  children: ReactNode;
  whatsapp?: string;
  packages?: WhatsAppPackageGroup[];
}) {
  const open = useCallback(
    (d?: string) => {
      const url = getWhatsAppUrl(d || whatsapp);
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [whatsapp]
  );

  return <Ctx.Provider value={{ open }}>{children}</Ctx.Provider>;
}
