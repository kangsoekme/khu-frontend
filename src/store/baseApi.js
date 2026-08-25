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

// Helper: redirect ke halaman login yang sesuai dengan role di localStorage.
// WALI-3: sebelumnya selalu redirect ke "/" — untuk user WALI ini menyebabkan
// loop (ProtectedRoute → /wali). Sekarang arahkan WALI ke portalnya sendiri.
const redirectToLogin = () => {
  const role = localStorage.getItem("role");
  const waliPath = role === "WALI" ? "/login?tab=wali" : "/";
  localStorage.clear();
  // Gunakan replace agar tidak menambah entri history (tombol back tidak loop).
  window.location.replace(waliPath);
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const expiresAt = localStorage.getItem("session_expires_at");
  if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
    redirectToLogin();
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
      redirectToLogin();
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
