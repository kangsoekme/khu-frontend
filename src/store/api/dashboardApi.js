import { baseApi } from "../baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminDashboard: builder.query({
      query: () => `/dashboard/super-admin`,
      providesTags: ["Dashboard"],
    }),
    getDirekturDashboard: builder.query({
      query: () => `/dashboard/direktur`,
      providesTags: ["Dashboard"],
    }),

    getGuruDashboard: builder.query({
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
