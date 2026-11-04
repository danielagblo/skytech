import type { Metadata } from "next";
import { HomeDashboard } from "@/components/home/HomeDashboard";
export const metadata: Metadata = { title: "Home" };
export default function HomePage() {
  return (
    <div className="space-y-3">
      <HomeDashboard />
    </div>
  );
}
