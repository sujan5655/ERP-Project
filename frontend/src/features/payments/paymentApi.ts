import { api } from "../../services/api";

import type {
  PaymentListResponse,
  PaymentResponse,
  CreatePaymentRequest,
} from "./types";

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaymentListResponse, void>({
      query: () => "payments/",
      providesTags: ["Payment"],
    }),

    getPayment: builder.query<PaymentResponse, number>({
      query: (id) => `payments/${id}/`,
      providesTags: (_result, _error, id) => [
        {
          type: "Payment",
          id,
        },
      ],
    }),

    createPayment: builder.mutation<PaymentResponse, CreatePaymentRequest>({
      query: (body) => ({
        url: "payments/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),

    updatePayment: builder.mutation<
      PaymentResponse,
      {
        id: number;
        body: CreatePaymentRequest;
      }
    >({
      query: ({ id, body }) => ({
        url: `payments/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Payment",
        {
          type: "Payment",
          id,
        },
      ],
    }),

    deletePayment: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      number
    >({
      query: (id) => ({
        url: `payments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentApi;
