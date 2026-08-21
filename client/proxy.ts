import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { NextAuthRequest } from "next-auth";
import { auth } from "./auth";
import { refreshAccessToken } from "./lib/api/refreshAccessToken";
import { socialAuth } from "./lib/api/socialAuth";
import { refreshAccessTokenServer } from "./lib/api/refreshAccessTokenServer";

const protectedRoutes = ["/profile", "/dashboard", "/courses"];

const adminRoutes = ["/admin"];

type JwtPayload = {
  id: string;
  role: "user" | "instructor" | "admin";
};

type SessionUser = {
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: "user" | "instructor" | "admin";
};

const isRouteMatch = (pathname: string, routes: string[]) => {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
};

const isAuthPage = (pathname: string) =>
  pathname === "/login" || pathname === "/signup";

// Return payload if token is valid
// Return null if token is expired or invalid
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

// `auth()` also decrypts the next-auth session cookie, so provider logins
// (Google / GitHub) are recognized even without an app access_token cookie.
const proxy = auth(async (request: NextAuthRequest) => {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = isRouteMatch(pathname, protectedRoutes);

  const isAdminRoute = isRouteMatch(pathname, adminRoutes);

  // 1. Access token is valid -> allow the request
  const accessToken = request.cookies.get("access_token")?.value;

  if (accessToken) {
    const payload = verifyAccessToken(accessToken);

    if (payload) {
      // User is already logged in, don't allow login/signup
      if (isAuthPage(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Admin authorization
      if (isAdminRoute && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    }
  }

  // 2. Try to refresh the app access token using the refresh_token cookie
  try {
    const result = await refreshAccessTokenServer(
      request.headers.get("cookie") ?? "",
    );

    const payload = verifyAccessToken(result.accessToken);

    if (payload) {
      if (isAdminRoute && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return setAuthCookies(
        isAuthPage(pathname)
          ? NextResponse.redirect(new URL("/", request.url))
          : NextResponse.next(),
        result.accessToken,
        result.refreshToken,
      );
    }
  } catch {}

  // 3. Fallback: provider login via the next-auth session
  const sessionUser = request.auth?.user as SessionUser | undefined;

  if (sessionUser?.email) {
    // Re-mint the app tokens from the provider session so backend calls work
    try {
      const result = await socialAuth({
        email: sessionUser.email,
        name: sessionUser.name ?? sessionUser.email,
        avatar: sessionUser.image ?? "",
      });

      const payload = verifyAccessToken(result.accessToken);

      if (payload) {
        if (isAdminRoute && payload.role !== "admin") {
          return NextResponse.redirect(new URL("/", request.url));
        }

        return setAuthCookies(
          isAuthPage(pathname)
            ? NextResponse.redirect(new URL("/", request.url))
            : NextResponse.next(),
          result.accessToken,
          result.refreshToken,
        );
      }
    } catch {}

    // Session is valid but the app tokens could not be created -> still let the user in
    if (isAuthPage(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAdminRoute && sessionUser.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // 4. Not authenticated
  if (isProtectedRoute || isAdminRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
});

export { proxy };

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
