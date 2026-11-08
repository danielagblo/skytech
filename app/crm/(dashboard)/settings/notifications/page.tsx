import type { Metadata } from "next";
import { NotificationTones } from "@/components/settings/notifications/NotificationTones";

export const metadata: Metadata = { title: "Notification tone" };

export default function NotificationSettingsPage() {
  return <NotificationTones />;
}
