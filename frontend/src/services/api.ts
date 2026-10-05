import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RootState } from "../app/store";
import { setCredentials, logout } from "../features/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8000/api/",

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;

    const token = state.auth.accessToken || localStorage.getItem("accessToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");

    return headers;
  },
});

const baseQueryWithReauth = async (
  args: Parameters<typeof baseQuery>[0],
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2],
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "auth/token/refresh/",
          method: "POST",
          body: {
            refresh: refreshToken,
          },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const data = refreshResult.data as {
          access: string;
        };

        localStorage.setItem("accessToken", data.access);

        const state = api.getState() as RootState;

        if (state.auth.user) {
          api.dispatch(
            setCredentials({
              user: state.auth.user,
              accessToken: data.access,
              refreshToken,
            }),
          );
        }

        result = await baseQuery(args, api, extraOptions);
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "Company",
    "Branch",
    "Warehouse",
    "Category",
    "Brand",
    "Product",
    "Inventory",
    "Supplier",
    "PurchaseOrder",
    "Customer",
    "SalesOrder",
    "Payment",
    "Notification",
    "AuditLog",
    "AIConversation",
  ],

  endpoints: () => ({}),
});
