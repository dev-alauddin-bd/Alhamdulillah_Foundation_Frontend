import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

//==================================================================================
//                                SECURITY MIDDLEWARE
//==================================================================================
// Description: Global route protection and role-based access control (RBAC).
// Features: Token validation, public/private route handling, and role mapping.
//==================================================================================

const PUBLIC_ROUTES = ["/", "/unauthorized", "/privacy", "/terms"];
const AUTH_ROUTES = ["/login", "/register"];

// Map routes to required roles
const ROLE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard/users": ["SUPER_ADMIN", "ADMIN", "MEMBER"],
  "/dashboard/payments": ["SUPER_ADMIN", "ADMIN"],
  "/dashboard/funds": ["SUPER_ADMIN", "ADMIN"],
  "/dashboard/notices": ["SUPER_ADMIN", "ADMIN"],
  "/dashboard/projects": ["SUPER_ADMIN", "ADMIN"],
  "/dashboard/banners": ["SUPER_ADMIN", "ADMIN"],
  "/dashboard/management": ["SUPER_ADMIN", "ADMIN"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 🛡️ SECURITY WATCHDOG: RADAR SCAN
  console.log(`\x1b[36m[WATCHDOG]\x1b[0m 📡 Scanning route: ${pathname}`);

  // 1. Allow static assets and internal requests
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    PUBLIC_ROUTES.includes(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Handle Authentication Routes
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (refreshToken) {
      try {
        const secret = new TextEncoder().encode(
          process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET!,
        );
        await jwtVerify(refreshToken, secret);
        console.log(`\x1b[33m[WATCHDOG]\x1b[0m 🔄 Session active. Diverting from ${pathname} to dashboard.`);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch (e) {
        console.log(`\x1b[31m[WATCHDOG] ⚠️ Session stale on ${pathname}. Clearance provided for re-authentication.\x1b[0m`);
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 3. Handle Private Dashboard Routes
  if (pathname.startsWith("/dashboard")) {
    if (!refreshToken) {
      console.error(`\x1b[41m\x1b[37m[WATCHDOG] ❌ CRITICAL: Unauthorized access attempt at ${pathname}. No token found.\x1b[0m`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET!,
      );
      const { payload } = await jwtVerify(refreshToken, secret);
      const userRole = (payload.role as string) || "GUEST";

      console.log(`\x1b[32m[WATCHDOG]\x1b[0m 🛂 Identity Confirmed: [${userRole}] | Destination: ${pathname}`);

      // Check for Dashboard RBAC
      for (const [route, allowedRoles] of Object.entries(ROLE_PERMISSIONS)) {
        if (pathname.startsWith(route)) {
          if (!allowedRoles.includes(userRole)) {
            console.error(`\x1b[41m\x1b[37m[WATCHDOG] 🚫 RBAC DENIAL: Role [${userRole}] is NOT authorized for [${route}]. Requires one of: [${allowedRoles.join(", ")}]\x1b[0m`);
            return NextResponse.redirect(new URL("/unauthorized", request.url));
          }
        }
      }

      console.log(`\x1b[32m[WATCHDOG]\x1b[0m ✅ ACCESS GRANTED to ${userRole}. Proceeding...`);
      return NextResponse.next();
    } catch (error) {
       console.error(`\x1b[41m\x1b[37m[WATCHDOG] 💥 SECURITY BREACH: Token manipulation or expiration detected at ${pathname}.\x1b[0m`);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
