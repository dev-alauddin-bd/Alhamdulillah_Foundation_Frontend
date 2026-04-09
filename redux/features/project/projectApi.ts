import baseApi from "../../baseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (params) => ({
        url: "/projects",
        method: "GET",
        params,
      }),
      providesTags: ["Project"],
    }),
    getProject: builder.query({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation({
      query: (data) => ({
        url: "/projects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),

    // 👥 MEMBER MANAGEMENT
    getProjectMembers: builder.query({
      query: (id) => ({
        url: `/projects/${id}/members`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Project", id: `MEMBERS-${id}` }],
    }),
    addProjectMember: builder.mutation({
      query: ({ projectId, memberData }) => ({
        url: `/projects/${projectId}/members`,
        method: "POST",
        body: memberData,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        "Project",
        { type: "Project", id: `MEMBERS-${projectId}` },
      ],
    }),
    removeProjectMember: builder.mutation({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        "Project",
        { type: "Project", id: `MEMBERS-${projectId}` },
      ],
    }),
    settleProject: builder.mutation({
      query: ({ projectId, profit, loss }) => ({
        url: `/projects/${projectId}/settle`,
        method: "POST",
        body: { profit, loss },
      }),
      invalidatesTags: ["Project"],
    }),
    updateInvestigation: builder.mutation({
      query: ({ projectId, report, approvals }) => ({
        url: `/projects/${projectId}/investigation`,
        method: "PATCH",
        body: { report, approvals },
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
  useSettleProjectMutation,
  useUpdateInvestigationMutation,
} = projectApi;
