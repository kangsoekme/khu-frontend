import { baseApi } from "../baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (buider) => ({
    getSuperAdminDashboard: buider.query({
      query: () => `/dashboard/super-admin`,
      providesTags: ["Dashboard"],
    }),
    getDirekturDashboard: buider.query({
      query: () => `/dashboard/direktur`,
      providesTags: ["Dashboard"],
    }),

    getGuruDashboard: buider.query({
      query: () => `/dashboard/guru`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetSuperAdminDashboardQuery,
  useGetDirekturDashboardQuery,
  useGetGuruDashboardQuery,
} = dashboardApi;
