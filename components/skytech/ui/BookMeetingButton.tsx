"use client";

import { useWhatsAppModal } from "@/components/WhatsAppModal";

export default function BookMeetingButton({
  className,
  children = "BOOK A MEETING",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { open } = useWhatsAppModal();

  return (
    <button type="button" onClick={() => open()} className={className}>
      {children}
    </button>
  );
}
