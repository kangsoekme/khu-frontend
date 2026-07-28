import { baseApi } from "../baseApi";

export const tahunAkademikApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTahunAkademik: builder.query({
      query: () => "/tahun-akademik",
      providesTags: ["TahunAkademik"],
    }),
    getActiveTahunAkademik: builder.query({
      query: () => "/tahun-akademik/active",
      providesTags: ["TahunAkademik"],
    }),
    createTahunAkademik: builder.mutation({
      query: (payload) => ({
        url: "/tahun-akademik",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TahunAkademik"],
    }),
    activateTahunAkademik: builder.mutation({
      query: (id) => ({
        url: `/tahun-akademik/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: [
        "TahunAkademik",
        "Student",
        "Halaqoh",
        "Dashboard",
        "Laporan",
        "Ujian",
        "Pengajuan",
      ],
    }),
    triggerTransisiSemester: builder.mutation({
      query: (payload) => ({
        url: "/tahun-akademik/transisi",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "TahunAkademik",
        "Student",
        "Halaqoh",
        "Dashboard",
        "Laporan",
        "Ujian",
        "Pengajuan",
      ],
    }),
  }),
});

export const {
  useGetAllTahunAkademikQuery,
  useGetActiveTahunAkademikQuery,
  useCreateTahunAkademikMutation,
  useActivateTahunAkademikMutation,
  useTriggerTransisiSemesterMutation,
} = tahunAkademikApi;
