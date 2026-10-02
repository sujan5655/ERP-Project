import { api } from "../../services/api";

import type {
  CustomerListResponse,
  CustomerResponse,
  CreateCustomerRequest,
} from "./types";

export const customerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomerListResponse, void>({
      query: () => "customers/",
      providesTags: ["Customer"],
    }),

    getCustomer: builder.query<CustomerResponse, number>({
      query: (id) => `customers/${id}/`,
      providesTags: (_result, _error, id) => [
        {
          type: "Customer",
          id,
        },
      ],
    }),

    createCustomer: builder.mutation<CustomerResponse, CreateCustomerRequest>({
      query: (body) => ({
        url: "customers/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),

    updateCustomer: builder.mutation<
      CustomerResponse,
      {
        id: number;
        body: CreateCustomerRequest;
      }
    >({
      query: ({ id, body }) => ({
        url: `customers/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),

    deleteCustomer: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      number
    >({
      query: (id) => ({
        url: `customers/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
