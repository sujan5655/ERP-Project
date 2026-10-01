import { api } from "../../services/api";

import type { Product, ProductsResponse, CreateProductRequest } from "./types";

const buildProductFormData = (data: CreateProductRequest) => {
  const formData = new FormData();

  formData.append("category", String(data.category));

  if (data.brand !== null) {
    formData.append("brand", String(data.brand));
  }

  formData.append("name", data.name);

  formData.append("sku", data.sku);

  formData.append("description", data.description);

  formData.append("cost_price", data.cost_price);

  formData.append("selling_price", data.selling_price);

  formData.append("tax_rate", data.tax_rate);

  formData.append("reorder_level", String(data.reorder_level));

  formData.append("unit", data.unit);

  formData.append("is_active", String(data.is_active));

  if (data.image) {
    formData.append("image", data.image);
  }

  return formData;
};

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, void>({
      query: () => "products/products/",
      providesTags: ["Product"],
    }),

    getProduct: builder.query<Product, number>({
      query: (id) => `products/products/${id}/`,

      providesTags: ["Product"],
    }),

    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (data) => ({
        url: "products/products/",
        method: "POST",
        body: buildProductFormData(data),
      }),

      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<
      Product,
      {
        id: number;
        data: CreateProductRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `products/products/${id}/`,
        method: "PUT",
        body: buildProductFormData(data),
      }),

      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `products/products/${id}/`,
        method: "DELETE",
      }),

      invalidatesTags: ["Product"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
