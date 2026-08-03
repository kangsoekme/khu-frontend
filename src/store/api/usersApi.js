import { baseApi } from "../baseApi.js";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => {
        let queryString = "";
        if (params) {
          // FE-1: kirim filter role ke server agar filter berfungsi dengan pagination
          const { page = 1, limit = 10, search = "", role = "" } = params;
          queryString = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
          if (role) queryString += `&role=${encodeURIComponent(role)}`;
        } else {
          queryString = "?limit=1000";
        }
        return `/users${queryString}`;
      },
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

    deleteBulkUsers: builder.mutation({
      query: (ids) => ({
        url: `/users/bulk-delete`,
        method: "POST",
        body: { ids },
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
  useDeleteBulkUsersMutation,
} = usersApi;
