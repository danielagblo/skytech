import type { Metadata } from "next";
import { AlertSoundPreview } from "./preview";

export const metadata: Metadata = { title: "Alert sounds" };

export default function AlertSoundsPage() {
  return <AlertSoundPreview />;
}
