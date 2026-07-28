import { baseApi } from "../baseApi";

export const laporanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLaporanTahfidz: builder.query({
      query: () => `/laporan/tahfidz`,
      providesTags: ["Laporan"],
    }),
    getLaporanTahsin: builder.query({
      query: () => `/laporan/tahsin`,
      providesTags: ["Laporan"],
    }),
  }),
});

export const { useLazyGetLaporanTahfidzQuery, useLazyGetLaporanTahsinQuery } =
  laporanApi;
