import { api } from "../../services/api";

import type { AuditLogsQuery, AuditLogsResponse, AuditLog } from "./types";

export const auditLogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLogsResponse, AuditLogsQuery | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.action) {
          searchParams.set("action", params.action);
        }

        if (params?.model_name) {
          searchParams.set("model_name", params.model_name);
        }

        if (params?.user) {
          searchParams.set("user", String(params.user));
        }

        if (params?.search) {
          searchParams.set("search", params.search);
        }

        const queryString = searchParams.toString();

        return queryString ? `audit-logs/?${queryString}` : "audit-logs/";
      },

      providesTags: ["AuditLog"],
    }),

    getAuditLog: builder.query<
      {
        success: boolean;
        log: AuditLog;
      },
      number
    >({
      query: (id) => `audit-logs/${id}/`,

      providesTags: (_result, _error, id) => [
        {
          type: "AuditLog",
          id,
        },
      ],
    }),
  }),
});

export const { useGetAuditLogsQuery, useGetAuditLogQuery } = auditLogsApi;
