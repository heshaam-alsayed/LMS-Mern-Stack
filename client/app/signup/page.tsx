"use client";

import SignupForm from "@/components/form/SignupForm";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center px-4 mt-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-5 text-center">
          <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            ✨ Create your account
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Start learning today
          </h1>
        </div>

        <SignupForm mode="signup" toggleMode={() => router.push("/login")} />
      </div>
    </div>
  );
}
