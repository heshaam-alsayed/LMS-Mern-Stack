const ACCESS_EXPIRE_MIN = 5;
const REFRESH_EXPIRE_DAYS = 7;

export const setClientAuthCookies = ({
  accessToken,
  refreshToken,
}: {
  accessToken?: string;
  refreshToken?: string;
}) => {
  if (typeof window === "undefined") return;

  const secure =
    window.location.protocol === "https:" ? "; Secure" : "";

  if (accessToken) {
    document.cookie = `access_token=${accessToken}; Path=/; Max-Age=${
      ACCESS_EXPIRE_MIN * 60
    }${secure}; SameSite=Lax`;
  }

  if (refreshToken) {
    document.cookie = `refresh_token=${refreshToken}; Path=/; Max-Age=${
      REFRESH_EXPIRE_DAYS * 24 * 60 * 60
    }${secure}; SameSite=Lax`;
  }
};