import { api } from "../../services/api";

import type { CompaniesResponse, CreateCompanyRequest, Company } from "./types";

/**
 * Convert normal request object to multipart/form-data.
 */

export const companyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // GET COMPANIES
    // ==========================================

    getCompanies: builder.query<CompaniesResponse, void>({
      query: () => ({
        url: "companies/",
        method: "GET",
      }),
      providesTags: ["Company"],
    }),

    // ==========================================
    // CREATE COMPANY
    // ==========================================
    createCompany: builder.mutation<
      {
        success: boolean;
        message: string;
        company: Company;
      },
      FormData
    >({
      query: (data) => ({
        url: "companies/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),
    // ==========================================
    // GET SINGLE COMPANY
    // ==========================================

    getCompany: builder.query<
      {
        success: boolean;
        message: string;
        company: Company;
      },
      number
    >({
      query: (id) => ({
        url: `companies/${id}/`,
        method: "GET",
      }),
    }),

    // ==========================================
    // UPDATE COMPANY
    // ==========================================
    updateCompany: builder.mutation<
      {
        success: boolean;
        message: string;
        company: Company;
      },
      {
        id: number;
        data: FormData;
      }
    >({
      query: ({ id, data }) => ({
        url: `companies/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),

    // ==========================================
    // DELETE COMPANY
    // ==========================================

    deleteCompany: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      number
    >({
      query: (id) => ({
        url: `companies/${id}/`,
        method: "DELETE",
      }),

      invalidatesTags: ["Company"],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
