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
      invalidatesTags: ["Student"],
    }),
    addTahsin: builder.mutation({
      query: ({ nis, ...assessmentData }) => ({
        url: `/assessment/tahsin/${nis}`,
        method: "POST",
        body: assessmentData,
      }),
      invalidatesTags: ["Student"],
    }),
  }),
});

export const {
  useGetRiwayatTahsinQuery,
  useAddPretestMutation,
  useAddTahsinMutation,
} = tahsinApi;
