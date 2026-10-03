import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from "../features/notifications/notificationsApi";

import type { Notification } from "../features/notifications/types";

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

function getTypeClass(type: Notification["notification_type"]) {
  switch (type) {
    case "LOW_STOCK":
      return "bg-red-100 text-red-700";

    case "PAYMENT":
      return "bg-yellow-100 text-yellow-700";

    case "ORDER":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetNotificationsQuery();

  const [markNotificationRead] = useMarkNotificationReadMutation();

  const notifications = data?.notifications ?? [];

  const unreadNotifications = notifications.filter(
    (notification) => !notification.is_read,
  );

  const unreadCount = unreadNotifications.length;

  const recentNotifications = unreadNotifications.slice(0, 5);

  const handleMarkRead = async (notificationId: number) => {
    try {
      await markNotificationRead(notificationId).unwrap();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="relative">
      {/* Bell button */}

      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 1-5.714 0M18 8.25a6 6 0 0 0-12 0c0 7.5-3 7.5-3 9.75h18C21 15.75 18 15.75 18 8.25Z"
          />
        </svg>

        {/* Unread badge */}

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>

              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            </div>

            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          {/* Loading */}

          {isLoading && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Loading notifications...
            </div>
          )}

          {/* Empty */}

          {!isLoading && recentNotifications.length === 0 && (
            <div className="px-4 py-8 text-center">
              <div className="text-2xl">✓</div>

              <p className="mt-2 text-sm font-medium text-gray-700">
                You're all caught up
              </p>

              <p className="mt-1 text-xs text-gray-400">
                No unread notifications.
              </p>
            </div>
          )}

          {/* Notification list */}

          {!isLoading && recentNotifications.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border-b border-gray-100 px-4 py-3 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {notification.title}
                        </p>

                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${getTypeClass(
                            notification.notification_type,
                          )}`}
                        >
                          {notification.notification_type}
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                        {notification.message}
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>

                    {/* Mark read */}

                    <button
                      type="button"
                      onClick={() => handleMarkRead(notification.id)}
                      className="shrink-0 text-xs font-medium text-gray-500 hover:text-gray-900"
                    >
                      Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}

          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
