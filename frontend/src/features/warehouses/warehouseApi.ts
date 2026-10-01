import { api } from "../../services/api";

import type {
  Warehouse,
  WarehousesResponse,
  CreateWarehouseRequest,
} from "./types";

const createWarehouseFormData = (data: CreateWarehouseRequest) => {
  const formData = new FormData();

  formData.append("branch", String(data.branch));

  formData.append("name", data.name);

  formData.append("code", data.code);

  formData.append("address", data.address);

  formData.append("manager_name", data.manager_name);

  formData.append("phone", data.phone);

  formData.append("capacity", data.capacity);

  formData.append("is_active", String(data.is_active));

  if (data.photo) {
    formData.append("photo", data.photo);
  }

  return formData;
};

export const warehouseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWarehouses: builder.query<WarehousesResponse, void>({
      query: () => "warehouses/",
      providesTags: ["Warehouse"],
    }),

    getWarehouse: builder.query<
      {
        success: boolean;
        message: string;
        warehouse: Warehouse;
      },
      number
    >({
      query: (id) => `warehouses/${id}/`,
    }),

    createWarehouse: builder.mutation<
      {
        success: boolean;
        message: string;
        warehouse: Warehouse;
      },
      CreateWarehouseRequest
    >({
      query: (data) => ({
        url: "warehouses/",
        method: "POST",
        body: createWarehouseFormData(data),
      }),

      invalidatesTags: ["Warehouse"],
    }),

    updateWarehouse: builder.mutation<
      {
        success: boolean;
        message: string;
        warehouse: Warehouse;
      },
      {
        id: number;
        data: CreateWarehouseRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `warehouses/${id}/`,
        method: "PUT",
        body: createWarehouseFormData(data),
      }),

      invalidatesTags: ["Warehouse"],
    }),

    deleteWarehouse: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      number
    >({
      query: (id) => ({
        url: `warehouses/${id}/`,
        method: "DELETE",
      }),

      invalidatesTags: ["Warehouse"],
    }),
  }),
});

export const {
  useGetWarehousesQuery,
  useGetWarehouseQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} = warehouseApi;
