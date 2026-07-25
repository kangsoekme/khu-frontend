import { baseApi } from "../baseApi";

export const surahApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSurah: builder.query({
      query: () => "/all-surah",
    }),
  }),
});

export const { useGetAllSurahQuery } = surahApi;
