"use client";

import Image from "next/image";
import { getWhatsAppDigits, getWhatsAppUrl } from "@/app/lib/whatsapp";

function LetsTalkButton({ className, whatsapp }: { className?: string; whatsapp?: string }) {
  const digits = getWhatsAppDigits(whatsapp);

  return (
    <a
      href={getWhatsAppUrl(digits)}
      target="_blank"
      rel="noopener noreferrer"
      className={
        (className ?? "") +
        " inline-block cursor-pointer px-4 py-3 text-center transition-colors duration-200"
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
    </a>
  );
}

export default LetsTalkButton;
