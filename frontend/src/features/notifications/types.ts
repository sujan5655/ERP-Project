export type NotificationType = "LOW_STOCK" | "SYSTEM" | "PAYMENT" | "ORDER";

export interface Notification {
  id: number;
  notification_type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  success: boolean;
  count: number;
  notifications: Notification[];
}
