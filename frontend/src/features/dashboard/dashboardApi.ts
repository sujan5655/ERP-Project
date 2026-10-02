import { api } from "../../services/api";
import type { DashboardResponse } from "./types";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => "dashboard/",
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
