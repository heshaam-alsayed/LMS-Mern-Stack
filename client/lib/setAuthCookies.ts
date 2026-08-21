import { getAccessCookieOptions, getRefreshCookieOptions } from "@/constants";

import { cookies } from "next/headers";

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, getAccessCookieOptions());

  cookieStore.set("refresh_token", refreshToken, getRefreshCookieOptions());
}
