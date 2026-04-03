import type { NotificationsPage, ReadAllNotificationsResponse } from "../types/notifications";
import { authedJson } from "./authed";
import { API_BASE as BASE } from "./env";

export function fetchNotifications(page = 0, limit = 20): Promise<NotificationsPage> {
  const search = new URLSearchParams({ page: String(page), limit: String(limit) });
  return authedJson(`${BASE}/notifications?${search.toString()}`);
}

export function markAllNotificationsRead(): Promise<ReadAllNotificationsResponse> {
  return authedJson(`${BASE}/notifications/read-all`, { method: "POST" });
}
