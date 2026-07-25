import { baseApi } from "../baseApi";

export const ujianApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRiwayatUjian: builder.query({
      query: (nis) => `/ujian/tahsin/${nis}`,
      providesTags: ["Student"],
    }),

    addUjianKenaikan: builder.mutation({
      query: ({ nis, ...ujianData }) => ({
        url: `/ujian/tahsin/${nis}`,
        method: "POST",
        body: ujianData,
      }),
      invalidatesTags: ["Pengajuan", "Student"],
    }),
  }),
});

export const { useGetRiwayatUjianQuery, useAddUjianKenaikanMutation } =
  ujianApi;
