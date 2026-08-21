"use server";

import { verificationResponse } from "@/types/auth.type";
import { cookies } from "next/headers";

export const verificationUserAction = async (activationCode:string) => {
  const cookieStore = await cookies();
  const activationToken = cookieStore.get("verificationToken")?.value;
  if (!activationToken) {
    throw new Error("No activation token found");
  }
  const body = {
    activation_token: activationToken,
    activation_code: activationCode,
  }; 
  const res = await fetch(`${process.env.SERVER_URI}/auth/activate-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data:verificationResponse = await res.json(); 
  if(!res.ok){
    throw new Error(data.message || "Error in activation Email");
  }
  return data;
};
