"use client";

import Image from "next/image";
import { useWhatsAppModal } from "@/components/WhatsAppModal";

const DEFAULT_WHATSAPP = "233538311626";

function toWaDigits(value?: string) {
  if (!value) return "";
  return String(value).replace(/[^\d]/g, "");
}

function LetsTalkButton({ className, whatsapp }: { className?: string; whatsapp?: string }) {
  const digits = toWaDigits(whatsapp) || DEFAULT_WHATSAPP;
  const { open } = useWhatsAppModal();

  return (
    <button
      onClick={() => open(digits)}
      className={
        (className ?? "") +
        " text-center rounded-none py-2 px-3 hover:scale-[0.97] active:scale-[1.02] cursor-pointer transition-all duration-300 ease-in-out"
      }
    >
      Click, let&apos;s talk!
      <Image
        src="/images/icons/whatsappLogo.svg"
        alt="WhatsApp Icon"
        width={16}
        height={16}
        className="ml-2 mb-1 h-4 w-4 inline-block"
      />
      &nbsp;&nbsp;&#x276F;
    </button>
  );
}

export default LetsTalkButton;
