import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      name: string;
      email: string;
      role: "user" | "instructor" | "admin";
      avatar?: string;
      isVerified?: boolean;
      courses?: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: Session["user"];
  }
}
