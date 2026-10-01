import { api } from "../../services/api";

import type { Branch, BranchesResponse, CreateBranchRequest } from "./types";

const createBranchFormData = (data: CreateBranchRequest) => {
  const formData = new FormData();

  formData.append("company", String(data.company));

  formData.append("name", data.name);
  formData.append("code", data.code);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("address", data.address);

  if (data.photo) {
    formData.append("photo", data.photo);
  }

  return formData;
};

export const branchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query<BranchesResponse, void>({
      query: () => "companies/branches/",
      providesTags: ["Branch"],
    }),

    getBranch: builder.query<
      {
        success: boolean;
        message: string;
        branch: Branch;
      },
      number
    >({
      query: (id) => `companies/branches/${id}/`,
    }),

    createBranch: builder.mutation<
      {
        success: boolean;
        message: string;
        branch: Branch;
      },
      CreateBranchRequest
    >({
      query: (data) => ({
        url: "companies/branches/",
        method: "POST",
        body: createBranchFormData(data),
      }),
      invalidatesTags: ["Branch"],
    }),

    updateBranch: builder.mutation<
      {
        success: boolean;
        message: string;
        branch: Branch;
      },
      {
        id: number;
        data: CreateBranchRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `companies/branches/${id}/`,
        method: "PUT",
        body: createBranchFormData(data),
      }),
      invalidatesTags: ["Branch"],
    }),

    deleteBranch: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      number
    >({
      query: (id) => ({
        url: `companies/branches/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Branch"],
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useGetBranchQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApi;
