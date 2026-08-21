
export const refreshAccessTokenServer = async (cookie: string) => {
  const serverURI = process.env.NEXT_PUBLIC_SERVER_URI;

  const res = await fetch(`${serverURI}/auth/refresh-token`, {
    method: "GET",
    headers: {
      Cookie: cookie,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to refresh access token");
  }

  return result;
};
