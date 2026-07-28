import { baseApi } from "../baseApi";

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: (params) => {
        let queryString = "";
        if (params) {
          const { page = 1, limit = 10, search = "" } = params;
          queryString = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
        } else {
          queryString = "?limit=1000";
        }
        return `/students${queryString}`;
      },
      providesTags: ["Student"],
    }),
    getStudent: builder.query({
      query: (nis) => `/student/${nis}`,
      providesTags: ["Student"],
    }),

    addStudent: builder.mutation({
      query: (studentData) => ({
        url: "/student",
        method: "POST",
        body: studentData,
      }),
      invalidatesTags: [
        "Student",
        "Halaqoh",
        "Dashboard",
        "Pengajuan",
        "Ujian",
        "Laporan",
      ],
    }),

    editStudent: builder.mutation({
      query: ({ nis, ...restData }) => ({
        url: `/student/${nis}`,
        method: "PUT",
        body: restData,
      }),
      invalidatesTags: [
        "Student",
        "Halaqoh",
        "Dashboard",
        "Pengajuan",
        "Ujian",
        "Laporan",
      ],
    }),

    deleteStudent: builder.mutation({
      query: (nis) => ({
        url: `/student/${nis}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "Student",
        "Halaqoh",
        "Dashboard",
        "Pengajuan",
        "Ujian",
        "Laporan",
      ],
    }),

    deleteBulkStudents: builder.mutation({
      query: (nis_array) => ({
        url: `/siswa/bulk-delete`,
        method: "POST",
        body: { nis_array },
      }),
      invalidatesTags: ["Student", "Halaqoh", "Dashboard"],
    }),

    importStudent: builder.mutation({
      query: (formData) => ({
        url: `/student/import`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        "Student",
        "Halaqoh",
        "Dashboard",
        "Pengajuan",
        "Ujian",
        "Laporan",
      ],
    }),
    getWaitingPretest: builder.query({
      query: () => `/students/waiting/pretest`,
      providesTags: ["Student"],
    }),
    getWaitingHalaqoh: builder.query({
      query: ({ kategori }) => `/students/waiting/halaqoh?kategori=${kategori}`,
      providesTags: ["Student"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetStudentQuery,
  useGetStudentsQuery,
  useAddStudentMutation,
  useEditStudentMutation,
  useDeleteStudentMutation,
  useImportStudentMutation,
  useDeleteBulkStudentsMutation,
  useGetWaitingPretestQuery,
  useGetWaitingHalaqohQuery,
} = studentsApi;
