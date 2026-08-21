export const refreshAccessToken = async () => {
  const serverURI = process.env.NEXT_PUBLIC_SERVER_URI;

  const res = await fetch(`${serverURI}/auth/refresh-token`, {
    method: "GET",
    credentials: "include",
  });

  console.log(res);
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to refresh access token");
  }

  return result;
};
