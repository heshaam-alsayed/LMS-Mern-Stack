import NextAuth, { customFetch } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { socialAuth } from "@/lib/api/socialAuth";
import { setAuthCookies } from "@/lib/setAuthCookies";
import { oauthFetch } from "@/lib/api/oauthFetch";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account" } },
    }),

    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  trustHost: true,
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Run only when the user just signed in with a provider
      if ((trigger === "signIn" || trigger === "signUp") && user?.email) {
        const result = await socialAuth({
          email: user.email,
          name: user.name ?? user.email,
          avatar: user.image ?? "",
        });

        await setAuthCookies(result.accessToken, result.refreshToken);

        token.user = result.user;
      }

      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as typeof session.user;
      }
      return session;
    },
  },
});
