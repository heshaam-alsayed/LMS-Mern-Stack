import { NextRequest, NextResponse } from "next/server";
import { getAccessCookieOptions, getRefreshCookieOptions } from "@/constants";

const serverURI = process.env.SERVER_URI!;

export async function GET(request: NextRequest) {
  try {
    await fetch(`${serverURI}/auth/logout-user`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") ?? "",
      },
    });
  } catch {}

  const response = NextResponse.json({ success: true });

  response.cookies.set("access_token", "", {
    ...getAccessCookieOptions(),
    maxAge: 0,
  });

  response.cookies.set("refresh_token", "", {
    ...getRefreshCookieOptions(),
    maxAge: 0,
  });

  return response;
}
