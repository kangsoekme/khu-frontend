import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const expiresAt = localStorage.getItem("session_expires_at");
  if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
    localStorage.clear();
    window.location.href = "/";
    return { error: { status: 401, data: { message: "Session expired" } } };
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    localStorage.clear();
    window.location.href = "/";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "User",
    "Student",
    "Auth",
    "Halaqoh",
    "Dashboard",
    "Pengajuan",
    "Ujian",
    "Laporan",
    "TahunAkademik",
  ],
  endpoints: () => ({}),
});
