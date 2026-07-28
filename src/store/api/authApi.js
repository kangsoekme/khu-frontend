import { baseApi } from "../baseApi.js";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    loginWali: builder.mutation({
      query: (credentials) => ({
        url: "auth/wali/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useLoginMutation, useLoginWaliMutation } = authApi;
