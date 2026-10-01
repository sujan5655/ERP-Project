import { api } from "../../services/api";

import type {
  StockMovement,
  StockMovementsResponse,
  CreateStockMovementRequest,
} from "./stockMovementTypes";

const stockMovementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStockMovements: builder.query<StockMovementsResponse, void>({
      query: () => "inventory/movements/",
      providesTags: ["Inventory"],
    }),

    getStockMovement: builder.query<StockMovement, number>({
      query: (id) => `inventory/movements/${id}/`,
      providesTags: ["Inventory"],
    }),

    createStockMovement: builder.mutation<
      StockMovement,
      CreateStockMovementRequest
    >({
      query: (data) => ({
        url: "inventory/movements/",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Inventory"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetStockMovementsQuery,
  useGetStockMovementQuery,
  useCreateStockMovementMutation,
} = stockMovementApi;
