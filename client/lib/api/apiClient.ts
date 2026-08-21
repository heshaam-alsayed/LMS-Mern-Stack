import { refreshAccessToken } from "./refreshAccessToken";

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  const serverURI = process.env.NEXT_PUBLIC_SERVER_URI;

  const url = `${serverURI}${endpoint}`;

  // First request
  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // Request succeeded
  if (response.status !== 401) {
    return response;
  }

  // Access token expired
  try {
    await refreshAccessToken();
  } catch (error) {
    throw new Error("Session expired");
  }

  // Retry request with new cookie
  response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  return response;
};
