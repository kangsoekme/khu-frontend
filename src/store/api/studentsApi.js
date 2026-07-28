import { baseApi } from "../baseApi";

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/students",
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
} = studentsApi;
