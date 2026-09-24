import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";
import jwt from "jsonwebtoken";
import { auth } from "./auth";

import { socialAuth } from "./lib/api/socialAuth";
import { refreshAccessTokenServer } from "./lib/api/refreshAccessTokenServer";

type Role = "user" | "instructor" | "admin";

type JwtPayload = {
  id: string;
  role: Role;
};

type SessionUser = {
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: Role;
};

const protectedRoutes = ["/profile", "/dashboard", "/access-course"];

const adminRoutes = ["/admin"];

const instructorRoutes = ["/instructor"];

const isRouteMatch = (pathname: string, routes: string[]) => {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
};

const isAuthPage = (pathname: string) => {
  return (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password"
  );
};

const isRoleAllowed = (pathname: string, role: Role) => {
  if (isRouteMatch(pathname, adminRoutes)) {
    return role === "admin";
  }

  if (isRouteMatch(pathname, instructorRoutes)) {
    return role === "instructor";
  }

  return true;
};

const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
};

const setAuthCookies = (
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) => {
  const accessExpireMin = Number(process.env.ACCESS_TOKEN_EXPIRE);

  const refreshExpireDays = Number(process.env.REFRESH_TOKEN_EXPIRE);

  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + accessExpireMin * 60 * 1000),
    maxAge: accessExpireMin * 60,
    path: "/",
  });

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + refreshExpireDays * 24 * 60 * 60 * 1000),
    maxAge: refreshExpireDays * 24 * 60 * 60,
    path: "/",
  });

  return response;
};

const redirectToHome = (request: NextAuthRequest) => {
  return NextResponse.redirect(new URL("/", request.url));
};

const redirectToLogin = (request: NextAuthRequest) => {
  return NextResponse.redirect(new URL("/login", request.url));
};

const proxy = auth(async (request: NextAuthRequest) => {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = isRouteMatch(pathname, protectedRoutes);

  const isAdminRoute = isRouteMatch(pathname, adminRoutes);

  const isInstructorRoute = isRouteMatch(pathname, instructorRoutes);

  const requiresAuthentication =
    isProtectedRoute || isAdminRoute || isInstructorRoute;

  // 1 Check access token from cookies
  const accessToken = request.cookies.get("access_token")?.value;

  if (accessToken) {
    const payload = verifyAccessToken(accessToken);

    if (payload) {
      // Already authenticated
      if (isAuthPage(pathname)) {
        return redirectToHome(request);
      }

      // Role authorization
      if (!isRoleAllowed(pathname, payload.role)) {
        return redirectToHome(request);
      }

      return NextResponse.next();
    }
  }

  // 2. Refresh access token when access token is expired
  try {
    const result = await refreshAccessTokenServer(
      request.headers.get("cookie") ?? "",
    );

    // return check new access token is valid or not Expired
    const payload = verifyAccessToken(result.accessToken);

    if (payload) {
      if (isAuthPage(pathname)) {
        return setAuthCookies(
          redirectToHome(request),
          result.accessToken,
          result.refreshToken,
        );
      }

      if (!isRoleAllowed(pathname, payload.role)) {
        return redirectToHome(request);
      }

      return setAuthCookies(
        NextResponse.next(),
        result.accessToken,
        result.refreshToken,
      );
    }
  } catch {
    // Continue to NextAuth session fallback
  }

  // 3. Check NextAuth session (social auth)
  const sessionUser = request.auth?.user as SessionUser | undefined;

  if (sessionUser?.email) {
    try {
      const result = await socialAuth({
        email: sessionUser.email,
        name: sessionUser.name ?? sessionUser.email,
        avatar: sessionUser.image ?? "",
      });

      const payload = verifyAccessToken(result.accessToken);

      if (payload) {
        if (isAuthPage(pathname)) {
          return setAuthCookies(
            redirectToHome(request),
            result.accessToken,
            result.refreshToken,
          );
        }

        if (!isRoleAllowed(pathname, payload.role)) {
          return redirectToHome(request);
        }

        return setAuthCookies(
          NextResponse.next(),
          result.accessToken,
          result.refreshToken,
        );
      }
    } catch {
      // Backend authentication failed.
    }
  }

  // 4. Not authenticated
  if (requiresAuthentication) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
});

export { proxy };

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
