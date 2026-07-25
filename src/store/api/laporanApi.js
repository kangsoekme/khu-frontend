import { baseApi } from "../baseApi";

export const laporanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLaporanTahfidz: builder.query({
      query: () => `/laporan/tahfidz`,
    }),
    getLaporanTahsin: builder.query({
      query: () => `/laporan/tahsin`,
    }),
  }),
});

export const { useLazyGetLaporanTahfidzQuery, useLazyGetLaporanTahsinQuery } =
  laporanApi;
