import baseApi from "@/redux/baseApi";

export interface INotice {
  _id: string;
  title: string;
  fileUrl: string;
  isActive: boolean;
  createdAt: string;
  submitBy?: {
    _id: string;
    name: string;
  };
}

export const noticeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===============================
    // ✅ CREATE NOTICE
    // ===============================
    createNotice: builder.mutation<
      INotice,
      {
        title: string;
        fileUrl: string;
      }
    >({
      query: (data) => ({
        url: "/notices",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notice"],
    }),

    // ===============================
    // ✅ GET ALL NOTICES (PUBLIC / ADMIN)
    // ===============================
    getNotices: builder.query({
      query: () => ({
        url: "/notices",
        method: "GET",
      }),
      providesTags: ["Notice"],
   
    }),

    // ===============================
    // ✅ DELETE NOTICE (ADMIN)
    // ===============================
    deleteNotice: builder.mutation<
      { message: string },
      string // noticeId
    >({
      query: (id) => ({
        url: `/notices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notice"],
    }),

    // ===============================
    // ✅ TOGGLE NOTICE STATUS (OPTIONAL)
    // ===============================
    toggleNotice: builder.mutation<
      INotice,
      string
    >({
      query: (id) => ({
        url: `/notices/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notice"],
    }),
  }),
});

export const {
  useCreateNoticeMutation,
  useGetNoticesQuery,
  useDeleteNoticeMutation,
  useToggleNoticeMutation,
} = noticeApi;
