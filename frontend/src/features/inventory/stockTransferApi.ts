import { api } from "../../services/api";

import type {
  StockTransfer,
  StockTransfersResponse,
  CreateStockTransferRequest,
} from "./stockTransferTypes";

const stockTransferApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStockTransfers: builder.query<StockTransfersResponse, void>({
      query: () => "inventory/transfers/",
      providesTags: ["Inventory"],
    }),

    createStockTransfer: builder.mutation<
      StockTransfer,
      CreateStockTransferRequest
    >({
      query: (data) => ({
        url: "inventory/transfers/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),
  }),

  overrideExisting: false,
});

export const { useGetStockTransfersQuery, useCreateStockTransferMutation } =
  stockTransferApi;
