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

export interface WhatsAppOpenOptions {
  packageName?: string;
  packagePrice?: string;
}

interface ModalCtx {
  open: (whatsappDigitsOrOptions?: string | WhatsAppOpenOptions) => void;
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
  const [selectedPackage, setSelectedPackage] = useState<WhatsAppOpenOptions>({});
  const number = whatsapp || WHATSAPP_NUMBER;

  const open = useCallback((arg?: string | WhatsAppOpenOptions) => {
    setSelectedPackage(arg && typeof arg === "object" ? arg : {});
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedPackage({});
  }, []);

  return (
    <Ctx.Provider value={{ open, close, isOpen }}>
      {children}
      <BottomSheet isOpen={isOpen} onClose={close}>
        <WhatsAppOfferForm
          extended
          onClose={close}
          whatsappNumber={number}
          packageName={selectedPackage.packageName}
          packagePrice={selectedPackage.packagePrice}
        />
      </BottomSheet>
    </Ctx.Provider>
  );
}
