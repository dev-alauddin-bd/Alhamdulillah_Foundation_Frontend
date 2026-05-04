import baseApi from "../../baseApi";

const managementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
getManagements: builder.query<
  {
    data: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPage: number;
    };
  },
  {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    committeeType?: string;
  }
>({
  query: (params) => ({
    url: "/management",
    method: "GET",
    params,
  }),
  providesTags: ["Management"],
}),

    getManagementById: builder.query({
      query: (id) => ({
        url: `/management/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Management", id }],
    }),
    createManagement: builder.mutation({
      query: (data) => ({
        url: "/management",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Management"],
    }),
    updateManagement: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/management/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Management"],
    }),
    deleteManagement: builder.mutation({
      query: (id) => ({
        url: `/management/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Management"],
    }),
  }),
});

export const {
  useGetManagementsQuery,
  useGetManagementByIdQuery,
  useCreateManagementMutation,
  useUpdateManagementMutation,
  useDeleteManagementMutation,
} = managementApi;
