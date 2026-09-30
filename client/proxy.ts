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
  provider?: string | null;
};

const LAST_ROUTE_COOKIE = "last_route";

const roleRoutes = {
  user: "/user",
  instructor: "/instructor",
  admin: "/admin",
};

const isAuthPage = (pathname: string) => {
  return (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  );
};

const getRouteRole = (pathname: string): Role | null => {
  if (
    pathname === roleRoutes.user ||
    pathname.startsWith(`${roleRoutes.user}/`)
  ) {
    return "user";
  }

  if (
    pathname === roleRoutes.instructor ||
    pathname.startsWith(`${roleRoutes.instructor}/`)
  ) {
    return "instructor";
  }

  if (
    pathname === roleRoutes.admin ||
    pathname.startsWith(`${roleRoutes.admin}/`)
  ) {
    return "admin";
  }

  return null;
};

const isRoleAllowed = (pathname: string, role: Role) => {
  const routeRole = getRouteRole(pathname);

  if (!routeRole) {
    return true;
  }

  return routeRole === role;
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

const redirectToLastRoute = (request: NextAuthRequest) => {
  const lastRoute = request.cookies.get(LAST_ROUTE_COOKIE)?.value;

  if (lastRoute && !isAuthPage(lastRoute)) {
    return NextResponse.redirect(new URL(lastRoute, request.url));
  }

  return redirectToHome(request);
};

const saveLastRoute = (response: NextResponse, pathname: string) => {
  response.cookies.set(LAST_ROUTE_COOKIE, pathname, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
};

const redirectToLogin = (request: NextAuthRequest) => {
  return NextResponse.redirect(new URL("/login", request.url));
};

const proxy = auth(async (request: NextAuthRequest) => {
  const { pathname } = request.nextUrl;

  // =========================
  // Protected routes
  // =========================

  const routeRole = getRouteRole(pathname);

  const requiresAuthentication = routeRole !== null;

  // =========================
  // 1. Access Token
  // =========================

  const accessToken = request.cookies.get("access_token")?.value;

  if (accessToken) {
    const payload = verifyAccessToken(accessToken);

    if (payload) {
      // Authenticated user cannot access auth pages
      if (isAuthPage(pathname)) {
        return redirectToLastRoute(request);
      }

      // Check role
      if (!isRoleAllowed(pathname, payload.role)) {
        return redirectToHome(request);
      }

      const response = NextResponse.next();

      // Save only protected role routes
      if (requiresAuthentication) {
        saveLastRoute(response, pathname);
      }

      return response;
    }
  }

  // =========================
  // 2. Refresh Token
  // =========================

  try {
    const result = await refreshAccessTokenServer(
      request.headers.get("cookie") ?? "",
    );

    const payload = verifyAccessToken(result.accessToken);

    if (payload) {
      // Authenticated user cannot access auth pages
      if (isAuthPage(pathname)) {
        return setAuthCookies(
          redirectToLastRoute(request),
          result.accessToken,
          result.refreshToken,
        );
      }

      // Check role
      if (!isRoleAllowed(pathname, payload.role)) {
        return setAuthCookies(
          redirectToHome(request),
          result.accessToken,
          result.refreshToken,
        );
      }

      const response = NextResponse.next();

      // Save only protected role routes
      if (requiresAuthentication) {
        saveLastRoute(response, pathname);
      }

      return setAuthCookies(response, result.accessToken, result.refreshToken);
    }
  } catch {
    // Continue to social authentication
  }

  // =========================
  // 3. Social Authentication
  // =========================

  const sessionUser = request.auth?.user as SessionUser | undefined;

  if (sessionUser?.email) {
    try {
      const result = await socialAuth({
        email: sessionUser.email,
        name: sessionUser.name ?? sessionUser.email,
        avatar: sessionUser.image ?? "",
        provider: sessionUser.provider ?? "",
      });

      const payload = verifyAccessToken(result.accessToken);

      if (payload) {
        // Authenticated user cannot access auth pages
        if (isAuthPage(pathname)) {
          return setAuthCookies(
            redirectToLastRoute(request),
            result.accessToken,
            result.refreshToken,
          );
        }

        // Check role
        if (!isRoleAllowed(pathname, payload.role)) {
          return setAuthCookies(
            redirectToHome(request),
            result.accessToken,
            result.refreshToken,
          );
        }

        const response = NextResponse.next();

        // Save only protected role routes
        if (requiresAuthentication) {
          saveLastRoute(response, pathname);
        }

        return setAuthCookies(
          response,
          result.accessToken,
          result.refreshToken,
        );
      }
    } catch {
      // Backend authentication failed
    }
  }

  // =========================
  // 4. Not Authenticated
  // =========================

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
