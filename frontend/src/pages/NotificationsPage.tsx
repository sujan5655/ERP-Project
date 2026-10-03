import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from "../features/notifications/notificationsApi";

import type { Notification } from "../features/notifications/types";

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

function getNotificationClass(type: Notification["notification_type"]) {
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

export default function NotificationsPage() {
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery();

  const [markNotificationRead, { isLoading: isMarkingRead }] =
    useMarkNotificationReadMutation();

  const notifications = data?.notifications ?? [];

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  const handleMarkRead = async (notificationId: number) => {
    try {
      await markNotificationRead(notificationId).unwrap();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

          <p className="mt-1 text-sm text-gray-500">
            View alerts and system notifications.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Notifications</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {notifications.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Unread</p>

          <p className="mt-2 text-2xl font-bold text-red-600">{unreadCount}</p>
        </div>
      </div>

      {/* Loading */}

      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      )}

      {/* Error */}

      {isError && !isLoading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-700">
            Failed to load notifications.
          </p>

          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Notification list */}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-gray-500">No notifications.</p>
            </div>
          ) : (
            notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`rounded-xl border bg-white p-5 shadow-sm ${
                  notification.is_read
                    ? "border-gray-200"
                    : "border-blue-200 bg-blue-50/30"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-gray-900">
                        {notification.title}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getNotificationClass(
                          notification.notification_type,
                        )}`}
                      >
                        {notification.notification_type}
                      </span>

                      {!notification.is_read && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          UNREAD
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      {notification.message}
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>

                  {!notification.is_read && (
                    <button
                      disabled={isMarkingRead}
                      onClick={() => handleMarkRead(notification.id)}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
