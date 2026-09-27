import { api } from "../services/api";
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
} from "./types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "auth/register/",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "auth/login/",
        method: "POST",
        body: data,
      }),
    }),

    getMe: builder.query<MeResponse, void>({
      query: () => "auth/me/",
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi;
