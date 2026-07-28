import { baseApi } from "../baseApi";

export const tahsinApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRiwayatTahsin: builder.query({
      query: (nis) => `/assessment/tahsin/${nis}`,
      providesTags: ["Student"],
    }),
    addPretest: builder.mutation({
      query: ({ nis, ...pretestData }) => ({
        url: `/assessment/pretest/${nis}`,
        method: "POST",
        body: pretestData,
      }),
      invalidatesTags: ["Student", "Halaqoh", "Dashboard", "Laporan"],
    }),
    addTahsin: builder.mutation({
      query: ({ nis, ...assessmentData }) => ({
        url: `/assessment/tahsin/${nis}`,
        method: "POST",
        body: assessmentData,
      }),
      invalidatesTags: ["Student", "Halaqoh", "Dashboard", "Laporan"],
    }),
    editTahsin: builder.mutation({
      query: ({ id, ...assessmentData }) => ({
        url: `/assessment/tahsin/setoran/${id}`,
        method: "PUT",
        body: assessmentData,
      }),
      invalidatesTags: ["Student", "Halaqoh", "Dashboard", "Laporan"],
    }),
    deleteTahsin: builder.mutation({
      query: (id) => ({
        url: `/assessment/tahsin/setoran/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student", "Halaqoh", "Dashboard", "Laporan"],
    }),
  }),
});

export const {
  useGetRiwayatTahsinQuery,
  useAddPretestMutation,
  useAddTahsinMutation,
  useEditTahsinMutation,
  useDeleteTahsinMutation,
} = tahsinApi;
