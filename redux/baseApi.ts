import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { IUser, logout, setUser } from "./features/auth/authSlice";
import { RootState } from "./store";

/**
 * ============================
 * Refresh Token API Response
 * ============================
 */
interface IRefreshResponse {
  success: boolean;
  data: {
    user: IUser;
    accessToken: string;
  };
}

/**
 * ============================
 * Mutex (prevent multiple refresh calls)
 * ============================
 */
const mutex = new Mutex();

/**
 * ============================
 * Base Query
 * ============================
 */
const baseQuery = fetchBaseQuery({
  baseUrl: `/api`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.AFAuth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

/**
 * ============================
 * Base Query with Re-Auth
 * ============================
 */

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions,
) => {
  // console.log("➡️ API Request Started:", args);

  // wait if another refresh is running
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);
  // console.log(result)

  // if (result.error) {
  //   console.error("❌ API Error:", {
  //     url: args,
  //     status: result.error.status,
  //     error: result.error,
  //   });
  // }

  if (result.error?.status === 401) {
    if (mutex.isLocked()) {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    } else {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh-token", method: "POST" },
          api,
          extraOptions,
        );

        const refreshData = refreshResult.data as IRefreshResponse;

        if (refreshData?.data?.accessToken) {
          api.dispatch(
            setUser({
              user: refreshData.data.user,
              accessToken: refreshData.data.accessToken,
            }),
          );

          result = await baseQuery(args, api, extraOptions);
        } else {
          // If refresh fails, clear auth state
          api.dispatch(logout());
        }
      } catch (err) {
        api.dispatch(logout());
      } finally {
        release();
      }
    }
  }

  // console.log("✅ API Request Finished:", args);
  return result;
};

/**
 * ============================
 * Base API
 * ============================
 */
const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Auth",
    "Project",
    "Banner",
    "Payment",
    "Vote",
    "Fund",
    "Management",
    "Notice",
    "Sessions"
  ],
  endpoints: () => ({}),
});

export default baseApi;
