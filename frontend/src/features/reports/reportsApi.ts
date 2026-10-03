import { api } from "../../services/api";

import type { ReportType, ReportsResponse } from "./types";

export interface ReportsQuery {
  report_type: ReportType;
  start_date?: string;
  end_date?: string;
}

export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReport: builder.query<ReportsResponse, ReportsQuery>({
      query: ({ report_type, start_date, end_date }) => {
        const params = new URLSearchParams();

        params.set("report_type", report_type);

        if (start_date) {
          params.set("start_date", start_date);
        }

        if (end_date) {
          params.set("end_date", end_date);
        }

        return `reports/?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetReportQuery } = reportsApi;
