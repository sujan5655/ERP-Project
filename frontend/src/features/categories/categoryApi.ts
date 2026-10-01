import { api } from "../../services/api";

import type {
  Category,
  CategoriesResponse,
  CreateCategoryRequest,
} from "./types";

const createCategoryFormData = (data: CreateCategoryRequest) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("slug", data.slug);
  formData.append("description", data.description);
  formData.append("is_active", String(data.is_active));

  if (data.image) {
    formData.append("image", data.image);
  }

  return formData;
};

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "products/categories/",
      providesTags: ["Category"],
    }),

    getCategory: builder.query<
      {
        success: boolean;
        message: string;
        category: Category;
      },
      number
    >({
      query: (id) => `products/categories/${id}/`,
    }),

    createCategory: builder.mutation<
      {
        success: boolean;
        message: string;
        category: Category;
      },
      CreateCategoryRequest
    >({
      query: (data) => ({
        url: "products/categories/",
        method: "POST",
        body: createCategoryFormData(data),
      }),

      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<
      {
        success: boolean;
        message: string;
        category: Category;
      },
      {
        id: number;
        data: CreateCategoryRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `products/categories/${id}/`,
        method: "PUT",
        body: createCategoryFormData(data),
      }),

      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      number
    >({
      query: (id) => ({
        url: `products/categories/${id}/`,
        method: "DELETE",
      }),

      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
