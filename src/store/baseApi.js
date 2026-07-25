import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_API_URL = "http://localhost:5000/api";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["User", "Student", "Auth"],
  endpoints: () => ({}),
});
