"use client";

import React, { ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, setUser } from "@/redux/features/auth/authSlice";
import { useGetMeQuery, useSyncSessionMutation } from "@/redux/features/auth/authApi";
import { useSearchParams } from "next/navigation";

interface SessionSyncProps {
  children: ReactNode;
}

/**
 * SessionSync handles the global synchronization of user state.
 * It ensures that the Redux store (which might have stale persisted data)
 * stays in sync with the server, especially after role changes or status updates.
 */
export const SessionSync = ({ children }: SessionSyncProps) => {
  const user = useSelector(selectCurrentUser);

  // We call getMe query. 
  // It has a lifecycle hook (onQueryStarted) that automatically updates the store.
  // We only run this if we have a user in the store (meaning they are logged in).
  const { data: serverUser, isFetching } = useGetMeQuery(undefined, {
    skip: !user,
    // This ensures we always get the latest data when the app mounts
    refetchOnMountOrArgChange: true, 
  });

  const [syncSession] = useSyncSessionMutation();

  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const loginSuccess = searchParams.get("login");

    if (accessToken && loginSuccess) {
      // 1. Set user in Redux immediately
      // We don't have the full user object yet, but we have the token
      // The 'me' query below will fetch the user details
      dispatch(setUser({ user: null, accessToken })); 
      
      // 2. Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // 3. Force sync
      syncSession(undefined);
    }
  }, [searchParams, dispatch, syncSession]);

  // 🔄 Watch for role changes and sync cookies automatically
  useEffect(() => {
    const pathname = window.location.pathname;
    
    if (serverUser?.data?.user && user) {
        const sRole = serverUser.data.user.role;
        const lRole = user.role;

        // Condition 1: Role in DB is different from what we have in our Redux store/Token
        const isMismatched = sRole !== lRole;
        
        // Condition 2: We are stuck on the unauthorized page but the DB says we have high clearance
        const hasClearance = sRole === "MEMBER" || sRole === "ADMIN" || sRole === "SUPER_ADMIN";
        const isStuckOnUnauthorized = pathname === "/unauthorized" && hasClearance;

        if (isMismatched || isStuckOnUnauthorized) {
            console.warn(`🔐 [WATCHDOG] Session desync detected! Server: ${sRole}, Local: ${lRole}. Syncing foundation identity...`);
            
            // We just need to trigger ANY authenticated request to get the new cookie from our updated 'me' endpoint
            // or explicitly call syncSession. Let's do syncSession for good measure.
            syncSession(undefined).unwrap().then(() => {
                console.log("✅ [WATCHDOG] Identity successfully synchronized with the foundation records.");
                
                if (pathname === "/unauthorized") {
                    // Force navigation back to the command center
                    window.location.href = "/dashboard";
                } else {
                    window.location.reload();
                }
            }).catch((err) => {
                console.error("❌ [WATCHDOG] Strategic calibration failed:", err);
            });
        }
    }
  }, [serverUser, user, syncSession]);

  return <>{children}</>;
};
