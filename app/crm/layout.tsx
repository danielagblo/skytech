import type { Metadata } from "next";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: { default: "Skytech CRM", template: "%s | Skytech CRM" },
  description: "Skytech customer relationship management workspace",
};

export default function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Providers>{children}</Providers>
    </div>
  );
}
