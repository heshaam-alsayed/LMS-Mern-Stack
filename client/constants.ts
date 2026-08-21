import { ITokenOptions } from "./types/auth.type";

export const accessExpireMin = Number(process.env.ACCESS_TOKEN_EXPIRE);
export const refreshExpireDays = Number(process.env.REFRESH_TOKEN_EXPIRE);

export const getAccessCookieOptions = (): ITokenOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",

  // maxAge is in seconds
  maxAge: accessExpireMin * 60,

  // expires is calculated every time
  expires: new Date(Date.now() + accessExpireMin * 60 * 1000),
});

export const getRefreshCookieOptions = (): ITokenOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",

  maxAge: refreshExpireDays * 24 * 60 * 60,

  expires: new Date(Date.now() + refreshExpireDays * 24 * 60 * 60 * 1000),
});
