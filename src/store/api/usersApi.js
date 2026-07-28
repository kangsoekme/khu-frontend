import { baseApi } from "../baseApi.js";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["User"],
    }),

    addUser: builder.mutation({
      query: (userData) => ({
        url: "/user",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User", "Halaqoh", "Dashboard"],
    }),

    editUser: builder.mutation({
      query: ({ id, ...sisaData }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: sisaData,
      }),
      invalidatesTags: ["User", "Halaqoh", "Dashboard"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Halaqoh", "Dashboard"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
} = usersApi;
