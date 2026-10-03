import { api } from "../../services/api";

import type { NotificationsResponse } from "./types";

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => "notifications/",

      providesTags: ["Notification"],
    }),

    markNotificationRead: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      number
    >({
      query: (notificationId) => ({
        url: `notifications/${notificationId}/read/`,
        method: "PATCH",
      }),

      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationReadMutation } =
  notificationsApi;
