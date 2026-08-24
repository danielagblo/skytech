"use client";

import { useCallback, useState, type ReactNode } from "react";
import { createContext, useContext } from "react";
import BottomSheet from "@/components/skytech/ui/BottomSheet";
import WhatsAppOfferForm from "@/components/skytech/sections/landing/WhatsAppOfferForm";
import { WHATSAPP_NUMBER } from "@/app/lib/whatsapp";

export interface WhatsAppPackageGroup {
  group: string;
  items: string[];
}

interface ModalCtx {
  open: (whatsappDigits?: string) => void;
  close: () => void;
  isOpen: boolean;
}

const Ctx = createContext<ModalCtx>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

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
  const [isOpen, setIsOpen] = useState(false);
  const number = whatsapp || WHATSAPP_NUMBER;

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Ctx.Provider value={{ open, close, isOpen }}>
      {children}
      <BottomSheet isOpen={isOpen} onClose={close}>
        <WhatsAppOfferForm onClose={close} whatsappNumber={number} />
      </BottomSheet>
    </Ctx.Provider>
  );
}
