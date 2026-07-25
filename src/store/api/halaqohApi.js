import { baseApi } from "../baseApi";

export const halaqohApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllHalaqoh: builder.query({
      query: () => "/halaqoh",
      providesTags: ["Halaqoh"],
    }),

    getHalaqoh: builder.query({
      query: (id) => `/halaqoh/${id}`,
      providesTags: ["Halaqoh"],
    }),

    addHalaqoh: builder.mutation({
      query: (newHalaqoh) => ({
        url: "/halaqoh",
        method: "POST",
        body: newHalaqoh,
      }),
      invalidatesTags: ["Halaqoh"],
    }),

    editHalaqoh: builder.mutation({
      query: ({ id, updatedHalaqoh }) => ({
        url: `/halaqoh/${id}`,
        method: "PUT",
        body: updatedHalaqoh,
      }),
      invalidatesTags: ["Halaqoh"],
    }),

    deleteHalaqoh: builder.mutation({
      query: (id) => ({
        url: `/halaqoh/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Halaqoh"],
    }),
  }),
});

export const {
  useGetAllHalaqohQuery,
  useGetHalaqohQuery,
  useAddHalaqohMutation,
  useEditHalaqohMutation,
  useDeleteHalaqohMutation,
} = halaqohApi;
