import { baseApi } from "../baseApi";

export const pengajuanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDaftarPengajuan: builder.query({
      query: (kategori) => `/pengajuan?kategori=${kategori}`,
      providesTags: ["Pengajuan"],
    }),

    ajukanUjian: builder.mutation({
      query: ({ nis, ...data }) => ({
        url: `/pengajuan/${nis}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pengajuan", "Student", "Dashboard"],
    }),
  }),
});

export const { useGetDaftarPengajuanQuery, useAjukanUjianMutation } =
  pengajuanApi;
