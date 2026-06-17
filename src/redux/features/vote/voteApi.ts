import baseApi from "../../baseApi";

const voteApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDecisions: builder.query({
      query: () => ({
        url: "/votes/decisions",
        method: "GET",
      }),
      providesTags: ["Vote"],
    }),
    getDecision: builder.query({
      query: (id) => ({
        url: `/votes/decisions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Vote", id }],
    }),
    createDecision: builder.mutation({
      query: (data) => ({
        url: "/votes/decisions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Vote"],
    }),
    castVote: builder.mutation({
      query: ({ id, option }) => ({
        url: `/votes/decisions/${id}/vote`,
        method: "POST",
        body: { option },
      }),
      invalidatesTags: (result, error, { id }) => ["Vote", { type: "Vote", id }],
    }),
    closeDecision: builder.mutation({
      query: (id) => ({
        url: `/votes/decisions/${id}/close`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => ["Vote", { type: "Vote", id }],
    }),
  }),
});

export const {
  useGetDecisionsQuery,
  useGetDecisionQuery,
  useCreateDecisionMutation,
  useCastVoteMutation,
  useCloseDecisionMutation,
} = voteApi;
