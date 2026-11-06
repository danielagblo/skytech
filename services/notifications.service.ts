import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type {
  AppNotification,
  FollowUpAlert,
  NotificationFilters,
} from "@/types/notification.types";

export const notificationsService = {
  getAll: (params: NotificationFilters = {}) =>
    api.get<PaginatedResponse<AppNotification>>("/notifications", { params }),
  getUnreadCount: () =>
    api.get<ApiResponse<{ count: number }>>("/notifications/unread-count"),
  getFollowUps: () =>
    api.get<ApiResponse<FollowUpAlert[]>>("/notifications/follow-ups"),
  markRead: (id: string) =>
    api.post<ApiResponse<AppNotification>>(`/notifications/${id}/read`),
  markAllRead: () => api.post<ApiResponse<null>>("/notifications/read-all"),
};
