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
    // FE-5: tambahkan endpoint edit & delete hafalan agar fitur koreksi bisa dipakai
    editHafalan: builder.mutation({
      query: ({ id, ...hafalanData }) => ({
        url: `/assessment/tahfidz/hafalan/setoran/${id}`,
        method: "PUT",
        body: hafalanData,
      }),
      invalidatesTags: ["Student", "Halaqoh", "Dashboard", "Laporan"],
    }),
    deleteHafalan: builder.mutation({
      query: (id) => ({
        url: `/assessment/tahfidz/hafalan/setoran/${id}`,
        method: "DELETE",
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
    editMurajaah: builder.mutation({
      query: ({ id, ...murajaahData }) => ({
        url: `/assessment/tahfidz/murajaah/setoran/${id}`,
        method: "PUT",
        body: murajaahData,
      }),
      invalidatesTags: ["Student", "Halaqoh", "Dashboard", "Laporan"],
    }),
    deleteMurajaah: builder.mutation({
      query: (id) => ({
        url: `/assessment/tahfidz/murajaah/setoran/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student", "Halaqoh", "Dashboard", "Laporan"],
    }),
  }),
});

export const {
  useGetRiwayatHafalanQuery,
  useAddHafalanMutation,
  useEditHafalanMutation,
  useDeleteHafalanMutation,
  useGetRiwayatMurajaahQuery,
  useAddMurajaahMutation,
  useEditMurajaahMutation,
  useDeleteMurajaahMutation,
} = tahfidzApi;
