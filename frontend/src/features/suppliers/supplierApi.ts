import { api } from "../../services/api";

import type {
  Supplier,
  SuppliersResponse,
  CreateSupplierRequest,
} from "./types";

const supplierApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<SuppliersResponse, void>({
      query: () => "suppliers/",
      providesTags: ["Supplier"],
    }),

    getSupplier: builder.query<Supplier, number>({
      query: (id) => `suppliers/${id}/`,
      providesTags: ["Supplier"],
    }),

    createSupplier: builder.mutation<Supplier, CreateSupplierRequest>({
      query: (data) => ({
        url: "suppliers/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Supplier"],
    }),

    updateSupplier: builder.mutation<
      Supplier,
      {
        id: number;
        data: CreateSupplierRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `suppliers/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Supplier"],
    }),

    deleteSupplier: builder.mutation<void, number>({
      query: (id) => ({
        url: `suppliers/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;
