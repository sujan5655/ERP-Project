import { api } from "../../services/api";

import type {
  Inventory,
  InventoriesResponse,
  CreateInventoryRequest,
} from "./types";

const inventoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInventories: builder.query<InventoriesResponse, void>({
      query: () => "inventory/",
      providesTags: ["Inventory"],
    }),

    getInventory: builder.query<Inventory, number>({
      query: (id) => `inventory/${id}/`,
      providesTags: ["Inventory"],
    }),

    createInventory: builder.mutation<Inventory, CreateInventoryRequest>({
      query: (data) => ({
        url: "inventory/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),

    updateInventory: builder.mutation<
      Inventory,
      {
        id: number;
        data: CreateInventoryRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `inventory/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),

    deleteInventory: builder.mutation<void, number>({
      query: (id) => ({
        url: `inventory/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetInventoriesQuery,
  useGetInventoryQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} = inventoryApi;
