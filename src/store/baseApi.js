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
    // Bedakan 401 "kredensial salah" (endpoint login) vs "sesi/token expired".
    // Untuk endpoint login, teruskan error ke komponen agar toast validasi muncul.
    // Hanya redirect untuk request terautentikasi yang token-nya expired/dicabut.
    // args.url tidak punya leading slash (cth. "auth/login"), jadi match tanpa slash.
    const url = typeof args === "string" ? args : args?.url || "";
    const isAuthEndpoint =
      url.includes("auth/login") || url.includes("auth/wali/login");
    if (!isAuthEndpoint) {
      localStorage.clear();
      window.location.href = "/";
    }
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
