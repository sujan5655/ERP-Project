import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RootState } from "../app/store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8000/api/",

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;

    const token = state.auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");

    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",

  baseQuery,

  endpoints: () => ({}),
});
