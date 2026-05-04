import baseApi from "@/redux/baseApi";
import { setUser, updateUser } from "./authSlice";

// ===== 🔹 Inject auth-related endpoints into baseApi =====
const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ===== ✅ Signup user =====
    signUpUser: build.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    // ===== ✅ Login user =====
    loginUser: build.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    getMe: build.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.user && data?.data?.accessToken) {
            dispatch(
              setUser({
                user: data.data.user,
                accessToken: data.data.accessToken,
              })
            );
          } else if (data?.data?.user) {
            dispatch(updateUser(data.data.user));
          } else if (data?.data?._id) {
            // If data itself is the user object
            dispatch(updateUser(data.data));
          }
        } catch (error) {
          // Handle sync errors silently, RTK Query will handle the actual error state
        }
      },
    }),

    // ===== ✅ Get stats =====
    getStats: build.query({
      query: () => ({
        url: `/auth/stats`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // ===== ✅ Logout user =====
    logoutUser: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // ===== ✅ Sync Session (Force Cookie Update) =====
    syncSession: build.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.user && data?.data?.accessToken) {
            dispatch(
              setUser({
                user: data.data.user,
                accessToken: data.data.accessToken,
              })
            );
          }
        } catch (error) {
          // No-op
        }
      },
    }),
    
    // ===== ✅ Change Password with OTP =====
    changePassword: build.mutation({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),

    // ===== ✅ Send OTP =====
    sendOtp: build.mutation({
      query: () => ({
        url: "/auth/send-otp",
        method: "POST",
      }),
    }),
    // ===== ✅ Sessions =====
    getSessions: build.query({
      query: () => ({
        url: "/auth/sessions",
        method: "GET",
      }),
      providesTags: ["Sessions"],
    }),

    revokeSession: build.mutation({
      query: (sessionId) => ({
        url: `/auth/revoke-session/${sessionId}`,
        method: "POST",
        body: { sessionId },
      }),
      invalidatesTags: ["Sessions"],
    }),

    sendRegistrationOtp: build.mutation({
        query: (email) => ({
            url: "/auth/send-registration-otp",
            method: "POST",
            body: { email },
        }),
    }),

    sendPasswordOtp: build.mutation({
        query: () => ({
            url: "/auth/send-password-otp",
            method: "POST",
        }),
    }),
  }),
});

// =====  Export auto-generated hooks =====
export const {
  useSignUpUserMutation,
  useLoginUserMutation,
  useGetMeQuery,
  useGetStatsQuery,
  useLogoutUserMutation,
  useSyncSessionMutation,
  useChangePasswordMutation,
  useSendOtpMutation,
  useGetSessionsQuery,
  useRevokeSessionMutation,
  useSendRegistrationOtpMutation,
  useSendPasswordOtpMutation,
} = authApi;

export default authApi;
