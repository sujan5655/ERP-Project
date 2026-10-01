import { api } from "../../services/api";
import type { Brand, BrandsResponse, CreateBrandRequest } from "./types";

const buildBrandFormData = (data: CreateBrandRequest) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("slug", data.slug);
  formData.append("description", data.description);
  formData.append("is_active", String(data.is_active));

  if (data.logo) {
    formData.append("logo", data.logo);
  }

  return formData;
};

export const brandApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<BrandsResponse, void>({
      query: () => "products/brands/",
      providesTags: ["Brand"],
    }),

    getBrand: builder.query<Brand, number>({
      query: (id) => `products/brands/${id}/`,
      providesTags: ["Brand"],
    }),

    createBrand: builder.mutation<Brand, CreateBrandRequest>({
      query: (data) => ({
        url: "products/brands/",
        method: "POST",
        body: buildBrandFormData(data),
      }),
      invalidatesTags: ["Brand"],
    }),

    updateBrand: builder.mutation<
      Brand,
      {
        id: number;
        data: CreateBrandRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `products/brands/${id}/`,
        method: "PUT",
        body: buildBrandFormData(data),
      }),
      invalidatesTags: ["Brand"],
    }),

    deleteBrand: builder.mutation<void, number>({
      query: (id) => ({
        url: `products/brands/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetBrandsQuery,
  useGetBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
