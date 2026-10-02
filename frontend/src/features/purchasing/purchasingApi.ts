import { api } from "../../services/api";

import type {
  PurchaseOrderListResponse,
  PurchaseOrderResponse,
  CreatePurchaseOrderRequest,
  CreatePurchaseOrderItemRequest,
} from "./types";

export const purchasingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseOrders: builder.query<PurchaseOrderListResponse, void>({
      query: () => "purchasing/",
      providesTags: ["PurchaseOrder"],
    }),

    getPurchaseOrder: builder.query<PurchaseOrderResponse, number>({
      query: (id) => `purchasing/${id}/`,
      providesTags: (_result, _error, id) => [
        {
          type: "PurchaseOrder",
          id,
        },
      ],
    }),

    createPurchaseOrder: builder.mutation<
      PurchaseOrderResponse,
      CreatePurchaseOrderRequest
    >({
      query: (body) => ({
        url: "purchasing/",
        method: "POST",
        body,
      }),

      invalidatesTags: ["PurchaseOrder"],
    }),

    createPurchaseOrderItem: builder.mutation<
      PurchaseOrderResponse,
      {
        purchaseOrderId: number;
        body: CreatePurchaseOrderItemRequest;
      }
    >({
      query: ({ purchaseOrderId, body }) => ({
        url: `purchasing/${purchaseOrderId}/items/`,
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, { purchaseOrderId }) => [
        "PurchaseOrder",
        {
          type: "PurchaseOrder",
          id: purchaseOrderId,
        },
      ],
    }),

    updatePurchaseOrderItem: builder.mutation<
      PurchaseOrderResponse,
      {
        purchaseOrderId: number;
        itemId: number;
        body: CreatePurchaseOrderItemRequest;
      }
    >({
      query: ({ purchaseOrderId, itemId, body }) => ({
        url: `purchasing/${purchaseOrderId}/items/${itemId}/`,
        method: "PUT",
        body,
      }),

      invalidatesTags: (_result, _error, { purchaseOrderId }) => [
        "PurchaseOrder",
        {
          type: "PurchaseOrder",
          id: purchaseOrderId,
        },
      ],
    }),

    deletePurchaseOrderItem: builder.mutation<
      PurchaseOrderResponse,
      {
        purchaseOrderId: number;
        itemId: number;
      }
    >({
      query: ({ purchaseOrderId, itemId }) => ({
        url: `purchasing/${purchaseOrderId}/items/${itemId}/`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, { purchaseOrderId }) => [
        "PurchaseOrder",
        {
          type: "PurchaseOrder",
          id: purchaseOrderId,
        },
      ],
    }),

    confirmPurchaseOrder: builder.mutation<PurchaseOrderResponse, number>({
      query: (purchaseOrderId) => ({
        url: `purchasing/${purchaseOrderId}/confirm/`,
        method: "POST",
      }),

      invalidatesTags: ["PurchaseOrder"],
    }),

    receivePurchaseOrder: builder.mutation<PurchaseOrderResponse, number>({
      query: (purchaseOrderId) => ({
        url: `purchasing/${purchaseOrderId}/receive/`,
        method: "POST",
      }),

      invalidatesTags: ["PurchaseOrder", "Inventory"],
    }),
  }),
});

export const {
  useGetPurchaseOrdersQuery,
  useGetPurchaseOrderQuery,
  useCreatePurchaseOrderMutation,
  useCreatePurchaseOrderItemMutation,
  useUpdatePurchaseOrderItemMutation,
  useDeletePurchaseOrderItemMutation,
  useConfirmPurchaseOrderMutation,
  useReceivePurchaseOrderMutation,
} = purchasingApi;
