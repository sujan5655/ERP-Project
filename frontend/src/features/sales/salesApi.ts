import { api } from "../../services/api";

import type {
  SalesOrderListResponse,
  SalesOrderResponse,
  CreateSalesOrderRequest,
  CreateSalesOrderItemRequest,
} from "./types";

export const salesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSalesOrders: builder.query<SalesOrderListResponse, void>({
      query: () => "sales/",
      providesTags: ["SalesOrder"],
    }),

    getSalesOrder: builder.query<SalesOrderResponse, number>({
      query: (id) => `sales/${id}/`,
      providesTags: (_result, _error, id) => [
        {
          type: "SalesOrder",
          id,
        },
      ],
    }),

    createSalesOrder: builder.mutation<
      SalesOrderResponse,
      CreateSalesOrderRequest
    >({
      query: (body) => ({
        url: "sales/",
        method: "POST",
        body,
      }),

      invalidatesTags: ["SalesOrder"],
    }),

    createSalesOrderItem: builder.mutation<
      SalesOrderResponse,
      {
        salesOrderId: number;
        body: CreateSalesOrderItemRequest;
      }
    >({
      query: ({ salesOrderId, body }) => ({
        url: `sales/${salesOrderId}/items/`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { salesOrderId }) => [
        "SalesOrder",
        {
          type: "SalesOrder",
          id: salesOrderId,
        },
      ],
    }),

    updateSalesOrderItem: builder.mutation<
      SalesOrderResponse,
      {
        salesOrderId: number;
        itemId: number;
        body: CreateSalesOrderItemRequest;
      }
    >({
      query: ({ salesOrderId, itemId, body }) => ({
        url: `sales/${salesOrderId}/items/${itemId}/`,
        method: "PUT",
        body,
      }),

      invalidatesTags: (_result, _error, { salesOrderId }) => [
        "SalesOrder",
        {
          type: "SalesOrder",
          id: salesOrderId,
        },
      ],
    }),

    deleteSalesOrderItem: builder.mutation<
      SalesOrderResponse,
      {
        salesOrderId: number;
        itemId: number;
      }
    >({
      query: ({ salesOrderId, itemId }) => ({
        url: `sales/${salesOrderId}/items/${itemId}/`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, { salesOrderId }) => [
        "SalesOrder",
        {
          type: "SalesOrder",
          id: salesOrderId,
        },
      ],
    }),

    confirmSalesOrder: builder.mutation<SalesOrderResponse, number>({
      query: (salesOrderId) => ({
        url: `sales/${salesOrderId}/confirm/`,
        method: "POST",
      }),

      invalidatesTags: ["SalesOrder", "Inventory"],
    }),
  }),
});

export const {
  useGetSalesOrdersQuery,
  useGetSalesOrderQuery,
  useCreateSalesOrderMutation,
  useCreateSalesOrderItemMutation,
  useUpdateSalesOrderItemMutation,
  useDeleteSalesOrderItemMutation,
  useConfirmSalesOrderMutation,
} = salesApi;
