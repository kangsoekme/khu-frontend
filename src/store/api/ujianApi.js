import { baseApi } from "../baseApi";

export const ujianApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRiwayatUjian: builder.query({
      query: (nis) => `/ujian/tahsin/${nis}`,
      providesTags: ["Ujian", "Student"],
    }),

    addUjianKenaikan: builder.mutation({
      query: ({ nis, ...ujianData }) => ({
        url: `/ujian/tahsin/${nis}`,
        method: "POST",
        body: ujianData,
      }),
      invalidatesTags: [
        "Pengajuan",
        "Student",
        "Halaqoh",
        "Dashboard",
        "Ujian",
        "Laporan",
      ],
    }),
  }),
});

export const { useGetRiwayatUjianQuery, useAddUjianKenaikanMutation } =
  ujianApi;
