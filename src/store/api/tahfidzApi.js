import { baseApi } from "../baseApi";

export const tahfidzApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRiwayatHafalan: builder.query({
      query: (nis) => `/assessment/tahfidz/hafalan/${nis}`,
      providesTags: ["Student"],
    }),
    addHafalan: builder.mutation({
      query: ({ nis, ...hafalanData }) => ({
        url: `/assessment/tahfidz/hafalan/${nis}`,
        method: "POST",
        body: hafalanData,
      }),
      invalidatesTags: ["Student", "Halaqoh", "Dashboard", "Laporan"],
    }),

    getRiwayatMurajaah: builder.query({
      query: (nis) => `/assessment/tahfidz/murajaah/${nis}`,
      providesTags: ["Student"],
    }),
    addMurajaah: builder.mutation({
      query: ({ nis, ...murajaahData }) => ({
        url: `/assessment/tahfidz/murajaah/${nis}`,
        method: "POST",
        body: murajaahData,
      }),
      invalidatesTags: ["Student", "Halaqoh", "Dashboard", "Laporan"],
    }),
  }),
});

export const {
  useGetRiwayatHafalanQuery,
  useAddHafalanMutation,
  useGetRiwayatMurajaahQuery,
  useAddMurajaahMutation,
} = tahfidzApi;
