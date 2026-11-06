import type { PageParams } from "./api.types";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
}

export type FollowUpUrgency = "DUE" | "SIX_HOURS" | "ONE_DAY";

export interface FollowUpAlert {
  dealId: string;
  dealTitle: string;
  followUpAt: string;
  urgency: FollowUpUrgency;
}

export type NotificationFilters = PageParams;
