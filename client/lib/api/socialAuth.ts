interface SocialAuthBody {
  email: string;
  name: string;
  avatar?: string;
}

export const socialAuth = async (body: SocialAuthBody) => {
  const serverURI = process.env.NEXT_PUBLIC_SERVER_URI;
  const res = await fetch(`${serverURI}/auth/social-auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Social authentication failed");
  }
  return result;
};
