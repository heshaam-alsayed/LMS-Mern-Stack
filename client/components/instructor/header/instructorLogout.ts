"use client";

import { signOut } from "next-auth/react";
import { toast } from "sonner";

export const handleInstructorLogout = async () => {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Logout failed");
    }

    await signOut({
      callbackUrl: "/",
    });

    toast.success("Logged out successfully!");
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Logout failed. Please try again.",
    );
  }
};
