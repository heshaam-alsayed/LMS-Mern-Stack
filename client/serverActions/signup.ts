"use server";

import { registerFormData, registerResponse } from "@/types/auth.type";
import { cookies } from "next/headers";

export const signupAction = async (formData: registerFormData) => {
  const serverURI = process.env.SERVER_URI;
  const res = await fetch(`${serverURI}/auth/registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data: registerResponse = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }
  const cookieStore = await cookies();
  cookieStore.set("verificationToken", data.verificationToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 5,
  });
  return {
    success: data.success,
    message: data.message,
  };
};
